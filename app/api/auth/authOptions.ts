import { prisma } from "@/prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET || "your-secret-key-here",
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: ""},
                password: { label: "Password", type: "password", placeholder: "" }
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: {email : credentials.email},
                });

                if (!user) return null;

                const passwordsMatch = await bcrypt.compare(credentials.password, user.password!);

                if (!passwordsMatch) return null;
                
                return {
                    id: user.id,
                    email: user.email,
                    fullname: user.fullname,
                    role: user.role 
                };
            },
        }),
            // GoogleProvider({
            //     clientId: process.env.GOOGLE_CLIENT_ID!,
            //     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            //     allowDangerousEmailAccountLinking: true
            // })
    ],
    callbacks: {
        async jwt({ token, user }) {
            // On sign in, `user` is available. Populate token with essential fields.
            if (user) {
                token.role = (user as any).role;
                (token as any).id = (user as any).id;
                // use fullname from User as display name
                (token as any).name = (user as any).fullname || (user as any).name || token.name;
                (token as any).email = (user as any).email || token.email;

                // Try to load profile image from the user's portfolio (profile_image)
                try {
                    const p = await prisma.portfolio.findFirst({ where: { user_id: (user as any).id } });
                    if (p?.profile_image) {
                        (token as any).image = p.profile_image;
                    }
                } catch {}

                return token;
            }

            // On subsequent requests, make sure token includes latest fullname/email/image by reading DB
            try {
                const userId = token.sub as string | undefined;
                if (userId) {
                    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
                    if (dbUser) {
                        (token as any).role = (token as any).role || dbUser.role;
                        (token as any).name = dbUser.fullname || (token as any).name;
                        (token as any).email = dbUser.email || (token as any).email;
                    }

                    const p = await prisma.portfolio.findFirst({ where: { user_id: userId } });
                    if (p?.profile_image) {
                        (token as any).image = p.profile_image;
                    }
                }
            } catch (e) {
                // ignore DB errors and return existing token
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = (token.sub as string) || ((token as any).id as string);
                (session.user as any).role = (token as any).role as string | undefined;
                // Copy standard profile fields from token so session contains name/email/image
                (session.user as any).name = (token as any).name || session.user.name;
                (session.user as any).email = (token as any).email || session.user.email;
                (session.user as any).image = (token as any).image || session.user.image;
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            try {
                const target = new URL(url, baseUrl);
                if (
                  target.pathname === "/dashboard" ||
                  target.pathname === "/" ||
                  target.pathname === "/signin"
                ) {
                    return baseUrl;
                }
                return target.href;
            } catch {
                return baseUrl;
            }
        },
    },
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/signin",
        signOut: "/signout",
    }
};
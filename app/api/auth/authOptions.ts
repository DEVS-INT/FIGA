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
            // Persist custom props on first sign in
            if (user) {
                token.role = (user as any).role;
                // NextAuth sets token.sub = user.id; keep an explicit id too for convenience
                (token as any).id = (user as any).id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                // Ensure id and role are available on the client/session
                // Prefer token.sub (standard) and fall back to token.id
                (session.user as any).id = (token.sub as string) || ((token as any).id as string);
                (session.user as any).role = (token as any).role as string | undefined; 
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            try {
                const target = new URL(url, baseUrl);
                // If coming from the default sign-in, route by role when landing at generic /dashboard
                if (
                  target.pathname === "/dashboard" ||
                  target.pathname === "/" ||
                  target.pathname === "/signin"
                ) {
                    // We can't read the token here, but NextAuth will call redirect after signIn with the provided callbackUrl.
                    // So, if no explicit app path is provided, keep default baseUrl.
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
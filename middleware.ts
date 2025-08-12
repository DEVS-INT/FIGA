import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/signin" },
  callbacks: {
    authorized: ({ token }) => !!token, // only allow if logged in
  },
});

export const config = {
  matcher: ["/dashboard/:path*"], // protect /dashboard/*
};

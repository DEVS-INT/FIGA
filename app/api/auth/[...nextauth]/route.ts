import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-options";

const handler = NextAuth(authOptions);

// v4 App Router: export GET + POST handlers
export { handler as GET, handler as POST };

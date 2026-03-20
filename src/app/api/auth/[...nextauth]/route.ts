import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
// This ONE file handles ALL auth routes automatically:
// /api/auth/signin
// /api/auth/signout
// /api/auth/session
// /api/auth/callback/google
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

import { NextResponse } from "next/server";
import { auth } from "./auth";

export default auth((req) => {
  const { nextUrl, auth: session } = req;

  if (!session) {
    const signInUrl = new URL("/signin", nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  const role = session.user?.role;

  if (nextUrl.pathname.startsWith("/employer") && role !== "EMPLOYER") {
    return NextResponse.redirect(new URL("/unauthorized", nextUrl.origin));
  }
  if (nextUrl.pathname.startsWith("/caregiver") && role !== "EMPLOYEE") {
    return NextResponse.redirect(new URL("/unauthorized", nextUrl.origin));
  }
  if (nextUrl.pathname.startsWith("/staff") && role !== "STAFF") {
    return NextResponse.redirect(new URL("/unauthorized", nextUrl.origin));
  }
});

export const config = {
  matcher: ["/employer/:path*", "/caregiver/:path*", "/staff/:path*"],
};


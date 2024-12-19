// middleware.ts
import { auth } from "./auth";
// import { NextResponse } from "next/server";

// Export auth middleware directly
export default auth;

// Optionally, you can still use the middleware config
export const config = {
  matcher: [
    "/config/:path*",
    "/chat/:path*",
    "/dashboard/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|login).*)",
  ],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function middleware(req: NextRequest) {
  // Protect all /admin routes
  if (req.nextUrl.pathname.startsWith("/admin")) {
    const token = req.cookies.get("authToken")?.value;

    if (!token) {
      // No token → redirect to sign-in
      return NextResponse.redirect(new URL("/auth/sign-in?error=unauthorized", req.url));
    }

    try {
      // Verify JWT
      jwt.verify(token, JWT_SECRET!);
      return NextResponse.next();
    } catch (err) {
      console.error("❌ Invalid token:", err);
      return NextResponse.redirect(new URL("/auth/sign-in?error=invalid_token", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"], // ensures only /admin pages are checked
};

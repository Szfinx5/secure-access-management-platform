import { NextResponse } from "next/server";

export function middleware(req) {
  const refreshToken = req.cookies.get("refreshToken")?.value; // Check if refreshToken exists
  const protectedRoutes = ["/profile", "/admin"];
  const guestRoutes = ["/login", "/register"];

  // If the user is logged in, prevent them from visiting guest-only pages
  if (guestRoutes.includes(req.nextUrl.pathname) && refreshToken) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  // If the user is NOT logged in, prevent them from visiting protected pages
  if (protectedRoutes.includes(req.nextUrl.pathname) && !refreshToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Apply middleware only to these routes
export const config = {
  matcher: ["/profile", "/admin", "/login", "/register"],
};

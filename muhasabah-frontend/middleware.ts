// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Routes that require authentication.
 * Each dashboard section can be role-restricted.
 */
const protectedRoutes = ["/dashboard", "/sittings", "/checkins", "/swot"];

// Allowed roles per route pattern
const roleAccess: Record<string, string[]> = {
  "/dashboard/student": ["student"],
  "/dashboard/head": ["sitting_head"],
  "/dashboard/overall_head": ["overall_head"],
  "/sittings": ["overall_head", "sitting_head"],
  "/todos": ["overall_head"],
  "/checkins": ["student"],
  "/swot": ["student", "sitting_head", "overall_head"], // Example: all roles
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip static files & API calls
  if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Check if route needs authentication
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const token = req.cookies.get("access")?.value;
    const role = req.cookies.get("role")?.value; // Set at login

    // No token → redirect to login
    if (!token) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based restriction
    for (const [routePrefix, allowedRoles] of Object.entries(roleAccess)) {
      if (pathname.startsWith(routePrefix) && !allowedRoles.includes(role || "")) {
        const unauthorizedUrl = req.nextUrl.clone();
        unauthorizedUrl.pathname = "/unauthorized";
        return NextResponse.redirect(unauthorizedUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/sittings/:path*",
    "/checkins/:path*",
    "/swot/:path*",
  ],
};

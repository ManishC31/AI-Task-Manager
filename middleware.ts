import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const roleRoutes: Record<string, string[]> = {
  ADMIN: ["/admin"],
  DEVELOPER: ["/developer"],
  MODERATOR: ["/moderator"],
  MANAGER: ["/manager"],
};

// Public routes that don't require authentication
const publicRoutes = ["/login", "/register", "/"];

// Routes that should redirect authenticated users to their dashboard
const authRedirectRoutes = ["/login", "/register", "/"];

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/public")
  ) {
    return NextResponse.next();
  }

  // Check if current path is a public route
  const isPublicRoute = publicRoutes.some((route) => (route === "/" ? pathname === "/" : pathname.startsWith(route)));

  // If user is not authenticated
  if (!token) {
    // Allow access to public routes only
    if (isPublicRoute) {
      return NextResponse.next();
    }
    // Redirect to login for protected routes
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // User is authenticated
  const userRole = token.role as string;

  // If authenticated user tries to access login, register, or homepage, redirect to their dashboard
  if (authRedirectRoutes.some((route) => (route === "/" ? pathname === "/" : pathname.startsWith(route)))) {
    const dashboardRoute = roleRoutes[userRole]?.[0] || "/admin";
    return NextResponse.redirect(new URL(dashboardRoute, req.url));
  }

  // Check role-specific access for protected routes
  const allowedRoutes = roleRoutes[userRole] || [];
  const isAllowed = allowedRoutes.some((route) => pathname.startsWith(route));

  if (!isAllowed) {
    return NextResponse.redirect(new URL("/not-found", req.url));
  }

  return NextResponse.next();
}

// Apply middleware to more paths - this is key!
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

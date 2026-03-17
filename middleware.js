import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

// Routes yang memerlukan autentikasi
const protectedRoutes = [
  "/sirkula-green-action",
  "/leaderboard",
  "/reedem",
  "/profile",
  "/dashboard",
];

const guestOnlyRoutes = ["/auth", "/sign-up"];

// Routes yang hanya bisa diakses oleh authenticated user (bukan dashboard)
const authenticatedOnlyRoutes = [
  "/sirkula-green-action",
  "/leaderboard",
  "/reedem",
  "/profile",
];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isGuestOnlyRoute = guestOnlyRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isAuthenticatedOnlyRoute = authenticatedOnlyRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Redirect ke auth jika mengakses protected route tanpa token
  if (isProtectedRoute && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Redirect ke home jika user sudah login mencoba akses guest-only routes
  if (isGuestOnlyRoute && token) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Role-based access control
  if (token) {
    try {
      // Decode JWT token
      const decoded = jwtDecode(token);
      const role = decoded.role;

      // Jika user dengan role UMKM/DLH/ADMIN mencoba akses route selain dashboard
      if (
        (role === "UMKM" || role === "DLH" || role === "ADMIN") &&
        isAuthenticatedOnlyRoute
      ) {
        const url = request.nextUrl.clone();

        // Redirect ke dashboard sesuai role
        if (role === "UMKM") {
          url.pathname = "/dashboard/umkm";
        } else if (role === "DLH") {
          url.pathname = "/dashboard/dinas";
        } else if (role === "ADMIN") {
          url.pathname = "/dashboard/admin";
        }

        return NextResponse.redirect(url);
      }

      // Jika user biasa (bukan UMKM/DLH/ADMIN) mencoba akses dashboard
      if (
        role !== "UMKM" &&
        role !== "DLH" &&
        role !== "ADMIN" &&
        pathname.startsWith("/dashboard")
      ) {
        const url = request.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
      }
    } catch (error) {
      // Jika token tidak valid, hapus cookie dan redirect ke auth
      const response = NextResponse.redirect(new URL("/auth", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
  ],
};

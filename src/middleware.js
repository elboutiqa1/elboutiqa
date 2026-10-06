import { NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";
import { rateLimit } from "./lib/rate-limit";

// API routes publiques qui ne nécessitent pas d'authentification
const PUBLIC_API_ROUTES = [
  { path: "/api/auth/login", methods: ["POST"] },
  { path: "/api/products", methods: ["GET"] },
  { path: "/api/category", methods: ["GET"] },
  { path: "/api/order", methods: ["POST"] },
];

// Routes avec rate limiting (protection contre les abus)
const RATE_LIMITED_ROUTES = {
  "/api/auth/login": { maxRequests: 5, windowMs: 60 * 1000 },    // 5 tentatives / minute
  "/api/order": { maxRequests: 3, windowMs: 60 * 1000 },          // 3 commandes / minute
};

function isPublicApiRoute(pathname, method) {
  return PUBLIC_API_ROUTES.some(
    (route) =>
      pathname === route.path &&
      route.methods.includes(method)
  );
}

function getClientIP(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // ─── Protection des pages du dashboard ───
  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const payload = await verifyToken(token);

    if (!payload) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("auth_token");
      return response;
    }

    return NextResponse.next();
  }

  // ─── Protection des API routes ───
  if (pathname.startsWith("/api/")) {

    // Rate limiting sur les routes sensibles
    const rateLimitConfig = RATE_LIMITED_ROUTES[pathname];
    if (rateLimitConfig && method === "POST") {
      const ip = getClientIP(request);
      const key = `${ip}:${pathname}`;
      const result = rateLimit(key, rateLimitConfig);

      if (!result.success) {
        return NextResponse.json(
          {
            success: false,
            message: "Trop de requêtes. Réessayez plus tard.",
          },
          {
            status: 429,
            headers: {
              "Retry-After": String(Math.ceil(result.resetIn / 1000)),
            },
          }
        );
      }
    }

    // Laisser passer les routes publiques
    if (isPublicApiRoute(pathname, method)) {
      return NextResponse.next();
    }

    // Toutes les autres API nécessitent un JWT valide
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Non authentifié" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Token invalide ou expiré" },
        { status: 401 }
      );
    }

    // Ajouter les infos de l'utilisateur dans le header pour les route handlers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-role", payload.role || "");
    requestHeaders.set("x-user-name", payload.username || "");

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
import { NextResponse } from "next/server";
import { verifyJWT } from "@/utils/auth";

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://springhouse.in",
  "https://www.springhouse.in",
];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const method = request.method;
  const origin = request.headers.get("origin");
 

  // 1. Handle CORS Preflight (OPTIONS)
  if (method === "OPTIONS") {
    const isAllowedOrigin = ALLOWED_ORIGINS.includes(origin);
    const response = new NextResponse(null, { status: 204 });

    if (isAllowedOrigin) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
      response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
      response.headers.set("Access-Control-Allow-Credentials", "true");
    }
    return response;
  }

  // 2. Protect /admin (Frontend)
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("token")?.value;
    const verifiedToken =
      token &&
      (await verifyJWT(token).catch((err) => {
        console.error("Admin verify Error:", err);
      }));

    if (!verifiedToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 3. Protect /api routes
  if (pathname.startsWith("/api")) {
    const isPublicRoute =
      pathname === "/api/auth/login" ||
      pathname === "/api/auth/forgot-password" ||
      pathname === "/api/auth/reset-password" ||
      pathname === "/api/enquire" ||
      (pathname === "/api/careers" && method === "POST");

    if (!isPublicRoute) {
      const isAdminApi = pathname.startsWith("/api/admin");
      const isDataModifying = ["POST", "PUT", "DELETE", "PATCH"].includes(method);

      if (isAdminApi || isDataModifying) {
        const token = request.cookies.get("token")?.value;
        const verifiedToken =
          token &&
          (await verifyJWT(token).catch((err) => {
            console.error("API verify Error:", err);
          }));

        if (!verifiedToken) {
          return NextResponse.json(
            { success: false, error: "Unauthorized access" },
            { status: 401 }
          );
        }
      }
    }
  }

  // 4. Redirect /login if already authenticated
  if (pathname === "/login") {
    const token = request.cookies.get("token")?.value;
    const verifiedToken =
      token &&
      (await verifyJWT(token).catch((err) => {
        console.error(err);
      }));

    if (verifiedToken) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // Final response with CORS headers if origin is allowed
  const response = NextResponse.next();
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/api/:path*"],
};

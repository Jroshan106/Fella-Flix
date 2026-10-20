import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession, verifyAdminAuthorization } from "./lib/auth";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path === "/login" || path === "/api/auth/login" || path === "/api/auth/logout") return NextResponse.next();
  const viewer = verifySession(request.cookies.get(SESSION_COOKIE)?.value);
  const headers = { "Cache-Control": "private, no-store" };
  if (!viewer) {
    if (path.startsWith("/api/") || !["GET", "HEAD"].includes(request.method)) {
      return NextResponse.json({ error: "Sign in to continue." }, { status: 401, headers });
    }
    const url = new URL("/login", request.url);
    url.searchParams.set("next", path + request.nextUrl.search);
    return NextResponse.redirect(url, { headers });
  }
  if ((path === "/admin" || path.startsWith("/admin/")) && !verifyAdminAuthorization(request.headers.get("authorization"))) {
    return new NextResponse("Administrator login required", { status: 401, headers: { ...headers, "WWW-Authenticate": 'Basic realm="FellaFLIX Admin", charset="UTF-8"' } });
  }
  return NextResponse.next({ headers });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|images/|favicon.ico|icon.png|apple-icon.png).*)"],
};

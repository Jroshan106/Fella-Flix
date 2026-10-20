import { NextResponse, type NextRequest } from "next/server";
import { verifyAdminAuthorization } from "./lib/admin-auth";

export function proxy(request: NextRequest) {
  if (verifyAdminAuthorization(request.headers.get("authorization"))) return NextResponse.next();
  return new NextResponse("Administrator login required", {
    status: 401,
    headers: { "Cache-Control": "private, no-store", "WWW-Authenticate": 'Basic realm="FellaFLIX Admin", charset="UTF-8"' },
  });
}

export const config = { matcher: ["/admin", "/admin/:path*"] };

import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, SESSION_OPTIONS } from "@/lib/auth";

export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const response = NextResponse.redirect(new URL("/login", request.url), { status: 303, headers: { "Cache-Control": "no-store" } });
  response.cookies.set(SESSION_COOKIE, "", { ...SESSION_OPTIONS, maxAge: 0 });
  return response;
}

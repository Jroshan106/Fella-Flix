import { NextRequest, NextResponse } from "next/server";
import { authConfigured, checkCredentials, createSession, safeReturnPath, SESSION_COOKIE, SESSION_OPTIONS, SESSION_SECONDS, takeLoginAttempt } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const headers = { "Cache-Control": "no-store" };
  if (request.headers.get("origin") !== request.nextUrl.origin) return NextResponse.json({ error: "Invalid request origin." }, { status: 403, headers });
  if (!authConfigured()) return NextResponse.json({ error: "Sign-in is not set up yet. Please contact the site owner." }, { status: 503, headers });
  if (Number(request.headers.get("content-length") || 0) > 4096) return NextResponse.json({ error: "Invalid login details." }, { status: 400, headers });
  let form: FormData;
  try {
    const reader = request.body?.getReader();
    if (!reader) throw new Error("Missing body");
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 4096) { await reader.cancel(); throw new Error("Body too large"); }
      chunks.push(value);
    }
    form = await new Request(request.url, { method: "POST", headers: { "Content-Type": request.headers.get("content-type") || "" }, body: Buffer.concat(chunks) }).formData();
  }
  catch { return NextResponse.json({ error: "Invalid login details." }, { status: 400, headers }); }
  const username = form.get("username");
  const password = form.get("password");
  if (typeof username !== "string" || typeof password !== "string" || username.length > 64 || password.length > 256) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 400, headers });
  }
  if (!takeLoginAttempt(username)) return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429, headers: { ...headers, "Retry-After": "900" } });
  const viewer = await checkCredentials(username, password);
  if (!viewer) return NextResponse.json({ error: "Invalid username or password." }, { status: 401, headers });
  const response = NextResponse.json({ next: safeReturnPath(form.get("next")) }, { headers });
  response.cookies.set(SESSION_COOKIE, createSession(viewer), { ...SESSION_OPTIONS, maxAge: SESSION_SECONDS });
  return response;
}

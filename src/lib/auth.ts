import "server-only";
import { createHash, createHmac, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

export const SESSION_COOKIE = "fellaflix_session";
export const SESSION_SECONDS = 8 * 60 * 60;
export const SESSION_OPTIONS = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/" };
const deriveKey = promisify(scrypt);
type Account = { username: string; passwordHash: string };
export type Viewer = { username: string };

function accounts(): Account[] {
  try {
    const data: unknown = JSON.parse(process.env.VIEWER_ACCOUNTS || "[]");
    if (!Array.isArray(data) || !data.length || data.length > 200) return [];
    const seen = new Set<string>();
    for (const account of data) {
      if (!account || typeof account.username !== "string" || !/^[a-z0-9][a-z0-9._-]{1,63}$/.test(account.username) ||
          typeof account.passwordHash !== "string" || !/^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$/.test(account.passwordHash) || seen.has(account.username)) return [];
      seen.add(account.username);
    }
    return data;
  } catch { return []; }
}

export function authConfigured() {
  return (process.env.AUTH_SESSION_SECRET?.length ?? 0) >= 32 && accounts().length > 0;
}

export async function checkCredentials(username: string, password: string): Promise<Viewer | null> {
  if (!authConfigured() || password.length > 256 || username.length > 64) return null;
  const account = accounts().find(item => item.username === username.trim().toLowerCase());
  const [, salt, expected] = (account?.passwordHash ?? `scrypt:${"0".repeat(32)}:${"0".repeat(128)}`).split(":");
  const actual = await deriveKey(password, salt, 64) as Buffer;
  return timingSafeEqual(actual, Buffer.from(expected, "hex")) && account ? { username: account.username } : null;
}

function revision(account: Account) { return createHash("sha256").update(account.passwordHash).digest("hex"); }
function sign(payload: string) { return createHmac("sha256", process.env.AUTH_SESSION_SECRET!).update(payload).digest("base64url"); }

export function createSession(viewer: Viewer, now = Date.now()): string {
  const account = accounts().find(item => item.username === viewer.username);
  if (!authConfigured() || !account) throw new Error("Login is not configured.");
  const payload = Buffer.from(JSON.stringify({ username: account.username, revision: revision(account), expires: Math.floor(now / 1000) + SESSION_SECONDS })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySession(token?: string, now = Date.now()): Viewer | null {
  if (!authConfigured() || !token || token.length > 2048) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 2 || !parts.every(part => /^[A-Za-z0-9_-]+$/.test(part))) return null;
    const [payload, signature] = parts;
    const expected = Buffer.from(sign(payload));
    const supplied = Buffer.from(signature);
    if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) return null;
    const session = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (!Number.isSafeInteger(session.expires) || session.expires <= Math.floor(now / 1000) || session.expires > Math.floor(now / 1000) + SESSION_SECONDS) return null;
    const account = accounts().find(item => item.username === session.username);
    return account && revision(account) === session.revision ? { username: account.username } : null;
  } catch { return null; }
}

export function safeReturnPath(value: unknown): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || /[\\\x00-\x1f]|%2f|%5c/i.test(value)) return "/";
  const url = new URL(value, "https://fellaflix.invalid");
  if (url.origin !== "https://fellaflix.invalid" || url.pathname === "/login" || url.pathname.startsWith("/api/")) return "/";
  return url.pathname + url.search;
}

// Per-instance throttling; serverless instances do not share these counters.
const attempts = new Map<string, { count: number; expires: number }>();
export function takeLoginAttempt(username: string, now = Date.now()): boolean {
  const key = createHash("sha256").update(username.trim().toLowerCase().slice(0, 64)).digest("hex");
  let entry = attempts.get(key);
  if (!entry || entry.expires <= now) {
    if (attempts.size >= 10000) attempts.clear();
    entry = { count: 0, expires: now + 15 * 60 * 1000 };
    attempts.set(key, entry);
  }
  return ++entry.count <= 8;
}

export function verifyAdminAuthorization(value: string | null): boolean {
  if (!process.env.ADMIN_PASSWORD || !value?.startsWith("Basic ")) return false;
  try {
    const decoded = Buffer.from(value.slice(6), "base64").toString();
    if (decoded.indexOf(":") < 0) return false;
    const actual = createHash("sha256").update(decoded).digest();
    const expected = createHash("sha256").update(`${process.env.ADMIN_USERNAME || "admin"}:${process.env.ADMIN_PASSWORD}`).digest();
    return timingSafeEqual(actual, expected);
  } catch { return false; }
}

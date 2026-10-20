import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";

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

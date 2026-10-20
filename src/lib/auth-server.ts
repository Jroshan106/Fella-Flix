import "server-only";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "./auth";

export async function currentViewer() {
  return verifySession((await cookies()).get(SESSION_COOKIE)?.value);
}

export async function requireViewer() {
  const viewer = await currentViewer();
  if (!viewer) throw new Error("Sign in to continue.");
  return viewer;
}

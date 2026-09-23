import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";
import { readCollection } from "./store";
import type { AdminUser } from "./types";

const SESSION_COOKIE = "bbp_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

function secret(): string {
  return process.env.AUTH_SECRET || "bbp-dev-secret-change-me";
}

export function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

export function verifyPassword(password: string, salt: string, hash: string): boolean {
  const candidate = hashPassword(password, salt);
  const a = Buffer.from(candidate, "hex");
  const b = Buffer.from(hash, "hex");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function sign(value: string): string {
  return crypto.createHmac("sha256", secret()).update(value).digest("hex");
}

function makeToken(username: string, expiresAt: number): string {
  const payload = `${username}.${expiresAt}`;
  return `${Buffer.from(payload).toString("base64url")}.${sign(payload)}`;
}

function parseToken(token: string): { username: string; expiresAt: number } | null {
  const [payloadB64, sig] = token.split(".");
  if (!payloadB64 || !sig) return null;
  const payload = Buffer.from(payloadB64, "base64url").toString("utf-8");
  if (sign(payload) !== sig) return null;
  const [username, expiresAtStr] = payload.split(".");
  const expiresAt = Number(expiresAtStr);
  if (!username || Number.isNaN(expiresAt)) return null;
  if (Date.now() > expiresAt) return null;
  return { username, expiresAt };
}

export async function findAdminUser(username: string): Promise<AdminUser | null> {
  const users = await readCollection<AdminUser[]>("admin-users", []);
  return users.find((u) => u.username.toLowerCase() === username.toLowerCase()) ?? null;
}

/** Verifies credentials and, if valid, sets the signed session cookie. */
export async function login(username: string, password: string): Promise<AdminUser | null> {
  const user = await findAdminUser(username);
  if (!user) return null;
  if (!verifyPassword(password, user.salt, user.passwordHash)) return null;

  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;
  const token = makeToken(user.username, expiresAt);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return user;
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** Reads the current session (Server Components, Server Actions, Route Handlers). */
export async function getSession(): Promise<AdminUser | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  const parsed = parseToken(raw);
  if (!parsed) return null;
  return findAdminUser(parsed.username);
}

export { SESSION_COOKIE };

import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";
import { readCollection, readCollectionFresh } from "./store";
import type { AdminUser } from "./types";

const SESSION_COOKIE = "bbp_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 12; // 12 hours

function secret(): string {
  return process.env.AUTH_SECRET || "bbp-dev-secret-change-me";
}

export function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

export function newPasswordHash(password: string): { salt: string; passwordHash: string } {
  const salt = crypto.randomBytes(16).toString("hex");
  return { salt, passwordHash: hashPassword(password, salt) };
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
  const expected = sign(payload);
  if (expected.length !== sig.length || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return null;
  const dot = payload.lastIndexOf(".");
  const username = payload.slice(0, dot);
  const expiresAt = Number(payload.slice(dot + 1));
  if (!username || Number.isNaN(expiresAt)) return null;
  if (Date.now() > expiresAt) return null;
  return { username, expiresAt };
}

export async function findAdminUser(username: string, fresh = false): Promise<AdminUser | null> {
  const users = fresh
    ? await readCollectionFresh<AdminUser[]>("admin-users", [])
    : await readCollection<AdminUser[]>("admin-users", []);
  return users.find((u) => u.username.toLowerCase() === username.toLowerCase()) ?? null;
}

/*
 * Slows down password guessing: after 5 wrong passwords for one username,
 * further attempts are refused for 10 minutes. Per server instance only,
 * which is enough to make online guessing impractical.
 */
const failures = new Map<string, { count: number; until: number }>();
const MAX_FAILURES = 5;
const LOCK_MS = 10 * 60 * 1000;

export function loginLockedFor(username: string): number {
  const f = failures.get(username.toLowerCase());
  if (!f || f.count < MAX_FAILURES) return 0;
  const left = f.until - Date.now();
  if (left <= 0) {
    failures.delete(username.toLowerCase());
    return 0;
  }
  return Math.ceil(left / 60000);
}

/** Verifies credentials and, if valid, sets the signed session cookie. */
export async function login(username: string, password: string): Promise<AdminUser | null> {
  const key = username.toLowerCase();
  const user = await findAdminUser(username, true);
  if (!user || !verifyPassword(password, user.salt, user.passwordHash)) {
    const f = failures.get(key) ?? { count: 0, until: 0 };
    f.count += 1;
    f.until = Date.now() + LOCK_MS;
    failures.set(key, f);
    return null;
  }
  failures.delete(key);

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

/** For server actions: the signed-in user, or an error if there is none. */
export async function requireSession(): Promise<AdminUser> {
  const session = await getSession();
  if (!session) throw new Error("Sesi berakhir. Silakan masuk lagi.");
  return session;
}

/** For server actions that change content: viewers may look but not edit. */
export async function requireEditor(): Promise<AdminUser> {
  const session = await requireSession();
  if (session.role === "viewer") throw new Error("Akun Anda hanya bisa melihat, tidak bisa mengubah.");
  return session;
}

export async function requireAdmin(): Promise<AdminUser> {
  const session = await requireSession();
  if (session.role !== "admin") throw new Error("Hanya akun admin yang bisa melakukan ini.");
  return session;
}

export { SESSION_COOKIE };

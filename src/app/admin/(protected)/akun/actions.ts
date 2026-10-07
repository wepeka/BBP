"use server";

import { newPasswordHash, requireAdmin, requireSession, verifyPassword } from "@/lib/auth";
import { getAdminUsers, saveAdminUsers } from "@/lib/repo";
import type { AdminRole } from "@/lib/types";

export type SimpleResult = { ok: true } | { ok: false; error: string };
const ROLES: AdminRole[] = ["admin", "editor", "viewer"];
const MIN = 8;

export async function changeOwnPasswordAction(current: string, next: string): Promise<SimpleResult> {
  try {
    const session = await requireSession();
    if (next.length < MIN) return { ok: false, error: `Kata sandi baru minimal ${MIN} karakter.` };
    const users = await getAdminUsers();
    const idx = users.findIndex((u) => u.username === session.username);
    if (idx === -1) return { ok: false, error: "Akun tidak ditemukan." };
    if (!verifyPassword(current, users[idx].salt, users[idx].passwordHash)) return { ok: false, error: "Kata sandi saat ini salah." };
    users[idx] = { ...users[idx], ...newPasswordHash(next) };
    await saveAdminUsers(users);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function saveUserAction(
  username: string | null,
  data: { username: string; name: string; role: AdminRole; password: string }
): Promise<SimpleResult> {
  try {
    const session = await requireAdmin();
    const users = await getAdminUsers();
    const role = ROLES.includes(data.role) ? data.role : "editor";
    const name = data.name.trim();
    if (!name) return { ok: false, error: "Isi nama pengguna." };

    if (!username) {
      const uname = data.username.trim().toLowerCase();
      if (!/^[a-z0-9._-]{3,32}$/.test(uname)) return { ok: false, error: "Nama login 3–32 karakter: huruf kecil, angka, titik, strip." };
      if (users.some((u) => u.username.toLowerCase() === uname)) return { ok: false, error: "Nama login sudah dipakai." };
      if (data.password.length < MIN) return { ok: false, error: `Kata sandi minimal ${MIN} karakter.` };
      users.push({ username: uname, name, role, ...newPasswordHash(data.password) });
    } else {
      const idx = users.findIndex((u) => u.username === username);
      if (idx === -1) return { ok: false, error: "Akun tidak ditemukan." };
      if (username === session.username && role !== "admin") return { ok: false, error: "Anda tidak bisa menurunkan peran akun sendiri." };
      if (data.password && data.password.length < MIN) return { ok: false, error: `Kata sandi minimal ${MIN} karakter.` };
      users[idx] = { ...users[idx], name, role, ...(data.password ? newPasswordHash(data.password) : {}) };
    }
    if (!users.some((u) => u.role === "admin")) return { ok: false, error: "Harus ada minimal satu akun admin." };
    await saveAdminUsers(users);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deleteUserAction(username: string): Promise<SimpleResult> {
  try {
    const session = await requireAdmin();
    if (username === session.username) return { ok: false, error: "Anda tidak bisa menghapus akun sendiri." };
    const users = (await getAdminUsers()).filter((u) => u.username !== username);
    if (!users.some((u) => u.role === "admin")) return { ok: false, error: "Harus ada minimal satu akun admin." };
    await saveAdminUsers(users);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

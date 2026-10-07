"use server";

import { redirect } from "next/navigation";
import { login, loginLockedFor } from "@/lib/auth";

export interface LoginFormState {
  error: string | null;
  username?: string;
}

export async function loginAction(_prevState: LoginFormState, formData: FormData): Promise<LoginFormState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "/admin");

  if (!username || !password) {
    return { error: "Masukkan nama pengguna dan kata sandi.", username };
  }
  const locked = loginLockedFor(username);
  if (locked) {
    return { error: `Terlalu banyak percobaan. Coba lagi dalam ${locked} menit.`, username };
  }

  const user = await login(username, password);
  if (!user) {
    return { error: "Nama pengguna atau kata sandi salah.", username };
  }

  redirect(from.startsWith("/admin") && !from.startsWith("/admin/login") ? from : "/admin");
}

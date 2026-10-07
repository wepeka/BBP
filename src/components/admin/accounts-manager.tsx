"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { KeyRound, Loader2, Pencil, Plus, Trash2, UserRound } from "lucide-react";
import type { AdminRole } from "@/lib/types";
import { changeOwnPasswordAction, deleteUserAction, saveUserAction } from "@/app/admin/(protected)/akun/actions";
import { useAdmin } from "./admin-context";
import { Modal } from "./controls";
import { Badge, Card, FieldShell, SectionTitle, buttonClass, inputClass } from "./ui";

const ROLES: { id: AdminRole; label: string; description: string }[] = [
  { id: "admin", label: "Admin", description: "Semua akses, termasuk mengelola akun." },
  { id: "editor", label: "Editor", description: "Bisa mengubah konten, tidak bisa mengelola akun." },
  { id: "viewer", label: "Hanya lihat", description: "Bisa membuka admin dan inbox, tidak bisa mengubah." },
];

interface UserRow {
  username: string;
  name: string;
  role: AdminRole;
}

export function AccountsManager({ me, isAdmin, users }: { me: string; isAdmin: boolean; users: UserRow[] }) {
  const router = useRouter();
  const { toast, confirm } = useAdmin();
  const [busy, startBusy] = useTransition();
  const [pw, setPw] = useState({ current: "", next: "", repeat: "" });
  const [editing, setEditing] = useState<{ username: string | null; data: UserRow & { password: string } } | null>(null);

  function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (pw.next !== pw.repeat) return toast("Ulangi kata sandi baru dengan sama persis.", "error");
    startBusy(async () => {
      const res = await changeOwnPasswordAction(pw.current, pw.next);
      if (!res.ok) return toast(res.error, "error");
      setPw({ current: "", next: "", repeat: "" });
      toast("Kata sandi diganti. Pakai kata sandi baru saat masuk berikutnya.");
    });
  }

  function saveUser() {
    if (!editing) return;
    startBusy(async () => {
      const res = await saveUserAction(editing.username, editing.data);
      if (!res.ok) return toast(res.error, "error");
      toast(editing.username ? "Akun diperbarui." : "Akun dibuat. Berikan nama login & kata sandinya ke rekan Anda.");
      setEditing(null);
      router.refresh();
    });
  }

  async function remove(u: UserRow) {
    const ok = await confirm({ title: `Hapus akun ${u.name}?`, body: "Orang ini tidak bisa masuk ke admin lagi.", confirmLabel: "Hapus akun", danger: true });
    if (!ok) return;
    const res = await deleteUserAction(u.username);
    if (!res.ok) return toast(res.error, "error");
    toast("Akun dihapus.");
    router.refresh();
  }

  const setData = (p: Partial<UserRow & { password: string }>) => setEditing((e) => (e ? { ...e, data: { ...e.data, ...p } } : e));

  return (
    <div className="grid gap-5 xl:grid-cols-2 xl:items-start">
      <Card>
        <SectionTitle description="Minimal 8 karakter. Gabungan huruf, angka, dan simbol lebih aman.">Ganti kata sandi saya</SectionTitle>
        <form onSubmit={changePassword} className="space-y-4">
          <input type="text" name="username" autoComplete="username" value={me} readOnly hidden />
          <FieldShell label="Kata sandi saat ini" htmlFor="pw-cur">
            <input id="pw-cur" type="password" autoComplete="current-password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} className={inputClass} required />
          </FieldShell>
          <FieldShell label="Kata sandi baru" htmlFor="pw-new">
            <input id="pw-new" type="password" autoComplete="new-password" minLength={8} value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} className={inputClass} required />
          </FieldShell>
          <FieldShell label="Ulangi kata sandi baru" htmlFor="pw-rep" error={pw.repeat && pw.repeat !== pw.next ? "Belum sama dengan kata sandi baru." : undefined}>
            <input id="pw-rep" type="password" autoComplete="new-password" value={pw.repeat} onChange={(e) => setPw({ ...pw, repeat: e.target.value })} className={inputClass} required />
          </FieldShell>
          <button type="submit" disabled={busy || !pw.current || pw.next.length < 8 || pw.next !== pw.repeat} className={buttonClass("primary")}>
            {busy ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : <KeyRound size={15} aria-hidden="true" />} Ganti kata sandi
          </button>
        </form>
      </Card>

      <Card>
        <div className="mb-4 flex items-start justify-between gap-3">
          <SectionTitle description={isAdmin ? "Atur siapa saja yang bisa masuk ke admin." : "Hanya akun Admin yang bisa menambah atau mengubah akun."}>Semua akun</SectionTitle>
          {isAdmin && (
            <button type="button" onClick={() => setEditing({ username: null, data: { username: "", name: "", role: "editor", password: "" } })} className={buttonClass("secondary", "sm")}>
              <Plus size={14} aria-hidden="true" /> Tambah akun
            </button>
          )}
        </div>
        <ul className="divide-y divide-[var(--color-line)]">
          {users.map((u) => (
            <li key={u.username} className="flex items-center gap-3 py-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-teal-soft)] text-[var(--color-teal-text)]">
                <UserRound size={18} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 text-[14px] font-semibold text-[var(--color-ink)]">
                  {u.name}
                  {u.username === me && <Badge tone="green">Anda</Badge>}
                </p>
                <p className="font-data text-[12px] text-[var(--color-ink-3)]">
                  {u.username} · {ROLES.find((r) => r.id === u.role)?.label}
                </p>
              </div>
              {isAdmin && (
                <>
                  <button type="button" onClick={() => setEditing({ username: u.username, data: { ...u, password: "" } })} className={buttonClass("secondary", "sm")}>
                    <Pencil size={13} aria-hidden="true" /> Ubah
                  </button>
                  {u.username !== me && (
                    <button type="button" onClick={() => remove(u)} aria-label={`Hapus ${u.name}`} className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[var(--color-ink-3)] hover:bg-[var(--color-red)]/10 hover:text-[var(--color-red)]">
                      <Trash2 size={15} aria-hidden="true" />
                    </button>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      </Card>

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing?.username ? "Ubah akun" : "Tambah akun"}
        footer={
          <>
            <button type="button" onClick={() => setEditing(null)} className={buttonClass("secondary")}>
              Batal
            </button>
            <button type="button" onClick={saveUser} disabled={busy} className={buttonClass("primary")}>
              {busy && <Loader2 size={15} className="animate-spin" aria-hidden="true" />}
              {editing?.username ? "Simpan akun" : "Buat akun"}
            </button>
          </>
        }
      >
        {editing && (
          <div className="space-y-4">
            <FieldShell label="Nama" htmlFor="u-name">
              <input id="u-name" value={editing.data.name} onChange={(e) => setData({ name: e.target.value })} className={inputClass} />
            </FieldShell>
            <FieldShell label="Nama login" htmlFor="u-login" hint={editing.username ? "Nama login tidak bisa diubah." : "Huruf kecil tanpa spasi, mis. yiyin"}>
              <input id="u-login" value={editing.data.username} disabled={Boolean(editing.username)} onChange={(e) => setData({ username: e.target.value })} className={`${inputClass} font-data`} autoComplete="off" />
            </FieldShell>
            <FieldShell label={editing.username ? "Kata sandi baru (opsional)" : "Kata sandi"} htmlFor="u-pass" hint={editing.username ? "Kosongkan jika tidak ingin mengganti." : "Minimal 8 karakter."}>
              <input id="u-pass" type="password" autoComplete="new-password" value={editing.data.password} onChange={(e) => setData({ password: e.target.value })} className={inputClass} />
            </FieldShell>
            <fieldset>
              <legend className="mb-2 text-[13px] font-semibold text-[var(--color-ink)]">Peran</legend>
              <div className="space-y-2">
                {ROLES.map((r) => (
                  <label key={r.id} className={`flex cursor-pointer items-start gap-3 rounded-[6px] border p-3 ${editing.data.role === r.id ? "border-[var(--color-teal)] bg-[var(--color-teal-soft)]" : "border-[var(--color-line)]"}`}>
                    <input type="radio" name="role" checked={editing.data.role === r.id} onChange={() => setData({ role: r.id })} className="mt-1 accent-[var(--color-teal)]" />
                    <span>
                      <span className="block text-[13.5px] font-semibold text-[var(--color-ink)]">{r.label}</span>
                      <span className="block text-[12.5px] text-[var(--color-ink-2)]">{r.description}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        )}
      </Modal>
    </div>
  );
}

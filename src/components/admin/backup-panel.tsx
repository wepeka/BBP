"use client";

import { useRouter } from "next/navigation";
import { useRef, useTransition } from "react";
import { Download, Loader2, Upload } from "lucide-react";
import { restoreBackupAction } from "@/app/admin/(protected)/cadangan/actions";
import { useAdmin } from "./admin-context";
import { Card, SectionTitle, buttonClass } from "./ui";

export function BackupPanel({ isAdmin }: { isAdmin: boolean }) {
  const router = useRouter();
  const { toast, confirm, canEdit } = useAdmin();
  const input = useRef<HTMLInputElement>(null);
  const [busy, startBusy] = useTransition();

  async function restore(file: File) {
    const ok = await confirm({
      title: "Pulihkan dari cadangan?",
      body: `Isi website sekarang akan diganti dengan isi file “${file.name}”. Unduh cadangan terbaru dulu jika ragu.`,
      confirmLabel: "Pulihkan",
      danger: true,
    });
    if (!ok) return;
    const text = await file.text();
    startBusy(async () => {
      const res = await restoreBackupAction(text);
      if (!res.ok) return toast(res.error, "error");
      toast(`Dipulihkan: ${res.restored.length} bagian data.`);
      router.refresh();
    });
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card>
        <SectionTitle description="Disarankan sebulan sekali, dan sebelum perubahan besar.">Unduh cadangan</SectionTitle>
        <a href="/api/admin/backup" className={buttonClass("primary", "md", canEdit ? "" : "pointer-events-none opacity-50")}>
          <Download size={15} aria-hidden="true" /> Unduh file cadangan
        </a>
      </Card>
      <Card>
        <SectionTitle description={isAdmin ? "Mengembalikan isi website ke kondisi saat file cadangan dibuat." : "Hanya akun Admin yang bisa memulihkan cadangan."}>Pulihkan dari cadangan</SectionTitle>
        <button type="button" disabled={!isAdmin || busy} onClick={() => input.current?.click()} className={buttonClass("secondary")}>
          {busy ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : <Upload size={15} aria-hidden="true" />} Pilih file cadangan (.json)
        </button>
        <input
          ref={input}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (f) restore(f);
          }}
        />
      </Card>
    </div>
  );
}

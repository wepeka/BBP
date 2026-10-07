"use client";

import Link from "next/link";
import { RotateCcw } from "lucide-react";

export default function SiteError({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="container-x flex min-h-[60vh] flex-col justify-center py-24">
      <p className="font-data text-[13px] uppercase tracking-[0.16em] text-[var(--color-red)]">Terjadi gangguan</p>
      <h1 className="h-page mt-4 max-w-2xl text-[var(--color-ink)]">Halaman ini gagal dimuat</h1>
      <p className="lede mt-5 max-w-xl">Coba muat ulang. Jika masih gagal, hubungi kami lewat WhatsApp atau telepon.</p>
      <div className="mt-9 flex flex-wrap gap-3">
        <button type="button" onClick={reset} className="btn btn-primary">
          <RotateCcw size={16} aria-hidden="true" /> Muat ulang
        </button>
        <Link href="/" className="btn btn-ghost">
          Ke beranda
        </Link>
      </div>
    </section>
  );
}

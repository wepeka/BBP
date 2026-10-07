import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LogoMark } from "@/components/logo";
import { LoginForm } from "@/components/admin/login-form";
import { getMedia, getSettings } from "@/lib/repo";
import { firstMedia } from "@/lib/media";

export const metadata: Metadata = { title: "Masuk Admin", robots: { index: false, follow: false } };

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ from?: string }> }) {
  const [{ from }, settings, media] = await Promise.all([searchParams, getSettings(), getMedia()]);

  return (
    <div className="grid min-h-screen bg-[var(--color-bg)] lg:grid-cols-[1fr_1.1fr]">
      <div className="relative hidden overflow-hidden bg-[var(--color-panel-dark)] p-12 text-[var(--color-on-panel-dark)] lg:flex lg:flex-col lg:justify-between">
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:56px_56px]" />
        <div aria-hidden="true" className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[var(--color-yellow)]" />
        <span className="relative inline-flex w-fit rounded-[8px] bg-white p-3">
          <LogoMark className="h-14 w-auto" src={firstMedia(media, "brand.logo")?.src} eager />
        </span>
        <div className="relative max-w-md">
          <p className="font-data text-[11.5px] uppercase tracking-[0.16em] text-[var(--color-yellow)]">Admin website</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight">{settings.companyName}</h1>
          <p className="mt-4 text-[16px] leading-relaxed text-white/70">Kelola proyek, foto, tulisan setiap halaman, sertifikat, dan permintaan penawaran dari satu tempat.</p>
        </div>
        <p className="relative font-data text-[12px] text-white/50">{settings.address}</p>
      </div>

      <div className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <LogoMark className="h-14 w-auto" src={firstMedia(media, "brand.logo")?.src} eager />
          </div>
          <h2 className="text-[24px] font-extrabold tracking-tight text-[var(--color-ink)]">Masuk ke admin</h2>
          <p className="mt-1.5 text-[14px] text-[var(--color-ink-2)]">Gunakan akun yang diberikan pengelola website.</p>
          <div className="mt-7">
            <LoginForm from={from ?? "/admin"} />
          </div>
          <Link href="/" className="mt-8 inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-ink-3)] hover:text-[var(--color-ink)]">
            <ArrowLeft size={14} aria-hidden="true" /> Kembali ke website
          </Link>
        </div>
      </div>
    </div>
  );
}

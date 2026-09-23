import type { Metadata } from "next";
import { LogoFull } from "@/components/logo";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Masuk Admin" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface-2)] px-4 py-12">
      <div className="w-full max-w-sm rounded-md border border-[var(--color-line)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-card)]">
        <div className="flex justify-center">
          <LogoFull />
        </div>
        <h1 className="mt-6 text-center text-lg font-bold text-[var(--color-ink)]">Admin Panel</h1>
        <p className="mt-1 text-center text-[13.5px] text-[var(--color-ink-2)]">
          Masuk untuk mengelola konten situs
        </p>
        <div className="mt-6">
          <LoginForm from={from ?? "/admin"} />
        </div>
      </div>
    </div>
  );
}

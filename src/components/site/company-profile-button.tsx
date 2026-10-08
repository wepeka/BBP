"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Download, FileText, Loader2, X } from "lucide-react";
import { requestCompanyProfile, type ProfileRequestState } from "@/app/(site)/hubungi/actions";

const initial: ProfileRequestState = { ok: false, message: "" };

const input =
  "mt-1.5 w-full rounded-[6px] border border-[var(--color-line-2)] bg-[var(--color-surface)] px-3.5 py-2.5 text-[15px] text-[var(--color-ink)] focus:border-[var(--color-teal)] focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]/20";

/**
 * "Unduh Company Profile" button. Asks for name + email (saved as a lead in
 * the admin inbox), then gives the PDF.
 */
export function CompanyProfileButton({
  label,
  title,
  body,
  submitLabel,
  className,
  variant = "ghost",
}: {
  label: string;
  title: string;
  body: string;
  submitLabel: string;
  className?: string;
  variant?: "ghost" | "light" | "link";
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(requestCompanyProfile, initial);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  useEffect(() => {
    if (state.ok && state.url) window.open(state.url, "_blank", "noopener");
  }, [state]);

  const triggerClass =
    variant === "link"
      ? "inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[var(--color-teal-text)] hover:underline"
      : variant === "light"
        ? "btn btn-outline-light"
        : "btn btn-ghost";

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={`${triggerClass} ${className ?? ""}`}>
        <Download size={16} aria-hidden="true" />
        {label}
      </button>
      <dialog
        ref={dialog}
        onClose={() => setOpen(false)}
        className="m-auto w-[min(94vw,460px)] rounded-[10px] border border-[var(--color-line)] bg-[var(--color-surface)] p-0 text-[var(--color-ink)] shadow-2xl backdrop:bg-black/55"
      >
        {open && (
          <div className="p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-[6px] bg-[var(--color-teal-soft)] text-[var(--color-teal-text)]">
                <FileText size={22} aria-hidden="true" />
              </span>
              <button type="button" onClick={() => setOpen(false)} aria-label="Tutup" className="flex h-9 w-9 items-center justify-center rounded-[6px] text-[var(--color-ink-3)] hover:bg-[var(--color-surface-2)]">
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <h2 className="mt-4 text-xl font-extrabold">{title}</h2>
            {state.ok && state.url ? (
              <div className="mt-4 space-y-4">
                <p className="text-[15px] text-[var(--color-ink-2)]">{state.message}</p>
                <a href={state.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full">
                  <Download size={16} aria-hidden="true" /> {submitLabel}
                </a>
              </div>
            ) : (
              <form action={action} className="mt-2 space-y-4" noValidate>
                <p className="text-[14.5px] leading-relaxed text-[var(--color-ink-2)]">{body}</p>
                {state.message && !state.ok && <p role="alert" className="text-[13.5px] text-[var(--color-red)]">{state.message}</p>}
                <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <input name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
                </div>
                <label className="block text-[14px] font-medium">
                  Nama <span className="text-[var(--color-red)]">*</span>
                  <input name="name" autoComplete="name" required className={input} />
                  {state.errors?.name && <span className="mt-1 block text-[12.5px] text-[var(--color-red)]">{state.errors.name}</span>}
                </label>
                <label className="block text-[14px] font-medium">
                  Email <span className="text-[var(--color-red)]">*</span>
                  <input name="email" type="email" autoComplete="email" required className={input} placeholder="nama@perusahaan.co.id" />
                  {state.errors?.email && <span className="mt-1 block text-[12.5px] text-[var(--color-red)]">{state.errors.email}</span>}
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-[14px] font-medium">
                    Perusahaan
                    <input name="company" autoComplete="organization" className={input} />
                  </label>
                  <label className="block text-[14px] font-medium">
                    WhatsApp
                    <input name="whatsapp" type="tel" autoComplete="tel" className={input} />
                  </label>
                </div>
                <button type="submit" disabled={pending} className="btn btn-primary w-full disabled:opacity-60">
                  {pending ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Download size={16} aria-hidden="true" />}
                  {submitLabel}
                </button>
              </form>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}

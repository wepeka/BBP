"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { submitRfq, type RfqFormState } from "@/app/(site)/hubungi/actions";

const initialState: RfqFormState = { ok: false, message: "" };

const TARGET_OPTIONS = ["Secepatnya (< 1 bulan)", "1–3 bulan", "3–6 bulan", "> 6 bulan", "Belum pasti"];

const inputClass = (error?: string) =>
  `mt-1.5 w-full rounded-[6px] border bg-[var(--color-surface)] px-3.5 py-3 text-[15px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-3)] transition-colors focus:border-[var(--color-teal)] focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]/20 ${
    error ? "border-[var(--color-red)]" : "border-[var(--color-line-2)]"
  }`;

export function RfqForm({
  services,
  submitLabel,
  note,
}: {
  services: { id: string; name: string }[];
  submitLabel: string;
  note: string;
}) {
  const [state, formAction, isPending] = useActionState(submitRfq, initialState);
  const [sent, setSent] = useState(false);
  const startedAt = useRef<HTMLInputElement>(null);
  const [prevState, setPrevState] = useState(state);
  if (prevState !== state) {
    setPrevState(state);
    if (state.ok) setSent(true);
  }

  useEffect(() => {
    if (startedAt.current) startedAt.current.value = String(Date.now());
  }, [sent]);

  if (sent) {
    return (
      <div role="status" className="flex flex-col items-start gap-4 rounded-[6px] border border-[var(--color-teal)] bg-[var(--color-teal-soft)] p-6">
        <CheckCircle2 size={28} className="text-[var(--color-teal)]" aria-hidden="true" />
        <p className="text-[16px] font-semibold text-[var(--color-ink)]">{state.message}</p>
        <button type="button" onClick={() => setSent(false)} className="text-[14px] font-semibold text-[var(--color-teal-text)] hover:underline">
          Kirim permintaan lain
        </button>
      </div>
    );
  }

  const e = state.errors ?? {};
  const v = state.values ?? {};

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {state.message && !state.ok && (
        <div role="alert" className="flex items-start gap-2.5 rounded-[6px] border border-[var(--color-red)]/40 bg-[var(--color-red)]/10 p-4 text-[14px] text-[var(--color-red)]">
          <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>{state.message}</span>
        </div>
      )}

      {/* Spam traps — hidden from people, filled by bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <input ref={startedAt} type="hidden" name="startedAt" defaultValue="" />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nama" name="name" defaultValue={v.name} required error={e.name} autoComplete="name" />
        <Field label="Perusahaan" name="company" defaultValue={v.company} autoComplete="organization" placeholder="Opsional" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email" name="email" defaultValue={v.email} type="email" required error={e.email} autoComplete="email" placeholder="nama@perusahaan.co.id" />
        <Field label="Nomor WhatsApp" name="whatsapp" defaultValue={v.whatsapp} type="tel" required error={e.whatsapp} placeholder="08xx xxxx xxxx" autoComplete="tel" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="serviceId" className="text-[14px] font-medium text-[var(--color-ink)]">Jenis pekerjaan</label>
          <select id="serviceId" name="serviceId" className={inputClass()} defaultValue={v.serviceId ?? ""}>
            <option value="">Pilih jenis pekerjaan</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <Field label="Lokasi proyek" name="location" defaultValue={v.location} required error={e.location} placeholder="Kota / kabupaten" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Perkiraan luas (m²)" name="areaEstimate" defaultValue={v.areaEstimate} inputMode="numeric" placeholder="Opsional" />
        <div>
          <label htmlFor="targetStart" className="text-[14px] font-medium text-[var(--color-ink)]">Target mulai</label>
          <select id="targetStart" name="targetStart" className={inputClass()} defaultValue={v.targetStart ?? ""}>
            <option value="">Pilih perkiraan waktu</option>
            {TARGET_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="text-[14px] font-medium text-[var(--color-ink)]">Deskripsi singkat</label>
        <textarea id="message" name="message" defaultValue={v.message} rows={5} placeholder="Jenis bangunan, ukuran, kebutuhan khusus, dan hal lain yang perlu kami ketahui." className={`${inputClass()} resize-y`} />
      </div>

      <button type="submit" disabled={isPending} className="btn btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60">
        {isPending ? "Mengirim…" : submitLabel}
        {!isPending && <ArrowRight size={17} aria-hidden="true" />}
      </button>
      <p className="text-center text-[12.5px] text-[var(--color-ink-3)]">{note}</p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  error,
  placeholder,
  autoComplete,
  inputMode,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  defaultValue?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-[14px] font-medium text-[var(--color-ink)]">
        {label} {required && <span className="text-[var(--color-red)]">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        inputMode={inputMode}
        defaultValue={defaultValue}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={inputClass(error)}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-[13px] text-[var(--color-red)]">
          {error}
        </p>
      )}
    </div>
  );
}

"use client";

import { useActionState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { submitRfq, type RfqFormState } from "@/app/(site)/hubungi/actions";
import type { Service } from "@/lib/types";

const initialState: RfqFormState = { ok: false, message: "" };

const TARGET_OPTIONS = [
  "Secepatnya (< 1 bulan)",
  "1–3 bulan",
  "3–6 bulan",
  "> 6 bulan",
  "Belum pasti",
];

export function RfqForm({ services }: { services: Service[] }) {
  const [state, formAction, isPending] = useActionState(submitRfq, initialState);

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {state.message && (
        <div
          role="status"
          aria-live="polite"
          className={`flex items-start gap-2.5 rounded-md border p-4 text-[14px] ${
            state.ok
              ? "border-[var(--color-teal)] bg-[var(--color-teal-soft)] text-[var(--color-teal-text)]"
              : "border-[var(--color-red)]/40 bg-[var(--color-red)]/10 text-[var(--color-red)]"
          }`}
        >
          {state.ok ? (
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          ) : (
            <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          )}
          <span>{state.message}</span>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nama" name="name" required error={state.errors?.name} autoComplete="name" />
        <Field label="Perusahaan" name="company" autoComplete="organization" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Email"
          name="email"
          type="email"
          required
          error={state.errors?.email}
          autoComplete="email"
        />
        <Field
          label="Nomor WhatsApp"
          name="whatsapp"
          type="tel"
          required
          error={state.errors?.whatsapp}
          placeholder="08xx xxxx xxxx"
          autoComplete="tel"
        />
      </div>

      <div>
        <label htmlFor="serviceId" className="text-[14px] font-medium text-[var(--color-ink)]">
          Jenis Pekerjaan
        </label>
        <select
          id="serviceId"
          name="serviceId"
          className="mt-1.5 w-full rounded-md border border-[var(--color-line-2)] bg-[var(--color-surface)] px-3.5 py-2.5 text-[14.5px] text-[var(--color-ink)]"
          defaultValue=""
        >
          <option value="">Pilih jenis pekerjaan</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nameId}
            </option>
          ))}
        </select>
      </div>

      <Field
        label="Lokasi Proyek"
        name="location"
        required
        error={state.errors?.location}
        placeholder="Kota / kabupaten"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Perkiraan Luas (m²)" name="areaEstimate" type="number" min={0} />
        <div>
          <label htmlFor="targetStart" className="text-[14px] font-medium text-[var(--color-ink)]">
            Target Mulai
          </label>
          <select
            id="targetStart"
            name="targetStart"
            className="mt-1.5 w-full rounded-md border border-[var(--color-line-2)] bg-[var(--color-surface)] px-3.5 py-2.5 text-[14.5px] text-[var(--color-ink)]"
            defaultValue=""
          >
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
        <label htmlFor="message" className="text-[14px] font-medium text-[var(--color-ink)]">
          Deskripsi Singkat
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Ceritakan kebutuhan proyek Anda"
          className="mt-1.5 w-full resize-y rounded-md border border-[var(--color-line-2)] bg-[var(--color-surface)] px-3.5 py-2.5 text-[14.5px] text-[var(--color-ink)]"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-[var(--color-teal)] py-3.5 text-[15px] font-semibold text-[var(--color-on-teal)] transition-colors hover:bg-[var(--color-teal-deep)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Mengirim…" : "Kirim Permintaan"}
      </button>
      <p className="text-center text-[12.5px] text-[var(--color-ink-3)]">
        Tim BBP membalas dalam 1 hari kerja.
      </p>
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
  min,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
  min?: number;
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
        min={min}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`mt-1.5 w-full rounded-md border bg-[var(--color-surface)] px-3.5 py-2.5 text-[14.5px] text-[var(--color-ink)] ${
          error ? "border-[var(--color-red)]" : "border-[var(--color-line-2)]"
        }`}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-[12.5px] text-[var(--color-red)]">
          {error}
        </p>
      )}
    </div>
  );
}

"use client";

import { useRef } from "react";

const OPTIONS: { value: string; label: string }[] = [
  { value: "baru", label: "Baru" },
  { value: "dihubungi", label: "Dihubungi" },
  { value: "penawaran", label: "Penawaran" },
  { value: "menang", label: "Menang" },
  { value: "kalah", label: "Kalah" },
];

export function RfqStatusSelect({
  action,
  defaultValue,
}: {
  action: (formData: FormData) => void | Promise<void>;
  defaultValue: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <form ref={formRef} action={action}>
      <select
        name="status"
        defaultValue={defaultValue}
        onChange={() => formRef.current?.requestSubmit()}
        className="rounded-md border border-[var(--color-line-2)] bg-[var(--color-surface)] px-2.5 py-1.5 font-data text-[12px] text-[var(--color-ink)]"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </form>
  );
}

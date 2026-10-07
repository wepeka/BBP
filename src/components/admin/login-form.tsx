"use client";

import { useActionState, useState } from "react";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { loginAction, type LoginFormState } from "@/app/admin/login/actions";
import { buttonClass, inputClass } from "./ui";

const initialState: LoginFormState = { error: null };

export function LoginForm({ from }: { from: string }) {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);
  const [show, setShow] = useState(false);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="from" value={from} />
      {state.error && (
        <div role="alert" className="flex items-center gap-2 rounded-[6px] border border-[var(--color-red)]/40 bg-[var(--color-red)]/10 p-3 text-[13.5px] text-[var(--color-red)]">
          <AlertCircle size={16} className="shrink-0" aria-hidden="true" />
          {state.error}
        </div>
      )}
      <div>
        <label htmlFor="username" className="mb-1.5 block text-[13px] font-semibold text-[var(--color-ink)]">
          Nama pengguna
        </label>
        <input id="username" name="username" autoComplete="username" defaultValue={state.username} required autoFocus className={inputClass} />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-[13px] font-semibold text-[var(--color-ink)]">
          Kata sandi
        </label>
        <div className="relative">
          <input id="password" name="password" type={show ? "text" : "password"} autoComplete="current-password" required className={`${inputClass} pr-11`} />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-[6px] text-[var(--color-ink-3)] hover:text-[var(--color-ink)]"
          >
            {show ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
          </button>
        </div>
      </div>
      <button type="submit" disabled={isPending} className={buttonClass("primary", "md", "h-11 w-full")}>
        {isPending && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
        {isPending ? "Memeriksa…" : "Masuk"}
      </button>
    </form>
  );
}

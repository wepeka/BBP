"use client";

import { useActionState } from "react";
import { AlertCircle } from "lucide-react";
import { loginAction, type LoginFormState } from "@/app/admin/login/actions";

const initialState: LoginFormState = { error: null };

export function LoginForm({ from }: { from: string }) {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="from" value={from} />
      {state.error && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-md border border-[var(--color-red)]/40 bg-[var(--color-red)]/10 p-3 text-[13.5px] text-[var(--color-red)]"
        >
          <AlertCircle size={16} className="shrink-0" aria-hidden="true" />
          {state.error}
        </div>
      )}
      <div>
        <label htmlFor="username" className="text-[14px] font-medium text-[var(--color-ink)]">
          Nama Pengguna
        </label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          required
          className="mt-1.5 w-full rounded-md border border-[var(--color-line-2)] bg-[var(--color-surface)] px-3.5 py-2.5 text-[14.5px] text-[var(--color-ink)]"
        />
      </div>
      <div>
        <label htmlFor="password" className="text-[14px] font-medium text-[var(--color-ink)]">
          Kata Sandi
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1.5 w-full rounded-md border border-[var(--color-line-2)] bg-[var(--color-surface)] px-3.5 py-2.5 text-[14.5px] text-[var(--color-ink)]"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-[var(--color-teal)] py-3 text-[14.5px] font-semibold text-[var(--color-on-teal)] hover:bg-[var(--color-teal-deep)] disabled:opacity-60"
      >
        {isPending ? "Memeriksa…" : "Masuk"}
      </button>
    </form>
  );
}

import Link from "next/link";

/*
 * Presentational building blocks for the admin. No hooks here, so they work
 * in both server and client components.
 */

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "yellow";
type ButtonSize = "sm" | "md";

export function buttonClass(variant: ButtonVariant = "secondary", size: ButtonSize = "md", extra = "") {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-[6px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-teal)] whitespace-nowrap";
  const sizes = { sm: "h-8 px-3 text-[12.5px]", md: "h-10 px-4 text-[13.5px]" };
  const variants = {
    primary: "bg-[var(--color-teal)] text-white hover:bg-[var(--color-teal-deep)]",
    secondary: "border border-[var(--color-line-2)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:border-[var(--color-ink-3)] hover:bg-[var(--color-surface-2)]",
    ghost: "text-[var(--color-ink-2)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]",
    danger: "border border-[var(--color-red)]/35 bg-[var(--color-surface)] text-[var(--color-red)] hover:bg-[var(--color-red)]/10",
    yellow: "bg-[var(--color-yellow)] text-[#17181a] hover:bg-[#fff86a]",
  };
  return `${base} ${sizes[size]} ${variants[variant]} ${extra}`;
}

export function LinkButton({
  href,
  children,
  variant = "secondary",
  size = "md",
  className = "",
  target,
}: {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  target?: string;
}) {
  return (
    <Link href={href} target={target} rel={target ? "noopener noreferrer" : undefined} className={buttonClass(variant, size, className)}>
      {children}
    </Link>
  );
}

export const inputClass =
  "w-full rounded-[6px] border border-[var(--color-line-2)] bg-[var(--color-surface)] px-3 py-2.5 text-[14px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-3)] transition-colors focus:border-[var(--color-teal)] focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]/20 disabled:opacity-60";

export function FieldShell({
  label,
  htmlFor,
  hint,
  error,
  badge,
  action,
  children,
  className = "",
}: {
  label: React.ReactNode;
  htmlFor?: string;
  hint?: React.ReactNode;
  error?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="mb-1.5 flex min-h-[20px] items-center justify-between gap-3">
        <label htmlFor={htmlFor} className="flex items-center gap-2 text-[13px] font-semibold text-[var(--color-ink)]">
          {label}
          {badge}
        </label>
        {action}
      </div>
      {children}
      {error ? (
        <p className="mt-1.5 text-[12.5px] text-[var(--color-red)]">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-[12px] leading-relaxed text-[var(--color-ink-3)]">{hint}</p>
      ) : null}
    </div>
  );
}

export function Card({
  children,
  className = "",
  padded = true,
}: {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div className={`rounded-[8px] border border-[var(--color-line)] bg-[var(--color-surface)] ${padded ? "p-5 sm:p-6" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
  eyebrow,
}: {
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        {eyebrow && <p className="font-data text-[11px] uppercase tracking-[0.16em] text-[var(--color-teal-text)]">{eyebrow}</p>}
        <h1 className="mt-1 text-[26px] font-extrabold tracking-tight text-[var(--color-ink)]">{title}</h1>
        {description && <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--color-ink-2)]">{description}</p>}
      </div>
      {action && <div className="flex flex-wrap items-center gap-2">{action}</div>}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "green" | "yellow" | "red";
  className?: string;
}) {
  const tones = {
    neutral: "bg-[var(--color-surface-2)] text-[var(--color-ink-2)]",
    green: "bg-[var(--color-teal-soft)] text-[var(--color-teal-text)]",
    yellow: "bg-[var(--color-yellow)] text-[#17181a]",
    red: "bg-[var(--color-red)]/12 text-[var(--color-red)]",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-[4px] px-1.5 py-0.5 font-data text-[10.5px] font-medium uppercase tracking-wide ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}

export function EmptyState({ title, body, action }: { title: string; body?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-[8px] border border-dashed border-[var(--color-line-2)] px-6 py-12 text-center">
      <p className="text-[15px] font-semibold text-[var(--color-ink)]">{title}</p>
      {body && <p className="mt-1.5 max-w-md text-[13.5px] text-[var(--color-ink-2)]">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function SectionTitle({ children, description }: { children: React.ReactNode; description?: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h2 className="text-[15.5px] font-bold text-[var(--color-ink)]">{children}</h2>
      {description && <p className="mt-0.5 text-[13px] text-[var(--color-ink-3)]">{description}</p>}
    </div>
  );
}

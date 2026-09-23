/**
 * Recreated in SVG from the printed BBP company profile so it stays crisp
 * at any size, instead of the low-resolution raster in that document.
 * Keeps the original mark: a derrick/tower silhouette on a yellow disc,
 * paired with the wordmark.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill="var(--color-yellow)" />
      <g stroke="var(--color-teal-deep)" strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M32 14 L20 48 M32 14 L44 48" />
        <path d="M24 24 L40 24 M22.5 32 L41.5 32 M21 40 L43 40" />
        <path d="M32 14 L32 8" />
      </g>
      <rect x="14" y="48" width="36" height="4" rx="1" fill="var(--color-teal-deep)" />
    </svg>
  );
}

export function LogoFull({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <LogoMark className="h-9 w-9 shrink-0" />
      <span className="leading-tight">
        <span className="block font-[family-name:var(--font-display)] text-[15px] font-extrabold tracking-tight text-[var(--color-ink)]">
          BINA BANGUN PERKASA
        </span>
        <span className="block font-data text-[10px] uppercase tracking-[0.14em] text-[var(--color-teal-text)]">
          General Contractor &amp; Supplier
        </span>
      </span>
    </span>
  );
}

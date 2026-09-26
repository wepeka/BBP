import Image from "next/image";

/**
 * Official BBP logo (disc + derrick tower, vertical "bina", and the
 * "BANGUN PERKASA" plate). Source artwork supplied by BBP, with its white
 * background removed so it sits on both light and dark themes.
 */
const LOGO_SRC = "/images/brand/logo-bbp.png";
const LOGO_W = 487;
const LOGO_H = 325;

export function LogoMark({ className, priority }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src={LOGO_SRC}
      alt=""
      width={LOGO_W}
      height={LOGO_H}
      priority={priority}
      className={`object-contain ${className ?? "h-10 w-auto"}`}
    />
  );
}

export function LogoFull({ className, priority }: { className?: string; priority?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className ?? ""}`}>
      <LogoMark className="h-12 w-auto shrink-0" priority={priority} />
      <span className="hidden border-l border-[var(--color-line)] pl-3 leading-tight sm:block lg:hidden xl:block">
        <span className="block font-[family-name:var(--font-display)] text-[12.5px] font-extrabold tracking-tight text-[var(--color-ink)]">
          PT. BINA BANGUN PERKASA
        </span>
        <span className="block font-data text-[9.5px] uppercase tracking-[0.14em] text-[var(--color-teal-text)]">
          General Contractor &amp; Supplier
        </span>
      </span>
    </span>
  );
}

import Image from "next/image";

/**
 * Official BBP logo (disc + derrick tower, vertical "bina", and the
 * "BANGUN PERKASA" plate). Source artwork supplied by BBP, with its white
 * background removed so it sits on both light and dark themes. The admin can
 * replace it (media slot "brand.logo").
 */
export const DEFAULT_LOGO = "/images/brand/logo-bbp.png";
const LOGO_W = 487;
const LOGO_H = 325;

export function LogoMark({
  className,
  src = DEFAULT_LOGO,
  eager,
}: {
  className?: string;
  src?: string;
  eager?: boolean;
}) {
  return (
    <Image
      src={src}
      alt=""
      width={LOGO_W}
      height={LOGO_H}
      loading={eager ? "eager" : "lazy"}
      sizes="160px"
      className={`object-contain ${className ?? "h-10 w-auto"}`}
    />
  );
}

export function LogoFull({
  className,
  src,
  eager,
  name = "PT. BINA BANGUN PERKASA",
  tagline = "General Contractor & Supplier",
}: {
  className?: string;
  src?: string;
  eager?: boolean;
  name?: string;
  tagline?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-3 ${className ?? ""}`}>
      <LogoMark className="h-11 w-auto shrink-0" src={src} eager={eager} />
      <span className="hidden border-l border-[var(--color-line)] pl-3 leading-tight sm:block lg:hidden xl:block">
        <span className="block font-[family-name:var(--font-display)] text-[12.5px] font-extrabold uppercase tracking-tight text-[var(--color-ink)]">
          {name}
        </span>
        <span className="block font-data text-[9.5px] uppercase tracking-[0.14em] text-[var(--color-teal-text)]">
          {tagline}
        </span>
      </span>
    </span>
  );
}

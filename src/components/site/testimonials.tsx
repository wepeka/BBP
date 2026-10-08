import Image from "next/image";
import type { Testimonial } from "@/lib/types";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

/** Client quotes. One quote is shown large; several sit in a grid. */
export function Testimonials({ items }: { items: Testimonial[] }) {
  const single = items.length === 1;
  return (
    <div className={`grid gap-4 ${single ? "" : "md:grid-cols-2 lg:grid-cols-3"}`}>
      {items.map((t) => (
        <figure key={t.id} className={`card relative flex flex-col p-7 ${single ? "sm:p-10" : ""}`}>
          <span aria-hidden="true" className="font-[family-name:var(--font-display)] text-6xl font-black leading-none text-[var(--color-yellow)] [-webkit-text-stroke:1.5px_#c9b800]">
            “
          </span>
          <blockquote className={`mt-2 flex-1 whitespace-pre-line leading-relaxed text-[var(--color-ink)] ${single ? "text-[19px] sm:text-[22px]" : "text-[15.5px]"}`}>
            {t.quote}
          </blockquote>
          <figcaption className="mt-6 flex items-center gap-3 border-t border-[var(--color-line)] pt-5">
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--color-teal-soft)] font-[family-name:var(--font-display)] text-[14px] font-extrabold text-[var(--color-teal-text)]">
              {t.photo ? <Image src={t.photo} alt="" fill sizes="44px" className="object-cover" /> : initials(t.name)}
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-[14.5px] font-semibold text-[var(--color-ink)]">{t.name}</span>
              <span className="mt-0.5 block truncate text-[13px] text-[var(--color-ink-3)]">{[t.role, t.company].filter(Boolean).join(" · ")}</span>
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

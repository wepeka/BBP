import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowUpRight, Images } from "lucide-react";
import type { Project } from "@/lib/types";

export function ProjectCard({
  project,
  categoryLabel,
  large,
  sizes = "(min-width: 1024px) 380px, (min-width: 640px) 45vw, 92vw",
}: {
  project: Project;
  categoryLabel: string;
  large?: boolean;
  sizes?: string;
}) {
  const cover = project.images[0];
  return (
    <Link
      href={`/proyek/${project.slug}`}
      className="group card card-lift flex h-full flex-col overflow-hidden"
    >
      <div className={`relative w-full overflow-hidden bg-[var(--color-wf-fill)] ${large ? "aspect-[16/10]" : "aspect-[3/2]"}`}>
        {cover ? (
          <Image
            src={cover}
            alt={`${project.titleId} — ${project.city}`}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center font-data text-3xl font-medium text-[var(--color-line-2)]"
            style={{ backgroundImage: "repeating-linear-gradient(135deg, var(--color-wf-fill) 0 10px, var(--color-line) 10px 11px)" }}
          >
            {project.year.slice(0, 4)}
          </div>
        )}
        <span
          className={`absolute left-3 top-3 rounded-[4px] px-2 py-1 font-data text-[10.5px] font-medium uppercase tracking-wider ${
            project.status === "berjalan"
              ? "bg-[var(--color-yellow)] text-[#17181a]"
              : "bg-[var(--color-surface)]/95 text-[var(--color-ink-2)]"
          }`}
        >
          {project.status === "berjalan" ? "Sedang berjalan" : project.year}
        </span>
        {project.images.length > 1 && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-[4px] bg-black/55 px-2 py-1 font-data text-[10.5px] text-white backdrop-blur">
            <Images size={12} aria-hidden="true" /> {project.images.length}
          </span>
        )}
        <span
          aria-hidden="true"
          className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-[6px] bg-[var(--color-yellow)] text-[#17181a] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <ArrowUpRight size={17} />
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="font-data text-[10.5px] uppercase tracking-[0.14em] text-[var(--color-teal-text)]">{categoryLabel}</span>
        <h3 className={`font-semibold leading-snug text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-teal-text)] ${large ? "text-[19px]" : "text-[16px]"}`}>
          {project.titleId}
        </h3>
        <p className="mt-auto flex items-center gap-1.5 pt-2 text-[13.5px] text-[var(--color-ink-2)]">
          <MapPin size={14} className="shrink-0 text-[var(--color-ink-3)]" aria-hidden="true" />
          <span className="truncate">
            {project.city}
            {project.client ? ` · ${project.client}` : ""}
          </span>
        </p>
      </div>
    </Link>
  );
}

import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import type { Project } from "@/lib/types";
import { categoryLabel } from "@/lib/categories";

export function ProjectCard({ project }: { project: Project }) {
  const cover = project.images[0];
  return (
    <Link
      href={`/proyek/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-md border border-[var(--color-line)] bg-[var(--color-surface)] transition-shadow hover:shadow-[var(--shadow-card)]"
    >
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-[var(--color-wf-fill)]">
        {cover ? (
          <Image
            src={cover}
            alt={`${project.titleId} — ${project.city}`}
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center font-data text-3xl font-medium text-[var(--color-line-2)]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, var(--color-wf-fill) 0 10px, var(--color-line) 10px 11px)",
            }}
          >
            {project.year.slice(0, 4)}
          </div>
        )}
        <span
          className={`absolute left-3 top-3 rounded px-2 py-1 font-data text-[10.5px] uppercase tracking-wide ${
            project.status === "berjalan"
              ? "bg-[var(--color-yellow)] text-[var(--color-yellow-ink)]"
              : "bg-[var(--color-surface)]/90 text-[var(--color-ink-2)]"
          }`}
        >
          {project.status === "berjalan" ? "Berjalan" : project.year}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="font-data text-[11px] uppercase tracking-wide text-[var(--color-teal-text)]">
          {categoryLabel(project.categories[0])}
        </span>
        <h3 className="text-[16px] font-semibold leading-snug text-[var(--color-ink)]">
          {project.titleId}
        </h3>
        <p className="mt-auto flex items-center gap-1.5 pt-2 text-[13.5px] text-[var(--color-ink-2)]">
          <MapPin size={14} className="shrink-0 text-[var(--color-ink-3)]" aria-hidden="true" />
          {project.city}
          {project.client ? ` · ${project.client}` : ""}
        </p>
      </div>
    </Link>
  );
}

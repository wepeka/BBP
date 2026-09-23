"use client";

import dynamic from "next/dynamic";
import type { Project } from "@/lib/types";

const Map = dynamic(() => import("./projects-map").then((m) => m.ProjectsMap), {
  ssr: false,
  loading: () => (
    <div
      className="flex h-full w-full animate-pulse items-center justify-center rounded-md border border-[var(--color-line)] font-data text-xs text-[var(--color-ink-3)]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, var(--color-wf-fill) 0 10px, var(--color-line) 10px 11px)",
      }}
    >
      Memuat peta…
    </div>
  ),
});

export function ProjectsMapClient({ projects }: { projects: Project[] }) {
  return <Map projects={projects} />;
}

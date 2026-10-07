"use client";

import dynamic from "next/dynamic";
import { LazyMount, MapPlaceholder } from "./lazy-mount";
import type { MapProject } from "@/lib/map";

const Map = dynamic(() => import("./projects-map").then((m) => m.ProjectsMap), {
  ssr: false,
  loading: () => <MapPlaceholder />,
});

export function ProjectsMapClient({ projects }: { projects: MapProject[] }) {
  return (
    <LazyMount className="h-full w-full" placeholder={<MapPlaceholder />}>
      <Map projects={projects} />
    </LazyMount>
  );
}

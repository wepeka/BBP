"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("./location-map").then((m) => m.LocationMap), {
  ssr: false,
  loading: () => (
    <div
      className="h-full w-full animate-pulse rounded-md border border-[var(--color-line)]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, var(--color-wf-fill) 0 10px, var(--color-line) 10px 11px)",
      }}
    />
  ),
});

export function LocationMapClient({ lat, lng }: { lat: number; lng: number }) {
  return <Map lat={lat} lng={lng} />;
}

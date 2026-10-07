"use client";

import dynamic from "next/dynamic";
import { LazyMount, MapPlaceholder } from "./lazy-mount";

const Map = dynamic(() => import("./location-map").then((m) => m.LocationMap), {
  ssr: false,
  loading: () => <MapPlaceholder label="" />,
});

export function LocationMapClient({ lat, lng, zoom }: { lat: number; lng: number; zoom?: number }) {
  return (
    <LazyMount className="h-full w-full" placeholder={<MapPlaceholder label="" />}>
      <Map lat={lat} lng={lng} zoom={zoom} />
    </LazyMount>
  );
}

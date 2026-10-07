"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";

import type { MapProject } from "@/lib/map";

function groupByCity(projects: MapProject[]) {
  const groups = new Map<string, { city: string; province: string; lat: number; lng: number; projects: MapProject[] }>();
  for (const p of projects) {
    if (!p.lat && !p.lng) continue;
    const key = `${p.lat.toFixed(1)},${p.lng.toFixed(1)}`;
    if (!groups.has(key)) {
      groups.set(key, { city: p.city, province: p.province, lat: p.lat, lng: p.lng, projects: [] });
    }
    groups.get(key)!.projects.push(p);
  }
  return Array.from(groups.values());
}

function pinIcon(count: number) {
  const size = count > 5 ? 38 : count > 2 ? 32 : 26;
  return L.divIcon({
    className: "",
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:50%;
      background:var(--color-teal);color:#fff;
      display:flex;align-items:center;justify-content:center;
      font-family:var(--font-data);font-size:${count > 9 ? 11 : 12}px;font-weight:600;
      border:2.5px solid #fff;box-shadow:0 0 0 3px rgba(255,240,0,.55),0 4px 10px rgba(0,0,0,.3);
    ">${count}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

export function ProjectsMap({ projects }: { projects: MapProject[] }) {
  const groups = groupByCity(projects);

  return (
    <MapContainer
      center={[-2.3, 117.5]}
      zoom={5}
      minZoom={4}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%", borderRadius: "6px" }}
      attributionControl={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        subdomains="abc"
        maxZoom={19}
      />
      {groups.map((g) => (
        <Marker key={`${g.lat}-${g.lng}`} position={[g.lat, g.lng]} icon={pinIcon(g.projects.length)}>
          <Popup>
            <div style={{ fontFamily: "var(--font-body)", minWidth: 210 }}>
              <p style={{ fontWeight: 700, marginBottom: 6 }}>
                {g.city}, {g.province}
              </p>
              <ul style={{ display: "grid", gap: 6, paddingLeft: 0, listStyle: "none", margin: 0 }}>
                {g.projects.slice(0, 5).map((p) => (
                  <li key={p.id}>
                    <Link href={`/proyek/${p.slug}`} style={{ color: "var(--color-teal-text)", fontSize: 13, lineHeight: 1.4 }}>
                      {p.titleId} <span style={{ color: "var(--color-ink-3)" }}>· {p.year}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              {g.projects.length > 5 && (
                <p style={{ fontSize: 12, marginTop: 6, color: "var(--color-ink-3)" }}>+{g.projects.length - 5} proyek lainnya</p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";

function pin() {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:22px;height:22px;border-radius:50% 50% 50% 0;
      background:var(--color-teal);transform:rotate(-45deg);
      border:2.5px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35);
    "></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 22],
  });
}

export function LocationMap({ lat, lng }: { lat: number; lng: number }) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={11}
      scrollWheelZoom={false}
      dragging={false}
      style={{ height: "100%", width: "100%", borderRadius: "8px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
        subdomains="abc"
        maxZoom={19}
      />
      <Marker position={[lat, lng]} icon={pin()} />
    </MapContainer>
  );
}

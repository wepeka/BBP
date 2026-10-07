"use client";

import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";

const pin = () =>
  L.divIcon({
    className: "",
    html: `<div style="width:26px;height:26px;border-radius:50% 50% 50% 0;background:#009049;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4)"></div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 26],
  });

function ClickToSet({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({ click: (e) => onPick(e.latlng.lat, e.latlng.lng) });
  return null;
}

function FlyTo({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], Math.max(map.getZoom(), zoom), { duration: 0.6 });
  }, [lat, lng, zoom, map]);
  return null;
}

export default function MapPickerInner({
  lat,
  lng,
  onPick,
  flyKey,
}: {
  lat: number;
  lng: number;
  onPick: (lat: number, lng: number) => void;
  flyKey: number;
}) {
  const has = Boolean(lat || lng);
  return (
    <MapContainer center={has ? [lat, lng] : [-2.5, 117.5]} zoom={has ? 9 : 4} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" subdomains="abc" maxZoom={19} />
      <ClickToSet onPick={onPick} />
      {has && (
        <Marker
          position={[lat, lng]}
          icon={pin()}
          draggable
          eventHandlers={{
            dragend: (e) => {
              const p = (e.target as L.Marker).getLatLng();
              onPick(p.lat, p.lng);
            },
          }}
        />
      )}
      {has && flyKey > 0 && <FlyTo key={flyKey} lat={lat} lng={lng} zoom={10} />}
    </MapContainer>
  );
}

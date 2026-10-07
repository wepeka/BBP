"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Loader2, MapPin, Search } from "lucide-react";
import { buttonClass, inputClass } from "./ui";

const Inner = dynamic(() => import("./map-picker-inner"), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center text-[12.5px] text-[var(--color-ink-3)]">Memuat peta…</div>,
});

/**
 * Pick a project location: search a place name, click the map, or drag the
 * pin. Coordinates are only used for the project map pins.
 */
export function MapPicker({
  lat,
  lng,
  onChange,
  suggestion,
}: {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
  suggestion?: string;
}) {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [flyKey, setFlyKey] = useState(0);

  async function search(q: string) {
    if (!q.trim()) return;
    setSearching(true);
    setMessage(null);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=id&q=${encodeURIComponent(q)}`;
      const res = await fetch(url, { headers: { "Accept-Language": "id" } });
      const data = (await res.json()) as { lat: string; lon: string; display_name: string }[];
      if (!data.length) {
        setMessage("Lokasi tidak ditemukan. Coba nama kota saja, atau klik langsung di peta.");
        return;
      }
      onChange(Number(Number(data[0].lat).toFixed(5)), Number(Number(data[0].lon).toFixed(5)));
      setFlyKey((k) => k + 1);
      setMessage(`Ditemukan: ${data[0].display_name}`);
    } catch {
      setMessage("Pencarian gagal. Periksa koneksi, atau klik langsung di peta.");
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="space-y-2.5">
      <div className="flex gap-2">
        <label className="relative flex-1">
          <span className="sr-only">Cari lokasi</span>
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-3)]" aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                search(query);
              }
            }}
            placeholder="Cari kota / kawasan, mis. Panbil Batam"
            className={`${inputClass} pl-9`}
          />
        </label>
        <button type="button" onClick={() => search(query)} className={buttonClass("secondary")} disabled={searching}>
          {searching ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : "Cari"}
        </button>
      </div>
      {suggestion && !lat && !lng && (
        <button type="button" onClick={() => search(suggestion)} className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[var(--color-teal-text)] hover:underline">
          <MapPin size={13} aria-hidden="true" /> Pakai lokasi “{suggestion}”
        </button>
      )}
      <div className="h-[240px] overflow-hidden rounded-[6px] border border-[var(--color-line)]">
        <Inner lat={lat} lng={lng} onPick={(a, b) => onChange(Number(a.toFixed(5)), Number(b.toFixed(5)))} flyKey={flyKey} />
      </div>
      <p className="text-[12px] text-[var(--color-ink-3)]">
        {message ?? (lat || lng ? `Titik: ${lat}, ${lng} · klik peta atau geser pin untuk mengubah.` : "Klik di peta untuk menaruh pin lokasi proyek.")}
      </p>
    </div>
  );
}

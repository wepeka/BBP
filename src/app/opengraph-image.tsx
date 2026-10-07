import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getSettings } from "@/lib/repo";

export const alt = "PT. Bina Bangun Perkasa — General Contractor & Supplier, Kediri";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social share card used by every page that doesn't set its own image. */
export default async function OpengraphImage() {
  const [settings, logo] = await Promise.all([
    getSettings(),
    readFile(join(process.cwd(), "public/images/brand/logo-bbp.png"), "base64"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#0f1f17",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          color: "#f6f4f2",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", right: -120, top: -120, width: 420, height: 420, borderRadius: 9999, background: "#fff000" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ display: "flex", background: "#ffffff", borderRadius: 8, padding: "14px 18px" }}>
            <img src={`data:image/png;base64,${logo}`} width={150} height={100} alt="" />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 6, textTransform: "uppercase", color: "#fff000" }}>
            {`${settings.tagline} · ${settings.city}`}
          </div>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 800, lineHeight: 1.05, marginTop: 18, maxWidth: 980 }}>{settings.companyName}</div>
          <div style={{ display: "flex", fontSize: 30, marginTop: 22, color: "rgba(246,244,242,0.75)", maxWidth: 900 }}>
            Struktur beton, fabrikasi & erection baja, atap, MEP, sipil, dan pengadaan — sejak 2012.
          </div>
        </div>
        <div style={{ display: "flex", height: 8, width: "100%" }}>
          <div style={{ flex: 7, background: "#009049" }} />
          <div style={{ flex: 3, background: "#fff000" }} />
        </div>
      </div>
    ),
    { ...size }
  );
}

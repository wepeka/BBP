import "server-only";
import type { RfqEntry, Settings } from "./types";
import { SITE_URL, formatDate, waLink } from "./site";

/*
 * Email notifications for new leads, sent through Resend's HTTP API (free
 * tier, no extra package). Needs RESEND_API_KEY in the environment; without
 * it nothing is sent and the lead is still saved in the admin inbox.
 *
 * RESEND_FROM sets the sender. Until a domain is verified in Resend, the
 * default onboarding sender can only deliver to the Resend account's own
 * email address.
 */
export const emailConfigured = Boolean(process.env.RESEND_API_KEY);

const escape = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export function notifyRecipients(settings: Settings): string[] {
  return (settings.notifyEmail || settings.email || "")
    .split(/[,;\s]+/)
    .map((e) => e.trim())
    .filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
}

export async function sendEmail(opts: { to: string[]; subject: string; html: string; text: string; replyTo?: string }): Promise<{ ok: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "RESEND_API_KEY belum dipasang." };
  if (!opts.to.length) return { ok: false, error: "Alamat email penerima belum diisi." };
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: process.env.RESEND_FROM || "Website BBP <onboarding@resend.dev>",
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
      ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
    }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    return { ok: false, error: body.message || `Gagal mengirim email (HTTP ${res.status}).` };
  }
  return { ok: true };
}

/** Emails the team about a new quote request or company-profile download. */
export async function notifyNewLead(entry: RfqEntry, settings: Settings, serviceName: string | null): Promise<void> {
  const isDownload = entry.type === "unduhan";
  const who = entry.company ? `${entry.company} (${entry.name})` : entry.name;
  const subject = isDownload ? `Unduhan company profile: ${who}` : `Permintaan penawaran baru: ${who} — ${entry.location}`;
  const rows: [string, string | null][] = [
    ["Nama", entry.name],
    ["Perusahaan", entry.company],
    ["Email", entry.email],
    ["WhatsApp", entry.whatsapp],
    ...(isDownload
      ? []
      : ([
          ["Jenis pekerjaan", serviceName],
          ["Lokasi", entry.location],
          ["Perkiraan luas", entry.areaEstimate ? `${entry.areaEstimate} m²` : null],
          ["Target mulai", entry.targetStart],
          ["Pesan", entry.message],
        ] as [string, string | null][])),
    ["Waktu", formatDate(entry.createdAt, { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })],
  ];
  const filled = rows.filter(([, v]) => v);
  const html = `
    <div style="font-family:Arial,sans-serif;font-size:14px;color:#17181a;max-width:560px">
      <p style="margin:0 0 4px;color:#007039;font-size:12px;letter-spacing:2px;text-transform:uppercase">${escape(settings.companyName)}</p>
      <h2 style="margin:0 0 16px;font-size:18px">${escape(subject)}</h2>
      <table style="border-collapse:collapse;width:100%">${filled
        .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#686b6e;vertical-align:top;white-space:nowrap">${escape(k)}</td><td style="padding:6px 0;white-space:pre-line">${escape(v!)}</td></tr>`)
        .join("")}</table>
      <p style="margin:20px 0 0">
        <a href="${SITE_URL}/admin/rfq" style="background:#009049;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;font-weight:bold">Buka inbox admin</a>
        &nbsp;
        <a href="${waLink(entry.whatsapp)}" style="color:#007039">Chat WhatsApp</a>
      </p>
    </div>`;
  const text = `${subject}\n\n${filled.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nInbox admin: ${SITE_URL}/admin/rfq`;
  const res = await sendEmail({ to: notifyRecipients(settings), subject, html, text, replyTo: entry.email });
  if (!res.ok && emailConfigured) console.error("Lead notification failed:", res.error);
}

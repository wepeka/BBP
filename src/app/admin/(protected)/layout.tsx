import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAllCertificates, getMedia, getRfqEntries } from "@/lib/repo";
import { useBlob } from "@/lib/store";
import { firstMedia } from "@/lib/media";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: { template: "%s — Admin BBP", default: "Admin BBP" },
  robots: { index: false, follow: false },
};

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const [rfq, certificates, media] = await Promise.all([getRfqEntries(), getAllCertificates(), getMedia()]);
  const today = new Date().toISOString().slice(0, 10);
  const rfqBadge = rfq.filter((r) => r.status === "baru").length;
  const certBadge = certificates.filter((c) => !c.hidden && (c.status !== "berlaku" || (c.expiresAt && c.expiresAt < today))).length;

  return (
    <AdminShell
      userName={session.name}
      role={session.role}
      rfqBadge={rfqBadge}
      certBadge={certBadge}
      uploadMode={useBlob ? "blob" : "local"}
      logoSrc={firstMedia(media, "brand.logo")?.src}
    >
      {children}
    </AdminShell>
  );
}

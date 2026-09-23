import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getRfqEntries, getCertificates } from "@/lib/repo";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: { template: "%s — Admin BBP", default: "Admin BBP" },
};

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const [rfq, certificates] = await Promise.all([getRfqEntries(), getCertificates()]);
  const rfqBadge = rfq.filter((r) => r.status === "baru").length;
  const certBadge = certificates.filter((c) => c.status !== "berlaku").length;

  return (
    <AdminShell userName={session.name} rfqBadge={rfqBadge} certBadge={certBadge}>
      {children}
    </AdminShell>
  );
}

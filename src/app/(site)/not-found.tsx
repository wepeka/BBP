import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTexts } from "@/lib/repo";

export default async function NotFound() {
  const t = await getTexts();
  return (
    <section className="container-x flex min-h-[60vh] flex-col justify-center py-24">
      <p className="font-data text-[13px] uppercase tracking-[0.16em] text-[var(--color-teal-text)]">Error 404</p>
      <h1 className="h-page mt-4 max-w-2xl text-[var(--color-ink)]">{t["common.notfound.title"]}</h1>
      <p className="lede mt-5 max-w-xl whitespace-pre-line">{t["common.notfound.body"]}</p>
      <div className="mt-9 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primary">
          Ke beranda <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <Link href="/proyek" className="btn btn-ghost">
          Lihat proyek
        </Link>
      </div>
    </section>
  );
}

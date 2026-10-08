import { getMedia, getSettings, getTexts } from "@/lib/repo";
import { firstMedia } from "@/lib/media";
import { isPageHidden } from "@/lib/sections";
import { telHref } from "@/lib/site";
import { SiteHeader, type NavItem } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { WhatsAppFab } from "@/components/site/whatsapp-fab";
import { BackgroundMotion } from "@/components/site/background-motion";
import { RevealObserver } from "@/components/site/reveal-observer";
import { NavProgress } from "@/components/site/nav-progress";
import { OrganizationJsonLd } from "@/components/site/json-ld";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, t, media] = await Promise.all([getSettings(), getTexts(), getMedia()]);
  const logo = firstMedia(media, "brand.logo")?.src;
  const nav: NavItem[] = [
    { href: "/tentang", label: t["common.nav.tentang"] },
    { href: "/layanan", label: t["common.nav.layanan"] },
    { href: "/proyek", label: t["common.nav.proyek"] },
    { href: "/kapasitas", label: t["common.nav.kapasitas"] },
    { href: "/legalitas", label: t["common.nav.legalitas"] },
    { href: "/klien", label: t["common.nav.klien"] },
  ];

  const extraLinks: NavItem[] = [
    { href: "/k3", label: t["common.nav.k3"], id: "k3" },
    { href: "/karier", label: t["common.nav.karier"], id: "karier" },
  ]
    .filter((l) => !isPageHidden(l.id, settings.hiddenPages))
    .map(({ href, label }) => ({ href, label }));

  return (
    <div className="flex min-h-screen flex-col">
      <BackgroundMotion />
      <NavProgress />
      <SiteHeader
        nav={nav}
        ctaLabel={t["common.headerCta"]}
        phone={settings.phone}
        phoneHref={telHref(settings.phone)}
        companyName={settings.companyName}
        tagline={settings.tagline}
        logoSrc={logo}
      />
      <main id="konten-utama" className="flex-1">
        {children}
      </main>
      <SiteFooter settings={settings} texts={t} nav={[...nav, ...extraLinks]} logoSrc={logo} />
      <WhatsAppFab whatsapp={settings.whatsapp} message={settings.whatsappMessage} label={t["common.wa.label"]} />
      <RevealObserver />
      <OrganizationJsonLd settings={settings} logo={logo} />
    </div>
  );
}

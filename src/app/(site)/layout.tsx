import { getSettings } from "@/lib/repo";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { WhatsAppFab } from "@/components/site/whatsapp-fab";
import { BackgroundMotion } from "@/components/site/background-motion";
import { RevealObserver } from "@/components/site/reveal-observer";
import { NavProgress } from "@/components/site/nav-progress";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  return (
    <div className="flex min-h-screen flex-col">
      <BackgroundMotion />
      <NavProgress />
      <SiteHeader settings={settings} />
      <main id="konten-utama" className="flex-1">
        {children}
      </main>
      <SiteFooter settings={settings} />
      <WhatsAppFab whatsapp={settings.whatsapp} />
      <RevealObserver />
    </div>
  );
}

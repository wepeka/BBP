import type { Metadata } from "next";
import { Poppins, Inter, IBM_Plex_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { getSettings, getTexts } from "@/lib/repo";

// Runs before hydration so a returning visitor's chosen theme applies
// before first paint — otherwise the page would flash the system-default
// theme first, then jump to their saved choice.
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("bbp-theme");
    if (stored === "light" || stored === "dark") {
      document.documentElement.setAttribute("data-theme", stored);
    }
  } catch (e) {}
})();
`;

// Display face: BBP's brand guidelines specify Nexa Heavy, a commercial
// font with no free web-embed license. Poppins (Bold/ExtraBold/Black) is
// the closest freely-licensable geometric-sans match for headlines.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

// Body face: Inter is BBP's own specified typeface — used directly.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const [settings, texts] = await Promise.all([getSettings(), getTexts()]);
  const title = `${settings.companyName} — ${settings.tagline}`;
  const description = texts["home.hero.subtitle"];
  return {
    title: {
      default: title,
      template: `%s — ${settings.shortName}`,
    },
    description,
    keywords: [
      "kontraktor kediri",
      "general contractor jawa timur",
      "kontraktor baja",
      "kontraktor gudang",
      "PT Bina Bangun Perkasa",
    ],
    metadataBase: new URL("https://binabangunperkasa.co.id"),
    openGraph: {
      title,
      description,
      locale: "id_ID",
      type: "website",
      siteName: settings.companyName,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${poppins.variable} ${inter.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-[var(--color-bg)] text-[var(--color-ink)]">
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <a
          href="#konten-utama"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-[var(--color-teal)] focus:px-4 focus:py-2 focus:text-[var(--color-on-teal)]"
        >
          Lompat ke konten utama
        </a>
        {children}
      </body>
    </html>
  );
}

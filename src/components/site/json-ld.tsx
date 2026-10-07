import type { Settings } from "@/lib/types";
import { SITE_URL } from "@/lib/site";
import { DEFAULT_LOGO } from "@/components/logo";

/** Structured data so search engines know the company, address and contact. */
export function OrganizationJsonLd({ settings, logo }: { settings: Settings; logo?: string }) {
  const sameAs = Object.values(settings.social)
    .filter((v) => v?.trim())
    .map((v) => (v.startsWith("http") ? v : `https://${v}`));
  const data = {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "@id": `${SITE_URL}/#organization`,
    name: settings.companyName,
    alternateName: settings.shortName,
    slogan: settings.taglineLong,
    url: SITE_URL,
    logo: `${SITE_URL}${logo ?? DEFAULT_LOGO}`,
    image: `${SITE_URL}/opengraph-image`,
    email: settings.email,
    telephone: settings.phone,
    foundingDate: settings.established,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: settings.city,
      addressRegion: settings.province,
      addressCountry: "ID",
    },
    geo: { "@type": "GeoCoordinates", latitude: settings.officeLat, longitude: settings.officeLng },
    openingHours: settings.workingHours,
    areaServed: "ID",
    ...(sameAs.length ? { sameAs } : {}),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

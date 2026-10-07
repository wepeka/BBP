import type { SocialLinks } from "@/lib/types";

/* Simple line glyphs for social networks (lucide no longer ships brand icons). */
const PATHS: Record<keyof SocialLinks, React.ReactNode> = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </>
  ),
  facebook: <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8a1 1 0 0 1 1-1z" />,
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="m10 9 5 3-5 3z" fill="currentColor" />
    </>
  ),
  tiktok: <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.4 2.6 2.2 4.4 5 4.6" />,
};

const LABELS: Record<keyof SocialLinks, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  tiktok: "TikTok",
};

export function SocialIcons({ social, className = "" }: { social: SocialLinks; className?: string }) {
  const entries = (Object.keys(PATHS) as (keyof SocialLinks)[]).filter((k) => social[k]?.trim());
  if (!entries.length) return null;
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {entries.map((k) => (
        <li key={k}>
          <a
            href={social[k].startsWith("http") ? social[k] : `https://${social[k]}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={LABELS[k]}
            className="flex h-10 w-10 items-center justify-center rounded-[6px] border border-[var(--color-line)] text-[var(--color-ink-2)] transition-colors hover:border-[var(--color-teal)] hover:text-[var(--color-teal-text)]"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {PATHS[k]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}

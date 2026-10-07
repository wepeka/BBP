/**
 * Fixed, decorative page background: a drafting-table grid with two soft
 * brand-coloured glows drifting slowly. CSS-only (see globals.css), static on
 * phones and frozen for visitors who prefer reduced motion.
 */
export function BackgroundMotion() {
  return (
    <div className="bg-motion" aria-hidden="true">
      <div className="bg-motion__grid" />
      <div className="bg-motion__blob bg-motion__blob--green" />
      <div className="bg-motion__blob bg-motion__blob--yellow" />
    </div>
  );
}

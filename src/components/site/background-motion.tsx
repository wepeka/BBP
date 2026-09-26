/**
 * Fixed, decorative page background with slow ambient motion: drifting
 * brand-coloured light, a panning blueprint grid, and faint sun rays that
 * echo the yellow disc in the BBP logo. CSS-only (see globals.css) and
 * frozen for visitors who prefer reduced motion.
 */
export function BackgroundMotion() {
  return (
    <div className="bg-motion" aria-hidden="true">
      <div className="bg-motion__rays" />
      <div className="bg-motion__grid" />
      <div className="bg-motion__blob bg-motion__blob--green" />
      <div className="bg-motion__blob bg-motion__blob--yellow" />
      <div className="bg-motion__blob bg-motion__blob--deep" />
    </div>
  );
}

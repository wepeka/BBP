/** Eyebrow + heading (+ optional intro and action) used at the top of every section. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  action,
  as: Tag = "h2",
  dark,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  action?: React.ReactNode;
  as?: "h1" | "h2";
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-end justify-between gap-x-10 gap-y-5 ${className}`}>
      <div className="max-w-2xl">
        {eyebrow && <p className={`eyebrow ${dark ? "on-dark" : ""}`}>{eyebrow}</p>}
        <Tag
          className={`${Tag === "h1" ? "h-page" : "h-section"} mt-4 ${dark ? "text-[var(--color-on-panel-dark)]" : "text-[var(--color-ink)]"}`}
        >
          {title}
        </Tag>
        {intro && (
          <p className={`mt-5 whitespace-pre-line ${dark ? "text-[17px] leading-relaxed text-[var(--color-on-panel-dark)]/75" : "lede"}`}>
            {intro}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

/** Light page header band shared by the inner pages. */
export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  children?: React.ReactNode;
}) {
  return (
    <section id="sec-intro" className="border-b border-[var(--color-line)] bg-[var(--color-band)]">
      <div className="container-x py-14 sm:py-20" data-no-reveal>
        <div className="hero-in">
          <SectionHeading as="h1" eyebrow={eyebrow} title={title} intro={intro} />
        </div>
        {children && (
          <div className="hero-in" style={{ "--d": "120ms" } as React.CSSProperties}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}

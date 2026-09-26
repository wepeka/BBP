import { ViewTransition } from "react";

// Templates remount on every navigation (unlike layouts), so the enter /
// exit animations here play for each page change. Styles in globals.css.
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}

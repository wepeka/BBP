/** Parses a YouTube or Vimeo link into what the lightweight player needs. */
export interface VideoInfo {
  provider: "youtube" | "vimeo";
  id: string;
  embedUrl: string;
  thumbnail: string | null;
}

export function parseVideoUrl(input: string | null | undefined): VideoInfo | null {
  const raw = (input ?? "").trim();
  if (!raw) return null;
  let url: URL;
  try {
    url = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\.|^m\./, "");

  let yt: string | null = null;
  if (host === "youtu.be") yt = url.pathname.slice(1).split("/")[0];
  else if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
    yt = url.searchParams.get("v") ?? url.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/?#]+)/)?.[1] ?? null;
  }
  if (yt && /^[\w-]{6,20}$/.test(yt)) {
    const start = Number(url.searchParams.get("t")?.replace(/s$/, "")) || 0;
    return {
      provider: "youtube",
      id: yt,
      embedUrl: `https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0&modestbranding=1&playsinline=1${start ? `&start=${start}` : ""}`,
      thumbnail: `https://i.ytimg.com/vi/${yt}/hqdefault.jpg`,
    };
  }

  if (host.endsWith("vimeo.com")) {
    const m = url.pathname.match(/\/(?:video\/)?(\d+)(?:\/([\da-f]+))?/);
    if (m) {
      const hash = m[2] ?? url.searchParams.get("h");
      return {
        provider: "vimeo",
        id: m[1],
        embedUrl: `https://player.vimeo.com/video/${m[1]}?autoplay=1${hash ? `&h=${hash}` : ""}`,
        thumbnail: null,
      };
    }
  }
  return null;
}

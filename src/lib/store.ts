import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { cache } from "react";
import { del, get, list, put } from "@vercel/blob";

/*
 * Two storage backends behind one API:
 *
 * - Vercel (BLOB_READ_WRITE_TOKEN set): a PRIVATE Vercel Blob store. The
 *   deployed filesystem is read-only, so admin edits, RFQ submissions and
 *   uploads live there. A collection that has never been saved to Blob yet
 *   falls back to the JSON file bundled with the deploy, so existing content
 *   carries over without a migration step.
 * - Local dev (no token): JSON files in /content and uploads in /public,
 *   exactly as before, so changes show up in git diff.
 */
const CONTENT_DIR = path.join(process.cwd(), "content");
const PUBLIC_DIR = path.join(process.cwd(), "public");

export const useBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

/** Folders an admin can upload into (and delete from). */
export const UPLOAD_PREFIXES = ["images/uploads/", "documents/"] as const;

let writeQueue: Promise<unknown> = Promise.resolve();

async function readLocal(name: string): Promise<unknown | undefined> {
  try {
    const raw = await fs.readFile(path.join(CONTENT_DIR, `${name}.json`), "utf-8");
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

async function readRaw(name: string): Promise<unknown | undefined> {
  if (useBlob) {
    // useCache: false — always read the latest version right after an admin save.
    const res = await get(`content/${name}.json`, { access: "private", useCache: false });
    if (res?.statusCode === 200) {
      return JSON.parse(await new Response(res.stream).text());
    }
  }
  return readLocal(name);
}

/**
 * One read per collection per render: a page, its layout and its metadata
 * often ask for the same collection, and on Vercel each read is a network
 * round trip. Mutations use `readCollectionFresh` so they never see a value
 * cached earlier in the same request.
 */
const readCached = cache(readRaw);

/** Reads a JSON collection. Returns `fallback` if it doesn't exist anywhere. */
export async function readCollection<T>(name: string, fallback: T): Promise<T> {
  const value = await readCached(name);
  return (value === undefined ? fallback : value) as T;
}

/** Uncached read, for read-modify-write in server actions. */
export async function readCollectionFresh<T>(name: string, fallback: T): Promise<T> {
  const value = await readRaw(name);
  return (value === undefined ? fallback : value) as T;
}

/**
 * Writes a JSON collection. Writes are queued so concurrent admin actions in
 * the same process never interleave and corrupt a collection.
 */
export function writeCollection<T>(name: string, data: T): Promise<void> {
  const json = JSON.stringify(data, null, 2) + "\n";
  const run = async () => {
    if (useBlob) {
      await put(`content/${name}.json`, json, {
        access: "private",
        allowOverwrite: true,
        addRandomSuffix: false,
        contentType: "application/json",
      });
      return;
    }
    const file = path.join(CONTENT_DIR, `${name}.json`);
    const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
    await fs.writeFile(tmp, json, "utf-8");
    await fs.rename(tmp, file);
  };
  writeQueue = writeQueue.then(run, run);
  return writeQueue as Promise<void>;
}

/**
 * Stores an uploaded file and returns the URL the site should use for it.
 * `pathname` is relative, e.g. "images/uploads/<folder>/<file>.webp".
 * On Vercel it goes to the private Blob store and is served via /media/…;
 * locally it's written under /public.
 */
export async function saveUpload(pathname: string, data: Buffer, contentType: string): Promise<string> {
  if (useBlob) {
    const blob = await put(pathname, data, { access: "private", addRandomSuffix: true, contentType });
    return `/media/${blob.pathname}`;
  }
  const file = path.join(PUBLIC_DIR, pathname);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, data);
  return `/${pathname}`;
}

export interface StoredUpload {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
}

async function walk(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  const files = await Promise.all(
    entries.map((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]))
  );
  return files.flat();
}

/** Every file uploaded through the admin under `prefix`, newest first. */
export async function listUploads(prefix: (typeof UPLOAD_PREFIXES)[number]): Promise<StoredUpload[]> {
  if (useBlob) {
    const out: StoredUpload[] = [];
    let cursor: string | undefined;
    do {
      const page = await list({ prefix, cursor, limit: 1000 });
      for (const b of page.blobs) {
        out.push({
          url: `/media/${b.pathname}`,
          pathname: b.pathname,
          size: b.size,
          uploadedAt: new Date(b.uploadedAt).toISOString(),
        });
      }
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    return out.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
  }
  const files = await walk(path.join(PUBLIC_DIR, prefix));
  const out = await Promise.all(
    files
      .filter((f) => !path.basename(f).startsWith("."))
      .map(async (f) => {
        const stat = await fs.stat(f);
        const pathname = path.relative(PUBLIC_DIR, f).split(path.sep).join("/");
        return { url: `/${pathname}`, pathname, size: stat.size, uploadedAt: stat.mtime.toISOString() };
      })
  );
  return out.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
}

/** Turns a site URL of an uploaded file back into its storage pathname. */
export function uploadPathname(url: string): string | null {
  const pathname = url.replace(/^\/media\//, "").replace(/^\//, "");
  if (pathname.includes("..")) return null;
  return UPLOAD_PREFIXES.some((p) => pathname.startsWith(p)) ? pathname : null;
}

/** Deletes an uploaded file. Built-in images (outside the upload folders) are never touched. */
export async function deleteUpload(url: string): Promise<boolean> {
  const pathname = uploadPathname(url);
  if (!pathname) return false;
  if (useBlob) {
    await del(pathname);
    return true;
  }
  await fs.unlink(path.join(PUBLIC_DIR, pathname)).catch(() => undefined);
  return true;
}

export function newId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now().toString(36)}${rand}`;
}

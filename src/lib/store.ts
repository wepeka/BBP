import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { get, put } from "@vercel/blob";

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
const useBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

let writeQueue: Promise<unknown> = Promise.resolve();

async function readLocal<T>(name: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(CONTENT_DIR, `${name}.json`), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Reads a JSON collection. Returns `fallback` if it doesn't exist anywhere. */
export async function readCollection<T>(name: string, fallback: T): Promise<T> {
  if (useBlob) {
    // useCache: false — always read the latest version right after an admin save.
    const res = await get(`content/${name}.json`, { access: "private", useCache: false });
    if (res?.statusCode === 200) {
      return JSON.parse(await new Response(res.stream).text()) as T;
    }
  }
  return readLocal(name, fallback);
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
 * `pathname` is relative, e.g. "images/uploads/<slug>/<file>.jpg".
 * On Vercel it goes to the private Blob store and is served via /media/…;
 * locally it's written under /public.
 */
export async function saveUpload(pathname: string, data: Buffer, contentType: string): Promise<string> {
  if (useBlob) {
    const blob = await put(pathname, data, { access: "private", addRandomSuffix: true, contentType });
    return `/media/${blob.pathname}`;
  }
  const file = path.join(process.cwd(), "public", pathname);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, data);
  return `/${pathname}`;
}

export function newId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now().toString(36)}${rand}`;
}

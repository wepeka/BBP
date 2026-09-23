import "server-only";
import { promises as fs } from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content");

let writeQueue: Promise<unknown> = Promise.resolve();

/** Reads a JSON collection file from /content. Returns `fallback` if the file is missing. */
export async function readCollection<T>(name: string, fallback: T): Promise<T> {
  const file = path.join(CONTENT_DIR, `${name}.json`);
  try {
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * Writes a JSON collection file. Writes are queued so concurrent admin
 * actions never interleave and corrupt a file.
 */
export function writeCollection<T>(name: string, data: T): Promise<void> {
  const run = async () => {
    const file = path.join(CONTENT_DIR, `${name}.json`);
    const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(data, null, 2) + "\n", "utf-8");
    await fs.rename(tmp, file);
  };
  writeQueue = writeQueue.then(run, run);
  return writeQueue as Promise<void>;
}

export function newId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now().toString(36)}${rand}`;
}

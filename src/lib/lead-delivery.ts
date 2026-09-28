// Server-side helpers shared by the lead API routes.
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

const WINDOW_MS = 10 * 60 * 1000;
const buckets = new Map<string, Map<string, { count: number; resetAt: number }>>();

/**
 * Best-effort, per-instance rate limit with separate buckets per route, so background partial saves can never
 * use up the allowance for the real submission. Put a real limiter (e.g. Upstash, Vercel WAF) in front for production.
 */
export function rateLimited(bucket: string, request: Request, max: number) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const hits = buckets.get(bucket) ?? new Map<string, { count: number; resetAt: number }>();
  buckets.set(bucket, hits);
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > max;
}

export async function readJson(request: Request): Promise<unknown | undefined> {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}

/** Bots fill the hidden "website" field; people never see it. */
export function honeypotFilled(body: unknown) {
  return typeof body === "object" && body !== null && "website" in body && String(body.website).trim() !== "";
}

/**
 * Sends a payload to a webhook. Without one, development appends it to a git-ignored JSONL file in `.data/`,
 * and production relies on the server logs.
 */
export async function deliver(
  payload: object,
  { webhook, file, label }: { webhook?: string; file: string; label: string },
): Promise<"sent" | "saved" | "logged" | "failed"> {
  // Always log, so nothing is lost even if the webhook is down.
  console.info(`[${label}]`, JSON.stringify(payload));

  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
      return "sent";
    } catch (err) {
      console.error(`[${label}] webhook delivery failed`, err);
      return "failed";
    }
  }

  if (process.env.NODE_ENV !== "production") {
    const dir = path.join(process.cwd(), ".data");
    await mkdir(dir, { recursive: true });
    await appendFile(path.join(dir, file), JSON.stringify(payload) + "\n");
    return "saved";
  }

  console.warn(`[${label}] no webhook configured — only written to the logs.`);
  return "logged";
}

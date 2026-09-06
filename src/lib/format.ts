import { LAMPORTS_PER_COOK } from "../cluster";

export function formatCook(lamports: number, digits = 9): string {
  const sign = lamports < 0 ? "-" : "";
  const n = Math.abs(lamports) / LAMPORTS_PER_COOK;
  const raw = n.toFixed(digits).replace(/\.?0+$/, "");
  const [whole, frac] = raw.split(".");
  const grouped = Number(whole).toLocaleString("en-US");
  return frac ? `${sign}${grouped}.${frac}` : `${sign}${grouped}`;
}

export function formatInt(n: number): string {
  return n.toLocaleString("en-US");
}

export function shortKey(key: string, head = 4, tail = 4): string {
  if (key.length <= head + tail + 1) return key;
  return `${key.slice(0, head)}…${key.slice(-tail)}`;
}

export function timeAgo(unixSeconds: number | null | undefined): string {
  if (unixSeconds == null) return "—";
  const delta = Math.max(0, Date.now() / 1000 - unixSeconds);
  if (delta < 5) return "just now";
  if (delta < 60) return `${Math.floor(delta)}s ago`;
  if (delta < 3600) return `${Math.floor(delta / 60)}m ago`;
  if (delta < 86400) return `${Math.floor(delta / 3600)}h ago`;
  return `${Math.floor(delta / 86400)}d ago`;
}

export async function copyText(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

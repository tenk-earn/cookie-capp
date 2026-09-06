import { Buffer } from "buffer";

if (typeof window !== "undefined") {
  window.Buffer = window.Buffer || Buffer;
  const g = globalThis as typeof globalThis & {
    Buffer: typeof Buffer;
    global?: typeof globalThis;
    process?: { env: Record<string, string | undefined> };
  };
  g.Buffer = g.Buffer || Buffer;
  g.global = g.global || g;
  g.process = g.process || { env: {} };
}

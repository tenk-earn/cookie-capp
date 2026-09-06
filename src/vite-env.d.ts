/// <reference types="vite/client" />

export {};

declare global {
  interface Window {
    Buffer: typeof import("buffer").Buffer;
  }
}

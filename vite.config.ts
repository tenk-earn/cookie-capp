import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const mobileShim = fileURLToPath(
  new URL("./src/shims/wallet-adapter-mobile.ts", import.meta.url),
);

export default defineConfig({
  plugins: [react()],
  define: {
    global: "globalThis",
  },
  resolve: {
    alias: {
      buffer: "buffer",
      "@solana-mobile/wallet-adapter-mobile": mobileShim,
    },
  },
  optimizeDeps: {
    include: ["buffer", "@solana/web3.js"],
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
});

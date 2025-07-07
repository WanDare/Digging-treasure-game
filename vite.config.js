import { defineConfig } from "vite";
import viteCompression from "vite-plugin-compression";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command }) => ({
  base: command === "build" ? "/digging-treasure-game/" : "/",
  server: {
    port: 3000,
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        format: "es",
        manualChunks: {
          phaser: ["phaser"],
        },
      },
    },
  },
  plugins: [viteCompression(), tailwindcss()],
}));

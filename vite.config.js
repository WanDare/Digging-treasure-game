import { defineConfig } from "vite";
import viteCompression from "vite-plugin-compression";

export default defineConfig({
  base: "./",
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
  plugins: [viteCompression()],
});

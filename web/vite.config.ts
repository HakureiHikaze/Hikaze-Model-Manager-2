import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    // IMPORTANT: ComfyUI will auto-import *every* .js under the registered web root.
    // This build outputs a single, side-effectful ComfyUI extension module (NOT an SPA),
    // so we must avoid extra JS chunks/assets that would be imported as well.
    outDir: "dist",
    emptyOutDir: true,
    cssCodeSplit: false,
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, "extensions/hikaze-model-manager.js"),
      formats: ["es"],
      fileName: () => "hikaze-model-manager.js",
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});

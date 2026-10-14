import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import path from "node:path";

export default defineConfig({
  base: "./",

  plugins: [
    react(),
    tailwindcss(),

    {
      name: "move-customer-index",
      closeBundle() {
        const source = path.resolve(
          "dist/customer-build/index.html"
        );

        const target = path.resolve(
          "dist/index.html"
        );

        if (fs.existsSync(source)) {
          fs.renameSync(source, target);
          fs.rmSync(
            path.resolve("dist/customer-build"),
            {
              recursive: true,
              force: true,
            }
          );
        }
      },
    },
  ],

  build: {
    outDir: "dist",
    emptyOutDir: true,

    rollupOptions: {
      input: "customer-build/index.html",
    },
  },
});
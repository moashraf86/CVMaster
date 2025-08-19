import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import viteCompression from "vite-plugin-compression";

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
    }),
    viteCompression({
      algorithm: "gzip",
      ext: ".gz",
      threshold: 1024,
      deleteOriginFile: false,
    }),
  ],
  build: {
    minify: "esbuild",
    sourcemap: false,
    rollupOptions: {
      treeshake: true,
      output: {
        manualChunks: {
          // Core React
          "react-vendor": ["react", "react-dom", "react-router"],
          // Form Handling & Validation
          forms: ["react-hook-form", "@hookform/resolvers", "zod"],
          // State management
          state: ["zustand"],
          // Dnd Kit
          dnd: ["@dnd-kit/core", "@dnd-kit/sortable", "@dnd-kit/utilities"],
          // Radix
          radix: [
            "@radix-ui/react-accordion",
            "@radix-ui/react-alert-dialog",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-dialog",
            "@radix-ui/react-label",
            "@radix-ui/react-popover",
            "@radix-ui/react-scroll-area",
            "@radix-ui/react-select",
            "@radix-ui/react-separator",
            "@radix-ui/react-slider",
            "@radix-ui/react-slot",
            "@radix-ui/react-switch",
            "@radix-ui/react-tabs",
            "@radix-ui/react-toast",
            "@radix-ui/react-tooltip",
          ],
          // Tiptap Editor
          tiptap: [
            "@tiptap/react",
            "@tiptap/extension-bold",
            "@tiptap/extension-bullet-list",
            "@tiptap/extension-document",
            "@tiptap/extension-history",
            "@tiptap/extension-italic",
            "@tiptap/extension-link",
            "@tiptap/extension-list-item",
            "@tiptap/extension-ordered-list",
            "@tiptap/extension-paragraph",
            "@tiptap/extension-text",
          ],
          // Icons
          icons: ["lucide-react"],
          // Utilities
          utils: [
            "qs",
            "dotenv",
            "clsx",
            "class-variance-authority",
            "tailwind-merge",
            "tailwindcss-animate",
            "cmdk",
            "@uidotdev/usehooks",
          ],
          // Services
          services: ["groq-sdk", "@vercel/analytics"],
        },
      },
    },
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

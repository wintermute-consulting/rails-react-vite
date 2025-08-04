import { defineConfig } from "vite";
import RubyPlugin from "vite-plugin-ruby";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [RubyPlugin(), react(), tailwindcss()],

  esbuild: {
    include: /\.js$/,
    exclude: [],
    loader: "jsx",
  },

  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },

  build: {
    sourcemap: true,
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@assets": path.resolve(__dirname, "./src/assets"),
    },
  },

  server: {
    port: 5173,
    open: true,                    // Auto-open browser on dev
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://localhost:8000",   // Your backend (FastAPI / Node.js)
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        secure: false,
      },
    },
  },

  preview: {
    port: 4173,
    open: true,
  },

  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["lucide-react", "clsx", "tailwind-merge", "framer-motion"],
          charts: ["recharts"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },

  define: {
    __APP_NAME__: JSON.stringify("ReviewSense"),
    __APP_VERSION__: JSON.stringify("1.0.0"),
    __APP_DESCRIPTION__: JSON.stringify("AI-Powered Product Review Analyzer"),
  },
});

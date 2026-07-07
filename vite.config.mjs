import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import ejs from "ejs";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const basePath = process.env.GITHUB_ACTIONS && repositoryName ? `/${repositoryName}/` : "/";

function renderHtmlWithEjs() {
  return {
    name: "render-html-with-ejs",
    transformIndexHtml: {
      order: "pre",
      handler(html, ctx) {
        const filename = ctx?.filename ?? path.resolve(process.cwd(), "index.html");

        return ejs.render(html, { basePath }, {
          filename,
          root: process.cwd(),
        });
      },
    },
  };
}

export default defineConfig({
  base: basePath,
  build: {
    rollupOptions: {
      input: {
        home: path.resolve(process.cwd(), "index.html"),
        new: path.resolve(process.cwd(), "new.html"),
        used: path.resolve(process.cwd(), "used.html"),
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [renderHtmlWithEjs(), react()],
});

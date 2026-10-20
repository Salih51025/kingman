import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function resolveBase() {
  if (process.env.VITE_BASE) {
    return process.env.VITE_BASE;
  }

  if (process.env.GITHUB_ACTIONS && process.env.GITHUB_REPOSITORY) {
    const repoName = process.env.GITHUB_REPOSITORY.split("/")[1];
    const owner = process.env.GITHUB_REPOSITORY.split("/")[0];
    if (repoName === `${owner}.github.io`) {
      return "/";
    }
    return `/${repoName}/`;
  }

  return "/";
}

export default defineConfig({
  plugins: [react()],
  base: resolveBase(),
  server: {
    port: 5173,
  },
});

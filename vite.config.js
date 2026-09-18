import { defineConfig } from 'vite';

// Relative base so the built assets resolve correctly whether the site is
// served from a domain root or a GitHub Pages project subpath
// (https://<user>.github.io/<repo>/) — no repo-name coupling needed.
export default defineConfig({
  base: './',
});

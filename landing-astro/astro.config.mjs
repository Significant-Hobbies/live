// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://live.significanthobbies.com',
  output: 'static',
  integrations: [react()],
  // Preserve inline word boundaries from the Astro 5 landing after the v7 upgrade.
  compressHTML: true,
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  vite: {
    plugins: [tailwindcss()],
    css: { transformer: 'lightningcss' },
    build: { cssMinify: 'lightningcss' },
  },
});

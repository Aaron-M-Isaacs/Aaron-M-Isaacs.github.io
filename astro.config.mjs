// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://aaron-isaacs-01.github.io',
  // No `base` key: this is a <username>.github.io user repo, which serves from
  // the domain root. Setting `base` here would 404 every asset and link.
  integrations: [sitemap()],
});

import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import node from '@astrojs/node';
import svelte from '@astrojs/svelte';
import expressiveCode from 'astro-expressive-code';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const siteUrl =
  process.env.PUBLIC_SITE_URL ||
  process.env.RENDER_EXTERNAL_URL ||
  'http://localhost:4321';
const siteOrigin = new URL(siteUrl);

export default defineConfig({
  site: siteUrl,
  output: 'server',
  security: {
    // Render's TLS proxy makes Astro reconstruct a different request origin.
    // Console mutations check the Origin header, and Better Auth checks its
    // configured trusted origins before accepting authentication requests.
    checkOrigin: false,
    allowedDomains: [
      // Trust only the public host in Render's forwarded request headers.
      {
        hostname: siteOrigin.hostname,
        protocol: siteOrigin.protocol.slice(0, -1),
      },
      { hostname: 'localhost', protocol: 'http' },
      { hostname: '127.0.0.1', protocol: 'http' },
    ],
  },
  devToolbar: {
    enabled: process.env.PLAYWRIGHT_TEST !== 'true',
  },
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [
    svelte(),
    expressiveCode({
      styleOverrides: {
        codeFontFamily: 'var(--type-code)',
        uiFontFamily: 'var(--type-ui)',
      },
    }),
    mdx(),
    sitemap({
      // Private workspace routes must never be advertised by the public sitemap.
      filter: (page) => !new URL(page).pathname.startsWith('/user'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});

import { defineConfig } from 'astro/config';

// https://astro.build
export default defineConfig({
  site: 'https://snapsbyrosa.com',
  server: { port: 4321, host: true },
});

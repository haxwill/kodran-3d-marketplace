import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-server-middleware',
      async configureServer(server) {
        const { default: apiApp } = await import('./server/server.js');
        server.middlewares.use(apiApp);
      },
      async configurePreviewServer(server) {
        const { default: apiApp } = await import('./server/server.js');
        server.middlewares.use(apiApp);
      }
    }
  ],
  server: {
    port: 3000,
    open: false
  }
});

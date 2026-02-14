import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    open: true,
    fs: {
      strict: false,
      allow: ['..'],
    },
    proxy: {
      // If needed to proxy API during development
      // '/api': {
      //   target: 'http://localhost:5000',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
      // },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Set to true for production debugging
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor chunks for better caching
          if (id.includes('node_modules')) {
            if (id.includes('react')) {
              return 'react-vendor';
            }
            if (id.includes('react-router')) {
              return 'router-vendor';
            }
            if (id.includes('axios')) {
              return 'http-vendor';
            }
            return 'vendor';
          }
        },
      },
    },
  },
  preview: {
    port: 4173,
    strictPort: false,
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
});

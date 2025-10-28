import path from 'node:path'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    // Need to use this host so that the dev server, when run in docker,
    // can be accessed from the host machine.
    host: '0.0.0.0',
    watch: {
      usePolling: process.env.IN_DEV_CONTAINER === 'true',
    },
    allowedHosts: ['localhost', 'frontend'],
    // HMR configuration for Docker
    hmr: {
      host: 'localhost',
      clientPort: 5173,
      protocol: 'ws',
    },
  },
  plugins: [
    TanStackRouterVite({
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
      routeFileIgnorePrefix: '-',
      quoteStyle: 'single',
    }),
    react(),
  ],
  define: {
    __APP_VERSION__: process.env.COMMIT_HASH
      ? JSON.stringify(process.env.COMMIT_HASH)
      : JSON.stringify('development'),
    global: {}, // For undefined global error
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/app': path.resolve(__dirname, './src/app'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/widgets': path.resolve(__dirname, './src/widgets'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/entities': path.resolve(__dirname, './src/entities'),
      '@/shared': path.resolve(__dirname, './src/shared'),
      src: path.resolve(__dirname, './src'),
    },
  },
})

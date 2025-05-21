import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import proxyOptions from './proxyOptions'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    host: '0.0.0.0',
    proxy: proxyOptions
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: '../internal_ticketing/public/ticket_dashboard',
    emptyOutDir: true,
    target: 'es2015',
  },
})

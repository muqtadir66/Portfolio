import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { sites } from '@openai/sites-vite-plugin'
import { cloudflare } from '@cloudflare/vite-plugin'

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/Portfolio/' : '/',
  plugins: [react(), cloudflare(), sites()],
})

/// <reference types="vitest/config" />

import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'

const defaultSiteUrl = 'https://dsp.pages.dev'

function normalizeSiteUrl(value?: string) {
  const candidate = value?.trim()

  if (!candidate) return defaultSiteUrl

  try {
    const url = new URL(candidate)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return defaultSiteUrl
    return url.href.replace(/\/+$/, '')
  } catch {
    return defaultSiteUrl
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = normalizeSiteUrl(env.VITE_SITE_URL)

  return {
    plugins: [
      {
        name: 'event-social-metadata',
        transformIndexHtml: {
          order: 'pre',
          handler: (html) => html.replaceAll('__SITE_URL__', siteUrl),
        },
      },
      tailwindcss(),
      vue(),
    ],
    test: {
      environment: 'jsdom',
    },
  }
})

import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'tests/ui',
  retries: 0,
  timeout: 30_000,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:4077',
    headless: true,
    actionTimeout: 10_000,
    screenshot: 'off',
    video: 'off',
  },
  webServer: {
    command: 'next start -p 4077',
    url: 'http://localhost:4077',
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
})

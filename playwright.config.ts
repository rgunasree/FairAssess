import { defineConfig } from '@playwright/test'

export default defineConfig({
  testMatch: ['tests/**/*.spec.ts'],
  projects: [
    {
      name: 'unit',
      testMatch: /tests\/(?!ui).*\.spec\.ts/,
      testDir: 'tests',
    },
    {
      name: 'ui',
      testDir: 'tests/ui',
      use: {
        baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:4077',
        headless: true,
        actionTimeout: 10_000,
        screenshot: 'off',
        video: 'off',
      },
    },
  ],
  webServer: {
    command: 'next start -p 4077',
    url: 'http://localhost:4077',
    reuseExistingServer: true,
    timeout: 120_000,
  },
})

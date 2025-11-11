import { test, expect } from '@playwright/test'

// Stub clipboard for all tests in this file
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    // @ts-ignore
    navigator.clipboard.writeText = (t) => {
      // @ts-ignore
      window.__copied = t
      return Promise.resolve()
    }
  })
})

test('home navigation buttons navigate correctly', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' })
  // Try Now -> /analyze
  await page.locator('a[href="/analyze"]').first().click()
  await expect(page).toHaveURL(/\/analyze$/)
  // Dashboard -> /results
  await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' })
  await page.locator('a[href="/results"]').first().click()
  await expect(page).toHaveURL(/\/results$/)
})

test('analyze flow: analyze, copy, download PDF/CSV', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/analyze`, { waitUntil: 'networkidle' })
  // Enter text and analyze
  await page.locator('textarea[placeholder^="Paste your job description"]').fill('We seek an aggressive, energetic digital native.')
  await page.getByRole('button', { name: 'Analyze for Bias' }).click()
  await page.getByText('Bias Analysis Report').waitFor()
  // Copy improved
  await page.getByRole('button', { name: 'Copy' }).click()
  const copied = await page.evaluate(() => (window as any).__copied)
  expect(copied).toBeTruthy()
  // Download PDF
  const pdfDownload = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Download PDF Report' }).click(),
  ])
  expect((await pdfDownload[0].suggestedFilename()).endsWith('.pdf')).toBeTruthy()
  // Export CSV
  const csvDownload = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Export CSV' }).click(),
  ])
  expect((await csvDownload[0].suggestedFilename()).endsWith('.csv')).toBeTruthy()
})

test('results page: charts render, view report, apply fix copies', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/results`, { waitUntil: 'networkidle' })
  // Charts headings present
  await page.getByText('Fairness Score Trend').waitFor()
  await page.getByText('Bias Type Distribution').waitFor()
  // View Report opens dialog (click first button)
  const viewReport = page.getByRole('button', { name: 'View Report' }).first()
  await viewReport.click()
  await page.locator('[data-slot="dialog-content"]').waitFor()
  // Copy from dialog
  await page.getByRole('button', { name: 'Copy Improved' }).click()
  const copied1 = await page.evaluate(() => (window as any).__copied)
  expect(copied1).toBeTruthy()
  // Apply Fix in page (outside dialog)
  await page.getByRole('button', { name: 'Apply Fix' }).first().click()
  const copied2 = await page.evaluate(() => (window as any).__copied)
  expect(copied2).toBeTruthy()
})

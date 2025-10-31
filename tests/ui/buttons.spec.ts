import { test, expect } from '@playwright/test'

const routes = ['/', '/analyze', '/results', '/contact', '/privacy', '/terms']

// Utility to get bg and text color
async function getColors(el: import('@playwright/test').Locator) {
  const [bg, color] = await Promise.all([
    el.evaluate((e) => getComputedStyle(e as Element).backgroundColor),
    el.evaluate((e) => getComputedStyle(e as Element).color),
  ])
  return { bg, color }
}

test.describe('Buttons and hover states', () => {
  for (const path of routes) {
    test(`route ${path} - clickable and hover styling`, async ({ page, baseURL }) => {
      const url = `${baseURL}${path}`
      const errors: any[] = []
      page.on('pageerror', (e) => errors.push(e))

      await page.goto(url, { waitUntil: 'networkidle' })

      // Collect buttons and link-like buttons
      const buttons = page.locator('button, [data-slot="button"], a[role="button"], a[class*="inline-flex"][class*="rounded-"]')
      const count = await buttons.count()

      // If no buttons found, ensure header CTA exists on most pages
      expect(count).toBeGreaterThan(0)

      for (let i = 0; i < count; i++) {
        const el = buttons.nth(i)
        if (!(await el.isVisible())) continue
        const isDisabled = await el.isDisabled().catch(() => false)
        const pointer = await el.evaluate((e) => getComputedStyle(e as Element).pointerEvents)
        if (isDisabled || pointer === 'none') continue

        // Scroll into view
        await el.scrollIntoViewIfNeeded()

        // Colors before hover
        const before = await getColors(el)

        // Hover
        await el.hover({ trial: true }).catch(() => {})
        const after = await getColors(el)

        // At least one of background or text color should change on hover
        const changed = before.bg !== after.bg || before.color !== after.color
        expect(changed, `Hover style did not change for element #${i} on ${path}`).toBeTruthy()

        // Click without hard navigation: prevent default for anchors
        await page.evaluate((node) => {
          if (node instanceof HTMLElement) {
            node.addEventListener(
              'click',
              (e) => {
                const target = e.target as HTMLElement
                if (target && (target.tagName === 'A' || target.closest('a'))) e.preventDefault()
              },
              { once: true, capture: true },
            )
          }
        }, await el.elementHandle())

        await el.click({ force: true }).catch(() => {})
      }

      // No runtime errors should be thrown during interactions
      expect(errors, `Console errors on ${path}: ${errors.map(String).join('\n')}`).toHaveLength(0)
    })
  }
})

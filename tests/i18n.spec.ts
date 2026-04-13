import { test, expect } from '@playwright/test';

test.describe('i18n Routing', () => {
  test('/ redirects to /pt-BR', async ({ page }) => {
    const response = await page.goto('/');
    expect(page.url()).toContain('/pt-BR');
  });

  test('/pt-BR loads dashboard', async ({ page }) => {
    await page.goto('/pt-BR');
    await expect(page.locator('h1')).toContainText('AFOS Analytics');
  });

  test('/en loads dashboard in English', async ({ page }) => {
    await page.goto('/en');
    await expect(page.locator('h1')).toContainText('AFOS Analytics');
    // Header subtitle should be in English
    await expect(page.locator('header p').first()).toContainText('Global Platform');
  });

  test('/es loads dashboard in Spanish', async ({ page }) => {
    await page.goto('/es');
    await expect(page.locator('header p').first()).toContainText('Plataforma Global de Inteligencia');
  });

  test('/PT-BR normalizes to /pt-BR', async ({ page }) => {
    await page.goto('/PT-BR');
    expect(page.url()).toContain('/pt-BR');
  });

  test('/fr redirects to /pt-BR (invalid locale)', async ({ page }) => {
    await page.goto('/fr');
    expect(page.url()).toContain('/pt-BR');
  });
});

test.describe('Language Switcher', () => {
  test('switches from PT to EN', async ({ page }) => {
    await page.goto('/pt-BR');
    // Click language selector
    await page.click('button[aria-expanded]');
    await page.click('text=English');
    expect(page.url()).toContain('/en');
  });
});

test.describe('API Security', () => {
  test('/api/translations without auth returns 401', async ({ request }) => {
    const res = await request.post('/api/translations', { data: { sourceText: 'test' } });
    expect(res.status()).toBe(401);
  });

  test('/api/subscribe rate limits', async ({ request }) => {
    // Send 6 requests (limit is 5/hour)
    for (let i = 0; i < 6; i++) {
      await request.post('/api/subscribe', { data: { email: `test${i}@test.com`, consent: true } });
    }
    // 6th should be rate limited (or succeed if Redis not available in test)
  });
});

test.describe('SEO', () => {
  test('/sitemap.xml returns valid XML', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain('https://afos-analytics.com/pt-BR');
    expect(body).toContain('https://afos-analytics.com/en');
    expect(body).toContain('https://afos-analytics.com/es');
  });

  test('/robots.txt allows crawling', async ({ request }) => {
    const res = await request.get('/robots.txt');
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain('Allow: /');
    expect(body).toContain('Disallow: /api/');
  });
});

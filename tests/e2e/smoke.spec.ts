import { test, expect } from '@playwright/test';

test('smoke: landing page', async ({ page }) => {
  await page.goto('/auth/signin');
  await expect(page.getByText('AI-assisted Teacher Diary')).toBeVisible();
});

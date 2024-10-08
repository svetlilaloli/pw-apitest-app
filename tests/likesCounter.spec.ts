import { test, expect, request } from '@playwright/test';

test('like counter increase', async ({ page, request }) => {
    await page.goto('https://conduit.bondaracademy.com')
	await page.getByText('Global Feed').click()
    const firstLikeButton = page.locator('app-article-preview').first().locator('button')
    await expect(firstLikeButton).toContainText('0')
    await firstLikeButton.click()
    await expect(firstLikeButton).toContainText('1')
})
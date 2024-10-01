import { test, expect, request } from '@playwright/test';
import tags from '../test-data/tags.json'

test.beforeEach(async ({ page }) => {
	// mocking API call
	await page.route('*/**/api/tags', async route => {
		await route.fulfill({
			body: JSON.stringify(tags)
		})
	})

	await page.goto('https://conduit.bondaracademy.com')
})

test('has title', async ({ page }) => {
	// modify response
	await page.route('*/**/api/articles*', async route => {
		const response = await route.fetch()
		const responseBody = await response.json()
		responseBody.articles[0].title = 'This is a MOCK test title'
		responseBody.articles[0].description = 'This is a MOCK test description'
		await route.fulfill({
			body: JSON.stringify(responseBody)
		})
	})

	await page.getByText('Global Feed').click()
	// await expect(page.locator('app-layout-header')).toContainText('conduit') // from generator
	await expect(page.locator('.navbar-brand')).toHaveText('conduit') // from course
	await expect(page.locator('.sidebar')).toContainText('automation')
	await expect(page.locator('app-article-list h1').first()).toContainText('This is a MOCK test title')
	await expect(page.locator('app-article-list p').first()).toContainText('This is a MOCK test description')
});

test('delete article', async ({ page, request }) => {
	const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
		data: { user: { "email": "svet@test.com", "password": "12345678" } }
	})
	const responseBody = await response.json()
	const accessToken = responseBody.user.token

	const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
		data: { "article": { "title": "This is a test article", "description": "This is s test description", "body": "This is s test body", "tagList": [] } },
		headers: {
			Authorization: `Token ${accessToken}`
		}
	})
	expect(articleResponse.status()).toEqual(201)

	await page.getByText('Global Feed').click()
	await page.getByText('This is a test article').click()
	await page.getByRole('button', { name: 'Delete Article' }).first().click()
	await page.getByText('Global Feed').click()

	await expect(page.locator('app-article-list h1').first()).not.toContainText('This is a test article')
})

test('create article', async ({ page, request }) => {
	await page.getByText('New Article').click()
	await page.getByPlaceholder('Article Title').fill('Playwright is awesome')
	await page.getByPlaceholder('What\'s this article about?').fill('UI test automation')
	await page.getByPlaceholder('Write your article (in markdown)').fill('End to end test automation have never been easier')
	await page.getByRole('button', { name: 'Publish Article' }).click()

	const articleResponse = (await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/'))
	const articleResponseBody = await articleResponse.json()
	const slugId = await articleResponseBody.article.slug

	await expect(page.locator('.article-page h1')).toContainText('Playwright is awesome')

	await page.getByText('Home').click()
	await page.getByText('Global Feed').click()

	await expect(page.locator('app-article-list h1').first()).toContainText('Playwright is awesome')

	const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
		data: { user: { "email": "svet@test.com", "password": "12345678" } }
	})
	const responseBody = await response.json()
	const accessToken = responseBody.user.token

	const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
		headers: {
			Authorization: `Token ${accessToken}`
		}
	})

	expect(deleteArticleResponse.status()).toEqual(204)
})
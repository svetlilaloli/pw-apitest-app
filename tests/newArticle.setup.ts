import { test as setup, expect } from '@playwright/test';

setup('create new article', async ({ request }) => {
    const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
        data: {
            "article": {
                "title": "Likes test article",
                "description": "This is s test description",
                "body": "This is s test body",
                "tagList": []
            }
        },
    })
    expect(articleResponse.status()).toEqual(201)
    const articleResponseBody = await articleResponse.json()
	const slugId = await articleResponseBody.article.slug
    process.env['SLUGID'] = slugId
})
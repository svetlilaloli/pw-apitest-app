import { test as setup } from '@playwright/test';
import user from '../.auth/user.json'
import fs from 'fs' // built-in file stream library

const authFile = '.auth/user.json'

setup('authentication', async ({ page, request }) => {
    // await page.goto('https://conduit.bondaracademy.com')
    // await page.getByText('Sign in').click()
    // await page.getByRole('textbox', { name: 'Email' }).fill('svet@test.com')
    // await page.getByRole('textbox', { name: 'Password' }).fill('12345678')
    // await page.getByRole('button', { name: 'Sign in' }).click()
    // await page.waitForResponse('https://conduit-api.bondaracademy.com/api/tags') // to make sure the login has completed

    // await page.context().storageState({ path: authFile })

    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
		data: { user: { "email": "svet@test.com", "password": "12345678" } }
	})
	const responseBody = await response.json()
	const accessToken = responseBody.user.token
    user.origins[0].localStorage[0].value = accessToken // update user token
    fs.writeFileSync(authFile, JSON.stringify(user)) // and save it to the file
    process.env['ACCESS_TOKEN'] = accessToken // save as env variable
})
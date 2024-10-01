import { test as setup } from '@playwright/test';

const authFile = '.auth/user.json'

setup('authentication', async ({ page }) => {
    await page.goto('https://conduit.bondaracademy.com')
    await page.getByText('Sign in').click()
    await page.getByRole('textbox', { name: 'Email' }).fill('svet@test.com')
    await page.getByRole('textbox', { name: 'Password' }).fill('12345678')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await page.waitForResponse('https://conduit-api.bondaracademy.com/api/tags') // to make sure the login has completed

    await page.context().storageState({ path: authFile })
})
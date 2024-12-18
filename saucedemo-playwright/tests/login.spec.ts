import { test, expect } from '@playwright/test';
import { AppLogin } from '../src/app/page-objects/appLoginPage';
import { testData } from '../LoginData';
import LoginPage from '../src/app/page-objects/loginPage/loginPage';

test('login', async ({page}) => {
    
    await page.goto('https://www.saucedemo.com/');
    await expect(page).toHaveTitle('Swag Labs');
    const loginPage = new AppLogin(page);
    await loginPage.performLogin();
    
})

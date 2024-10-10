import {test, expect} from "@playwright/test"
import { timeout } from "rxjs-compat/operator/timeout";
test.beforeEach(async({page}, testInfo) => {
    await page.goto('http://uitestingplayground.com/ajax');
    await page.getByText('Button Triggering AJAX Request').click();
    testInfo.setTimeout(testInfo.timeout+2000)// it will add 2 seconds for every test in the test suite
   })
test('auto waiting', async ({page}) => {
    const successButton = page.locator('.bg-success');
    //await successButton.click();
    /* await successButton.waitFor({state: 'attached'});

    const text = await successButton.textContent();
    expect(text).toContain('Data loaded with AJAX get request.') */

    await expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout: 20000});
})
test('alternative waits', async ({page}) => {
    const successButton = page.locator('.bg-success');
    // ___wait for element
    //await page.waitForSelector('.bg-success');

    //___wait for particular response
    await page.waitForResponse('http://uitestingplayground.com/ajaxdata')
    const text = await successButton.allTextContents();
    expect(text).toContain('Data loaded with AJAX get request.')

    //__wait for network calls to be completed
    await page.waitForLoadState('networkidle')

})
test('timeouts', async ({page}) => {
    test.slow();
    const successButton = page.locator('.bg-success');
    await successButton.click();
   
})
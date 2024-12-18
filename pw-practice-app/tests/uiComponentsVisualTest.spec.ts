import {test, expect} from '@playwright/test'

test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/');
})
test.describe('Form Layout page @block', () => {
    
    test.beforeEach(async({page}) => {
        await page.getByText('Forms').click();
        await page.getByText('Form Layouts').click();
    })
    
    test('radio button', async({page}) => {

        const usingTheGridForm = page.locator('nb-card', {hasText: "Using the Grid"});
        // await usingTheGridForm.getByLabel('Option 1').check({force: true});
        
        await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).check({force: true});
        const radioButtonStatus = await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).isChecked();
        await expect(usingTheGridForm).toHaveScreenshot();

    })
 
})

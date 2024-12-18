import {test, expect} from '@playwright/test';
import { PageManager } from '../src/app/page-objects/pageManager';
import { faker} from '@faker-js/faker'


test.beforeEach(async({page}) => {
    await page.goto('/');
})

test('navigation to form page', async ({page}) => {
    const pm = new PageManager(page);
    
    await pm.navigateTo().formLayoutsPage();
    await pm.navigateTo().datePickerPage();
    await pm.navigateTo().smartTablePage();
    await pm.navigateTo().toastrPage();
    await pm.navigateTo().toolTipPage();
})
test('parameterized methods', async ({page}) => {
    const pm = new PageManager(page);
    const randomFullName = faker.person.fullName();
    const randomEmail = `${randomFullName.replace(' ', '.')}${faker.number.int(100)}@test.com`

    await pm.navigateTo().formLayoutsPage();
    await pm.onFormLayoutsPage().submitUsingGridFormWithCredentialsAndSelectOption(process.env.USERNAME, process.env.PASSWORD, 'Option 1');
    await page.screenshot({path:'screenshots/FormLayoutsPage.png'})
    const buffer = await page.screenshot();
    console.log(buffer.toString('base64'))
    await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true);
    await page.locator('nb-card', {hasText: "Inline Form"}).screenshot({path: 'screenshots/InlineForm.png'})
    await pm.navigateTo().datePickerPage();
    await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(5);

    await pm.onDatePickerPage().selectDatePickerWithRangeFromToday(5,10)

})



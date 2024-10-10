import {test, expect} from '@playwright/test';
import { PageManager } from '../src/app/page-objects/pageManager';


test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/');
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
    
    await pm.navigateTo().formLayoutsPage();
    await pm.onFormLayoutsPage().submitUsingGridFormWithCredentialsAndSelectOption('test@test.com', 'welcome1', 'Option 1');
    await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox('John Smith', 'john.smith@test.com', true);

    await pm.navigateTo().datePickerPage();
    await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(5);

    await pm.onDatePickerPage().selectDatePickerWithRangeFromToday(5,10)

})



import {test, expect} from '@playwright/test'

test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/');
})
test.describe('Form Layout page', () => {
    test.beforeEach(async({page}) => {
        await page.getByText('Forms').click();
        await page.getByText('Form Layouts').click()
    })
    test('input fields', async({page}) => {
        const usingTheGridEmailinput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"})
        await usingTheGridEmailinput.fill("test@test.com")
        await usingTheGridEmailinput.pressSequentially('autotest@test.com')
        await usingTheGridEmailinput.clear()
        await usingTheGridEmailinput.pressSequentially('autotest123@test.com', {delay: 100})

        //generic assertion
        const inputValue = await usingTheGridEmailinput.inputValue()
        expect(inputValue).toEqual('autotest123@test.com')
        //locator assertion
        await expect(usingTheGridEmailinput).toHaveValue('autotest123@test.com')

    })
    test('radio button', async({page}) => {
        const usingTheGridForm = page.locator('nb-card', {hasText: "Using the Grid"})
        await usingTheGridForm.getByLabel('Option 1').check({force: true});
        //await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).check({force: true})
        const radioButtonStatus = await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).isChecked()
        expect(radioButtonStatus).toBeTruthy()
        await expect(usingTheGridForm.getByLabel('Option 1')).toBeChecked()
        await usingTheGridForm.getByLabel('Option 2').check({force: true});
        expect(await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).isChecked()).toBeFalsy()
        expect(await usingTheGridForm.getByRole('radio', {name: 'Option 2'}).isChecked()).toBeTruthy()
    })
 
})
test('checkboxes', async({page}) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Toastr').click()
    //await page.getByRole('checkbox', {name: 'Hide on click'}).click({force: true})
    //await page.getByRole('checkbox', {name: 'Hide on click'}).check({force: true})
    await page.getByRole('checkbox', {name: 'Hide on click'}).uncheck({force: true})
    await page.getByRole('checkbox', {name: 'Prevent arising of duplicate toast'}).check({force: true})
    const allBoxes = await page.getByRole('checkbox')
    for(const box of await allBoxes.all()) {
        await box.check({force:true})
        expect(await box.isChecked()).toBeTruthy()
        await box.uncheck({force:true})
        expect(await box.isChecked()).toBeFalsy()
    }
})

test('dropdowns and lists', async({page}) => {
    const dropdownMenu = page.locator('ngx-header nb-select');
    await dropdownMenu.click();

    const optionList = page.getByRole('list').locator('nb-option');
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"]);
    await optionList.filter({hasText: "Cosmic"}).click();
    const header = page.locator('nb-layout-header');
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)');
    const colors = {
        "Light":  "rgb(255, 255, 255)",
        "Dark":    "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    }
    await dropdownMenu.click();
    for(const color in colors) {
        await optionList.filter({hasText: color}).click();
        await expect(header).toHaveCSS('background-color', colors[color]);
        if(color != "Corporate")
            await dropdownMenu.click();
    }
})
test('tooltips', async({page}) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Tooltip').click()  
    const tooltipCard = page.locator('nb-card', {hasText: "Tooltip Placements"})
    await tooltipCard.getByRole('button', {name: "Top"}).hover()
    page.getByRole('tooltip') // only if the role "tooltip" has been created for the element
    const tooltip = await page.locator('nb-tooltip').textContent()
    expect(tooltip).toEqual('This is a tooltip')
})
test('dialog boxes', async({page})=> {
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();
    
    page.on('dialog',  dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?');
        dialog.dismiss();
        })
    
    //since there are multiple trash icons in the table, chain the locators to the single one
    /* await page.getByRole('table').locator('tr', {hasText: "mdo@gmail.com"}).locator('.nb-trash').click()
    await expect(page.locator('tbody').first()).not.toHaveText('mdo@gmail.com')  */
    
    
    await page.locator('table tr', {hasText: "mdo@gmail.com"}).locator('.nb-trash').click()
    const rows = page.locator('tbody')
    for(const row of await rows.allTextContents()){
        expect(row).toContain('mdo@gmail.com') 
    }
})
test('web tables', async({page}) =>{
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();

    //(1) get the row by any text in this row
    const targetRow = page.getByRole('row', {name: 'twitter@outlook.com'});
	
	await targetRow.locator('.nb-edit').click();
    await page.locator('input-editor').getByPlaceholder('Age').clear();
	await page.locator('input-editor').getByPlaceholder('Age').fill('35');
	await page.locator('.nb-checkmark').click();

    //(2) get the role based on the role in the specific column
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click();
    const targetRowById = page.getByRole('row', {name: '11'}).filter({has: page.locator('td').nth(1).getByText('11')});
    // locate the element to edit the field
    await targetRowById.locator('.nb-edit').click();
    //find the element with the value to interact
    await page.locator('input-editor').getByPlaceholder('E-mail').clear();
	await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com');
	await page.locator('.nb-checkmark').click();
    //find the value in the column corresponding to the specific row and assert the action
    await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com'); 

    // (3) test filter of the table
    const ages = ["20", "38", "40", "200"]
    for(let age of ages) {
        await page.locator('input-filter').getByPlaceholder('Age').clear();
	    await page.locator('input-filter').getByPlaceholder('Age').fill(age);
    }

})
test('web tables: looping through the table', async({page}) =>{
    // (3) test filter of the table
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();
    const ages = ["20", "38", "40", "200"]
    for(let age of ages) {
        await page.locator('input-filter').getByPlaceholder('Age').clear();
	    await page.locator('input-filter').getByPlaceholder('Age').fill(age);
    
        await page.waitForTimeout(500); // to let Playwright wait for the changes in the column Age before assertion
        // get all the table rows and validate the value
        const ageRows = page.locator('tbody tr') // it will return all the rows corresponding to the selected age

        for(let row of await ageRows.all()) {
        // .all() will create an array of the elements; it uses Promises > use await with it
            const cellValue = await row.locator('td').last().textContent() // to get the last column value; .locator('td') is to locate the column
            //to validate the values in the resulted table
            if(age == "200"){
                expect(await page.getByRole('table').textContent()).toContain('No data found')

            } else{
                expect(cellValue).toEqual(age)
            }
        
        }
    } 
})
test('datepicker', async ({page}) => {
    await page.getByText('Forms').click();
    await page.getByText('Datepicker').click();
    const calendarInputField = page.getByPlaceholder('Form Picker');
    await calendarInputField.click();

    let date = new Date();
    date.setDate(date.getDate()-400); // this will get day of the current date and change the date you specify, +7 or +20 or +21
    const expectedDate = date.getDate().toString(); // convert the desired target date, e.g., in a day, in a week etc., to string
    const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'}); // it will set to American short version of a month, e.g. 'Sep'
    const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'}); // it will set to American long version of a month, e.g. September
    const expectedYear = date.getFullYear(); // to get the current year
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`; // format the date according to the expected, e.g. 'Jun 10, 2024

    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent(); // to get the text content on the calendar lefthand corner
    const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear} `;

    while(!calendarMonthAndYear.includes(expectedMonthAndYear)) {   //if calendarMonthAndYear doesn't have expectedMonthAndYear, it will trigger the action
        await page.locator('nb-calendar-pageable-navigation [data-name = "chevron-left"]').click(); // identify the element to click to turn the calendar
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent();
    }

    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click();
    await expect(calendarInputField).toHaveValue(dateToAssert);
})

test('sliders', async({page}) => {
    // (1) updating the attribute
    /* const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle');
    await tempGauge.evaluate( node => {
        node.setAttribute('cx', '232.630');
        node.setAttribute('cy', '232.630');
    })
    await tempGauge.click(); */

    //(2) mouse movement
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger');
    tempBox.scrollIntoViewIfNeeded();
    const box = await tempBox.boundingBox()
    const x = box.x + box.width/2
    const y = box.y + box.height/2

    await page.mouse.move(x,y) // setting the starting point for the mouse movement
    await page.mouse.down() //simulates click of the left button of the mouse to begin movement
    await page.mouse.move(x+100, y) // to move the mouse just horizontally
    await page.mouse.move(x+100, y+100) // to move the mouse vertically
    await page.mouse.up() // to release the mouse button
    await expect(tempBox).toContainText('30')
    
})
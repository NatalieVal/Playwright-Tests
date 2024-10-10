import {test, expect} from "@playwright/test"

test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/');
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click()
})
test('Locator Syntax rules', async({page}) => {
    //by Tag name
    page.locator('input')

    //by ID
    await page.locator('#inputEmail1').click()

    //by class value
    page.locator('.shape-rectangle')

    //by full class value
    page.locator('[class = input-full-width size-medium status-basic shape-rectangle nb-transition]')

    //by attribute
    page.locator('[placeholder="Email"]')

    //combination of the selectors:
    page.locator('input[placeholder="Email"][nbinput]') //important not to separate selectors with space

    //by Xpath (NOT RECOMMENDED):
    page.locator('//*[@id=inputEmail]')

    //by partial text match:
    page.locator(':text("Using")')

    // by exact text match:
    page.locator(':text-is("Using the Grid")')
})
test('User facing locators', async({page}) => {
    await page.getByRole('textbox', {name: "Email"}).first().click()
    await page.getByRole('button', {name: "Sign in"}).first().click()
    await page.getByLabel('Password').first().click()
    await page.getByPlaceholder('Jane Doe').click()
    await page.getByText('Modal & Overlays').click()
    await page.getByTestId('Sign in').click()
    await page.getByTitle('IoT Dashboard').click() // finds element by title attribute
})

test('Finding child locators', async({page}) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()
    await page.locator('nb-card').getByRole('button', {name: "Sign in"}).first().click()
    await page.locator('nb-card').nth(3).getByRole('button').click()
})

test('Finding parent elements', async({page}) => {
    await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: "Email"}).click()

    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).click()
    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: 'Sign in'}).getByRole('textbox', {name: "Email"}).click()
    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: "Email"}).click()
})
test('Reusing locators', async({page}) => {
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const emailField = basicForm.getByRole('textbox', {name: "Email"})

    await emailField.fill('test@test.com') 
    await basicForm.getByRole('textbox', {name: "Password"}).fill('Welcome123') 
    await basicForm.locator('nb-checkbox').click()
    await basicForm.getByRole('button').click()

    await expect(emailField).toHaveValue('test@test.com')
})
test('Extracting values', async({page}) =>{
    //single text value
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const buttonText = await basicForm.locator('button').textContent()
    expect(buttonText).toEqual('Submit')

    //all text values
    const allRadioButtonLabels = await page.locator('nb-radio').allTextContents()
    expect(allRadioButtonLabels).toContain('Option 1')

    //input value
    const emailField = basicForm.getByRole('textbox', {name: "Email"})
    await emailField.fill('test@test.com') 
    const emailValue = await emailField.inputValue()

    expect(emailValue).toEqual('test@test.com')

    //extracting attribute

    const placeholderValue = await emailField.getAttribute('placeholder')
    expect(placeholderValue).toEqual('Email')
})
test.only('Assertions', async({page}) => {
    //generic assertions
    const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button')
    const text = await basicFormButton.textContent()
    expect(text).toEqual("Submit")

    //locator assertions
    await expect(basicFormButton).toHaveText("Submit")

    //soft assertion
    await expect(basicFormButton).toHaveText("Submi")
    await basicFormButton.click()
})
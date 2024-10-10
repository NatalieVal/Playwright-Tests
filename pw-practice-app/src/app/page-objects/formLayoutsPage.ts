import { Page } from '@playwright/test'
import { HelperBase } from './HelperBase';

export class FormLayoutsPage extends HelperBase{

    constructor(page: Page) {
        super(page);
    }
    async submitUsingGridFormWithCredentialsAndSelectOption(email: string, password: string, optionText: string) {
        const usingTheGridForm = this.page.locator('nb-card', {hasText: "Using the Grid"})
        await usingTheGridForm.getByRole('textbox', {name: "Email"}).fill(email);
        await usingTheGridForm.getByRole('textbox', {name: "Password"}).fill(password);
        await usingTheGridForm.getByRole('radio', {name: optionText}).check({force: true});
        await usingTheGridForm.getByRole('button').click();
    }
    /**
     * this method will fill out the Inline form with user details
     * @param name - first and last name
     * @param email 
     * @param rememberMe - true of false if user session to be saved
     */
    async submitInlineFormWithNameEmailAndCheckbox(name: string, email:string, rememberMe: boolean) {
        const inlineForm = this.page.locator('nb-card', {hasText: "Inline Form"})
        await inlineForm.getByRole('textbox', {name: "Jane Doe"}).fill(name);
        await inlineForm.getByRole('textbox', {name: "Email"}).fill(email);
        if(rememberMe) {
            await inlineForm.getByRole('checkbox').check({force: true});
        }
        await inlineForm.getByRole('button').click();
    } 
}
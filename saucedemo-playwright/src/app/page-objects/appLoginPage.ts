import{Page, expect} from '@playwright/test';

export class AppLogin{

    readonly page: Page;
    
    constructor(page: Page){

        this.page = page; 

    }

    async performLogin(){
        const userNameField = this.page.getByRole('textbox', {name: "Username"});
        const userPasswordField =  this.page.getByRole('textbox', {name: "Password"});
        const loginButton =  this.page.getByRole('button', {name: 'Login'});
        
        await userNameField.clear()
        await userNameField.fill('standard_user');
        await userPasswordField.clear();
        await userPasswordField.fill('secret_sauce');
        await loginButton.click();
        await expect(this.page.locator('.title')).toHaveText('Products');
    }

}
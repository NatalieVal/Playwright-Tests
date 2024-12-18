import { Page } from '@playwright/test';

class LoginPageLocators{
    public page: Page;
    public txtBox_username: string;
    public txtBox_password: string;
    public btnLogin: string;
    public pageHeading: string;


    //Constructor
    // page represents the page object used for browser automation

    constructor(page: any){
        this.page = page;
        this.txtBox_username = `//input[@id='user-name']`;
        this.txtBox_password = `//input[@id = 'password']`;
        this.btnLogin = `//input[@id = 'login-button']`;
        this.pageHeading = `//span[@class='title']`;
    }

    async getElement(locator:string) {
        const element = await this.page.locator(locator)
        return element;
        
    }
   
}
export { LoginPageLocators};
    
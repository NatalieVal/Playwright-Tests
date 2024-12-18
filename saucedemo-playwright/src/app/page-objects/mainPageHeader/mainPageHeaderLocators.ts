import { Page, Locator } from '@playwright/test';

class MainPageHeaderLocators{
    public page: Page;
    public openMenuButton: string;
    public shoppingCartLink: string;
    public shoppingCartIcon: string;
    public aboutPageLink: string;
    public productOption: string;
    

    


    //Constructor
    // page represents the page object used for browser automation

    constructor(page: any){
        this.page = page;
        this.openMenuButton = `//button[@id = 'react-burger-menu-btn' and text() = 'Open Menu']`;
        this.aboutPageLink = `//a[@id = 'about_sidebar_link']`;
        this.shoppingCartLink = `//a[@class='shopping_cart_link']`;
        this.shoppingCartIcon = `//span[@class= 'shopping_cart_badge']`;
        this.productOption = `//span[contains(@class,'MuiTypography-buttonLabel') and text()='Sauce Mobile' and not(ancestor::div[contains(@class, 'MuiGrid-root')])]`;
        
    }

    async getElement(locator:string) {
        const element = await this.page.locator(locator)
        return element;
        
    }
    async getElements(locator: string): Promise<Locator[]> {
        return this.page.locator(locator).all();
    }
   
}
export { MainPageHeaderLocators};
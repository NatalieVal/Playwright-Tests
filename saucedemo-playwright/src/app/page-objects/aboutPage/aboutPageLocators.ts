import { Page, Locator } from '@playwright/test';

class AboutPageLocators{
    public page: Page;
    public aboutMessage: string;
    public cookieBanner: string;
    public cookieBanner_popup_closeBtn: string;
    public productsNav: string;
    public productsNavDropdown: string;
    public productOption: string;
    


    //Constructor
    // page represents the page object used for browser automation

    constructor(page: any){
        this.page = page;        
        this.aboutMessage = `//h1[@class='MuiTypography-root MuiTypography-h1 css-a5cuvg']`;
        this.cookieBanner = `//div[@aria-label='Cookie banner']`;
        this.cookieBanner_popup_closeBtn = `//div[@id = 'onetrust-close-btn-container']/button[@aria-label = 'Close']`;
        this.productsNav = `//div[contains(@class ,'MuiBox-root')]//span[contains(@class, 'MuiTypography-buttonLabelNav') and text() ='Products']`;
        this.productsNavDropdown = `//div[contains(@class , 'dropdown MuiBox-root')]//span[contains(@class, 'MuiTypography-label') and text() = 'Platform for Test']`;
        this.productOption = `//span[text()='{0}']/ancestor::a[not(preceding::div[contains(@class, 'MuiGrid-root')])]`;
    }

    async getElement(locator:string) {
        const element = await this.page.locator(locator)
        return element;
        
    }
    async getElements(locator: string): Promise<Locator[]> {
        return this.page.locator(locator).all();
    }
   
}
export { AboutPageLocators};
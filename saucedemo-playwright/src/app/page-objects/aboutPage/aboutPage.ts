import { Page, expect } from '@playwright/test';
import { AboutPageLocators } from './aboutPageLocators';
import { basePage } from '../base.page';

class AboutPage extends AboutPageLocators{
    // Constructor
    // page: represents the page object used for browser automation

    //declare object from other class
    public readonly base: basePage;
   
    constructor(page: Page){
        super(page);
        this.base = new basePage;
    }
    
    async validateAboutPage(): Promise<void> {
        console.log(`Checking About page`);
        
        const aboutMessageSelector = this.aboutMessage;
        await this.base.waitTillElementVisible(this.page, 10, aboutMessageSelector);
    }
    async closeCookieNotification(): Promise<void> {
        console.log("Close cookie banner on About page");
        if (
            await this.base.isElementVisible(
                await this.getElement(this.cookieBanner),
                10
            )
        ) {
            await (
                await this.getElement(this.cookieBanner_popup_closeBtn)
            ).click();
        }
    }
    async validateDropdownOnHoverOverProductsOnAboutPage(): Promise<void> {
        console.log('Validate dropdown appears when hovered over Products on About page');
        await this.base.hoverOverElement(
            await this.getElement(this.productsNav), "yes"
        );
        const isProductDropDownVisible = await this.base.isElementVisible(
            await this.getElement(this.productsNavDropdown),
            5
        );
        expect(isProductDropDownVisible).toBeTruthy;
    }
    async openProductOptionInNewTab(option: string) {
        const selector = `//span[contains(@class,'MuiTypography-root MuiTypography-label') and text()='Platform for Test']`;
        const element = await this.getElement(selector);
        await element.scrollIntoViewIfNeeded({timeout: 5000});
        await this.base.openLinkInNewTab(
            this.page,
            this.productOption.replace('{0}', option)
        );
    }
    async getTitleOfSubPage(): Promise<string> {
        const pageTitle = await this.base.getTitle(this.page);
        console.log(`The title is "${pageTitle}"`);
        return pageTitle;
    }
        
}
export default AboutPage;
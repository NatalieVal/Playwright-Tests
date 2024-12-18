import { Page } from '@playwright/test';
import { MainPageHeaderLocators } from './mainPageHeaderLocators';
import { basePage } from '../base.page';

class MainPageHeader extends MainPageHeaderLocators{
    // Constructor
    // page: represents the page object used for browser automation

    //declare object from other class
    public readonly base: basePage;
   
    constructor(page: Page){
        super(page);
        this.base = new basePage;
    }
    async openMenu() {
        console.log(`Opening menu on the left hand side`);
        const clickHamburgerMenu = await this.getElement(this.openMenuButton);
        await clickHamburgerMenu.click();
    }
    async goToAboutPage() {
        console.log(`Going to About page`);
        const aboutLink = await this.getElement(this.aboutPageLink);
        await aboutLink.click();
    }

    async openProductOptionInNewTab(option: string) {
        await this.base.openLinkInNewTab(
            this.page,
            this.productOption.replace('{0}', option)
        );
    }
        
    async goToShoppingCart() {
        console.log(`Going to the shopping cart`);
        const clickShoppingCart = await this.getElement(this.shoppingCartLink);
        await clickShoppingCart.click();
    }

    async getItemsCountOnShoppingCartIcon(): Promise<string> {
        await this.page.waitForSelector(this.shoppingCartIcon, {
            state: 'visible',
            timeout: 5000, // Adjust timeout as needed
        });
        const shoppingCart = await this.getElement(this.shoppingCartIcon);
        await this.base.waitForElementState(shoppingCart, "visible", 5);
        const numberOfItemsInCart = await this.base.getTextOfElement(shoppingCart);

        console.log(`captured ${numberOfItemsInCart} items in the shopping cart`);
        return numberOfItemsInCart; 
    }
    
    
}
export default MainPageHeader;
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
        // Wait for the shopping cart link to be visible
        await this.page.waitForSelector(this.shoppingCartLink, {
            state: 'visible',
            timeout: 2000, 
        });
    
        // Check if the shopping cart count badge is visible
        const isCountVisible = await this.isShoppingCartCountVisible();
    
        if (isCountVisible) {
            // If visible, fetch the count
            const shoppingCartCount = await this.getElement(this.shoppingCartIcon);
            const numberOfItemsInCart = await this.base.getTextOfElement(shoppingCartCount);
            console.log(`Captured ${numberOfItemsInCart} items in the shopping cart`);
            return numberOfItemsInCart;
        } 
    
        // Return '0' if the badge is not visible
        console.log('Shopping cart is empty');
        return '0'; 
    }
    
    async isShoppingCartCountVisible(): Promise<boolean> {
        console.log("Checking the shopping cart count visibility");
        const shoppingCartIconElement = await this.getElement(this.shoppingCartIcon);
    
        // Use base.isElementVisible to check if the element is visible
        const isVisible = await this.base.isElementVisible(shoppingCartIconElement, 5);
        return isVisible;
    }
    
}
export default MainPageHeader;
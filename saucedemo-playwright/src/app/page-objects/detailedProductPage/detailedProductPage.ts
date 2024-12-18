import { Page,expect } from '@playwright/test';
import { DetailedProductPageLocators } from './detailedProductPageLocators';
import { basePage } from '../base.page';

class DetailedProductPage extends DetailedProductPageLocators{
    // Constructor
    // page: represents the page object used for browser automation

    //declare object from other class
    public readonly base: basePage;
   
    constructor(page: Page){
        super(page);
        this.base = new basePage;
    }
    async getProductPageUrl() {

    }
    async getProductHeading(): Promise<string> {
        await this.page.waitForSelector(this.productHeading, { state: 'attached' });
        const headingElement = await this.getElement(this.productHeading);
    
        await this.base.waitForElementState(headingElement, "visible", 5);
        const headingText = await this.base.getTextOfElement(headingElement);
        console.log(`Heading text: ${headingText}`);
        
        return headingText;
    }
    async validateBackToProductButton() {
        console.log("Validate back to products button on the product details page")
        const isBackToProductButtonVisible = await this.base.isElementVisible(
            await this.getElement(this.backToProductButton),
            10
        );
        expect(isBackToProductButtonVisible).toBeTruthy();
    }
}
export default DetailedProductPage;
import { Page, Locator } from '@playwright/test';

class DetailedProductPageLocators{
    public page: Page;
    public productHeading: string;
    public addToCartButtonProductItemPage: string;
    public backToProductButton: string;

    //Constructor
    // page represents the page object used for browser automation

    constructor(page: any){
        this.page = page;
        this.productHeading = `//div[@class = 'inventory_details_desc_container']/div[contains(@class, 'large_size') and @data-test='inventory-item-name']`;
        this.addToCartButtonProductItemPage = `//div[contains(@class, 'inventory_details_price')]/following-sibling::button[@id="add-to-cart"]`;
        this.backToProductButton = `//button[@name = 'back-to-products']`
    }
    async getElement(locator: string){
        const element = await this.page.locator(locator);
        return element;
    }
}
export { DetailedProductPageLocators};
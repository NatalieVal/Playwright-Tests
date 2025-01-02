import { Page, Locator } from '@playwright/test';

class ShoppingCartPageLocators{
    public page: Page;
    public cartList: string;
    public cartItem: string;
    public productInCart: string;
    public removeProductButton: string;
    


    //Constructor
    // page represents the page object used for browser automation

    constructor(page: any){
        this.page = page;
        this.cartList = `//div[@class='cart_list']`;
        this.cartItem = `//div[@class = 'cart_item_label']//div[@data-test='inventory-item-name']`;
        this.productInCart = `//div[@class = 'cart_item']//div[@class = 'inventory_item_name' and text() = '{0}']`;
        this.removeProductButton = `//button[contains(@class, 'cart_button') and text() = 'Remove']`;
        
    }
    /* async getElement(locator:string) {
        if (!locator) {
            throw new Error("Selector is undefined");
        }
        return await this.page.locator(locator);
    } */
    
    async getElement(locator:string) {
        const element = await this.page.locator(locator)
        return element;
        
    }
    async getElements(locator: string): Promise<Locator[]> {
        return this.page.locator(locator).all();
    }
   
}
export { ShoppingCartPageLocators};
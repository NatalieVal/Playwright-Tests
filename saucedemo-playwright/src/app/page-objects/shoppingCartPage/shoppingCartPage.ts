import { Page } from '@playwright/test';
import { ShoppingCartPageLocators } from './shoppingCartPageLocators';
import { basePage } from '../base.page';

class ShoppingCartPage extends ShoppingCartPageLocators{
    // Constructor
    // page: represents the page object used for browser automation

    //declare object from other class
    public readonly base: basePage;
   
    constructor(page: Page){
        super(page);
        this.base = new basePage;
    }
    
    async getAllItemsInCart(): Promise<string[]> {
        const cart = await this.getElement(this.cartList);
        await this.base.waitForElementState(cart, "visible");
    
        const cartItems = await this.getElements(this.cartItem); // Ensure this gets all matching elements
        const options = await this.base.getTextOfElements(cartItems);
        return options;
    }

    async removeProductFromShoppingCart(){
        const removeButton = await this.getElement(this.removeProductButton);
        await this.base.waitForElementState(removeButton, "visible");
        await removeButton.first().click()

    }
}
export default ShoppingCartPage;
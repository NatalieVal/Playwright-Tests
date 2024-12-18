import { Page, Locator } from '@playwright/test';

class ProductsPageLocators{
    public page: Page;
    public inventoryList: string;
    public inventoryItem: string;
    public product: string;
    public productLink: string;
    public addToCartButtonProductsPage: string;
    public filterOption: string;


    //Constructor
    // page represents the page object used for browser automation

    constructor(page: any){
        this.page = page;
        this.inventoryList = `//div[@class='inventory_list']`;
        this.inventoryItem = `//div[@data-test='inventory-item-name']`;
        this.product = `//div[@data-test='inventory-item-name' and contains(text(), '{0}')]`;
        this.productLink = `//div[@class='inventory_item']//a[contains(@id, 'title_link')]`
        this.addToCartButtonProductsPage = `//div[@data-test='inventory-item-name' and text()='{0}']/ancestor::div[@class='inventory_item']//button[contains(@class, 'btn_inventory') and text() = "Add to cart"]`
        this.filterOption = `//select[@class = 'product_sort_container']`;
    }

    async getElement(locator:string) {
        const element = await this.page.locator(locator)
        return element;
        
    }
    async getElements(locator: string): Promise<Locator[]> {
        return this.page.locator(locator).all();
    }
   
}
export { ProductsPageLocators};
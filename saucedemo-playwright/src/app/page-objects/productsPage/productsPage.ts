import { Page } from '@playwright/test';
import { ProductsPageLocators } from './productsPageLocators';
import { basePage } from '../base.page';

class ProductsPage extends ProductsPageLocators{
    // Constructor
    // page: represents the page object used for browser automation

    //declare object from other class
    public readonly base: basePage;
   
    constructor(page: Page){
        super(page);
        this.base = new basePage;
    }
    /**
     * @description Method used to sort the products upon the chosen filter, e.g., name or price
     */
    async selectFilter(
        sortingOption:
        | `Name (A to Z)`
        | `Name (Z to A)`
        | `Price (low to high)`
        | `Price (high to low)`
    ) {
        console.log(`selecting filter ${sortingOption}`);
        await this.base.selectDropdownOption(
            await this.getElement(this.filterOption),
            sortingOption
        );
        }
    /**
     * @description Method captures list of products on the page
     * @returns the list of products
     */
    async getAllProducts(): Promise<string[]> {
    const inventory = await this.getElement(this.inventoryList);
    await this.base.waitForElementState(inventory, "visible");

    const inventoryItems = await this.getElements(this.inventoryItem); // Ensure this gets all matching elements
    const options = await this.base.getTextOfElements(inventoryItems);
    return options;
    }

    async validateProductsSortedCorrectly(
        sortingOption:
            | `Name (A to Z)`
            | `Name (Z to A)`
            | `Price (low to high)`
            | `Price (high to low)`
    ): Promise<boolean> {
        console.log(`Validating sorting ${sortingOption}`)
        const products = await this.getAllProducts();
    
        // Compare adjacent elements to check the sorting
        if (sortingOption === `Name (A to Z)`) {
            return products.every((value, index, array) => {
                return index === 0 || array[index - 1].localeCompare(value) <= 0;
            });
        } else if (sortingOption === `Name (Z to A)`) {
            return products.every((value, index, array) => {
                return index === 0 || array[index - 1].localeCompare(value) >= 0;
            });
        } else if (sortingOption === `Price (low to high)`) {
            // Extract prices and check if they are sorted in ascending order
            const prices = await Promise.all(products.map(product => this.extractPrice(product)));
            return prices.every((value, index, array) => {
                return index === 0 || array[index - 1] <= value;
            });
        } else if (sortingOption === `Price (high to low)`) {
            // Extract prices and check if they are sorted in descending order
            const prices = await Promise.all(products.map(product => this.extractPrice(product)));
            return prices.every((value, index, array) => {
                return index === 0 || array[index - 1] >= value;
            });
        }
    
        return false; 
    }

    // Helper function to extract price from a product string
    async extractPrice(product: string): Promise<number> {
        // Assuming the product string contains the price (e.g., "ProductName - $123.45")
        const match = product.match(/\$(\d+(\.\d+)?)/);
        return match ? parseFloat(match[1]) : 0;
    }
    
    
    /**
     * 
     * @returns the count of products on the page
     */
    async getNumberOfProductsOnPage(): Promise<string> {
        const inventory = await this.getElement(this.inventoryItem);
        
    
        const inventoryCount = await this.base.getElementCount(inventory);
        return inventoryCount.toString(); // Return the count as a string
    }
    /**
     * @description captures the name of the first project
     * @returns the name of the first product on the page
     */
    async getFirstProductName() {
        const productElement = await (await this.getElement(this.productLink)).first();
        const productName = await this.base.getTextOfElement(productElement); 
        console.log(`First product on the page: ${productName}`);
        return productName;
    }

    /**
     * @description The method selects first product on the page
     * @returns the product name
     */
    async clickOnFirstProduct() {
    // Get the first product element
    const productElement = await (await this.getElement(this.productLink)).first();

    const productName = await this.base.getTextOfElement(productElement); 

    console.log(`Clicking on product ${productName}`);
    await productElement.click();
    return productName;
    }

    /**
     * @description Method to select a particular product based on its name
     * @param productName Provide a product name to be selected
     * @returns product name
     */
    async selectProduct(productName: string) {
        console.log(`Clicking on ${productName}`);
        await (
            await this.getElement(this.product.replace('{0}', productName))
        ).click();
        return productName;
    }

    async addProductToCart(productName: string) {
        console.log(`Adding ${productName} into the shopping cart`)
        const addToCartButton = await this.getElement(
            this.addToCartButtonProductsPage.replace("{0}", productName)
        )
        await addToCartButton.click();
    }
    
}
export default ProductsPage;
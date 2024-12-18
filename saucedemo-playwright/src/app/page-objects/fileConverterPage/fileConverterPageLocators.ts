import { Page, Locator } from '@playwright/test';

class FileConverterPageLocators{
    public page: Page;
    public input_file: string;
    public convertToPDFButton: string;
    public successMessage: string;
    


    //Constructor
    // page represents the page object used for browser automation

    constructor(page: any){
        this.page = page;
        this.input_file = `//input[@type='file']`;      
        this.convertToPDFButton = `//button[@id = 'processTask']/span[text() = 'Convert to PDF']`;
        this.successMessage =`//h1[@class='title2' and contains(text(), 'has been converted to PDF')]`;
    }
    async getElement(locator:string) {
        const element = await this.page.locator(locator)
        return element;
        
    }
}
export { FileConverterPageLocators};
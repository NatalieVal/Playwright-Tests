import { Page, expect } from '@playwright/test';
import { FileConverterPageLocators } from './fileConverterPageLocators';
import { basePage } from '../base.page';

class FileConverterPage extends FileConverterPageLocators{
    // Constructor
    // page: represents the page object used for browser automation

    //declare object from other class
    public readonly base: basePage;
   
    constructor(page: Page){
        super(page);
        this.base = new basePage;
    }

    async uploadFileToConvert(filePath: string) {
        console.log(`Uploading file from ${filePath}`);
        await this.base.fileUpload(this.page, this.input_file, filePath);
    }
    async clickConvertToPDFButton(){
        await(await this.getElement(this.convertToPDFButton)).click();
    }
    async validateConversionSuccess() {
        console.log("Validate conversion success message")
        const isSuccessMessageVisible = await this.base.isElementVisible(
            await this.getElement(this.successMessage),
            10
        );
        expect(isSuccessMessageVisible).toBeTruthy();
    }
}
export default FileConverterPage;
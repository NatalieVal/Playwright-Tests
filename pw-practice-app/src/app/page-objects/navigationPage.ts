import { Locator, Page } from '@playwright/test'
import { HelperBase } from '../page-objects/helperBase';

export class NavigationPage extends HelperBase {


    constructor(page: Page){
        super(page);
        
    }
    async formLayoutsPage(){
        await this.selectGroupMenuItem('Forms');
        await this.page.getByText('Form Layouts').click();
        await this.waitForNumberOfSeconds(2)
    }
    async toastrPage(){
        await this.selectGroupMenuItem('Modal & Overlays');
        await this.page.getByText('Toastr').click();
    }
    async datePickerPage(){
        await this.selectGroupMenuItem('Forms');
        await this.page.getByText('Datepicker').click();
    }
    async smartTablePage() {
        await this.selectGroupMenuItem('Tables & Data');
        await this.page.getByText('Smart Table').click();
    }
    async toolTipPage(){
        await this.selectGroupMenuItem('Modal & Overlays');
        await this.page.getByText('Tooltip').click()
    }

    private async selectGroupMenuItem(groupItemTitle: string) {
        const groupMenuItem = this.page.getByTitle(groupItemTitle)
        const expandedState = await groupMenuItem.getAttribute('aria-expanded')
        if(expandedState == 'false'){
            await groupMenuItem.click()
        }
    }
}
import {Locator, Page } from '@playwright/test';
import { envVar} from "../../../environmentVar"

export class basePage{
    /**
     * @description Open URL with url as parameter
     * @param {string} urlName
     * @returns {Promise<void>} Promise that resolves when the operation is complete
     */
    async openUrl(urlName: string, page: Page): Promise<void> {
        await page.goto(urlName)
    }

    /**
     * @description To get Title
     * @param {Page} page
     * @returns {Promise<string>} Promise that resolves when the method returns string
     */
    async getTitle(page: Page): Promise<string>{
        let title ="";
        try {
            title = await page.title();
        } catch(e) {
            console.error(e)
        }
        return title;
    }

    /**
     * @description Get text of an element
     * @param {element} locator - element to get the text of 
     * @returns {Promise<string>} - a Promise that resolves when the operation is complet
     */
    async getTextOfElement(locator: Locator): Promise<string> {
        try {
            const text = await locator.innerText();
            console.log(`The text of element is ${text}`);
            return text.trim();
        } catch (error) {
            console.error(`Failed to get text of element: ${error.message}`);
            throw error; 
        }
    }

    /**
     * @description Get text of list of elements
     * @param elements - Elements to get the text of
     * @returns {Promise<string>}
     */
    async getTextOfElements(elements: Locator[]): Promise<string[]> {
        return Promise.all(elements.map(async (element) => await element.innerText()));
    }

    /**
     * @description Check if element is visible
     * @param {Locator} element - Element defined as page.locator('your-xpath') to wait until it's visible
     * @param {number} timeoutInSeconds - Optional param: max time to wait for visibility in seconds
     * @returns {Promise<boolean>} Promise that resolves to true if the element is visible within the specified timeout
     */
    async isElementVisible(
        element: Locator,
        timeoutInSeconds?:number
    ): Promise<boolean> {
        try {
            await element.waitFor({
                state: "visible",
                timeout: (timeoutInSeconds || 50) * 1000,
            
            });
            return true;
        } catch (e) {
            console.error(`Element: ${element} is not visible`);
            return false;
        }
    }
    /**
     * @description Waits until the element is visible
     * @param {number} sec 
     * @param {Locator} locator
     * @throws {Error} Throws error if the element is not visible within the given time
     */
    async waitTillElementVisible(page: Page, sec: number, selector: string) {
        try {
            await page.waitForSelector(selector, {
                state: "visible",
                timeout: sec * 1000,
            });
        } catch(error) {
            throw new Error(`Element with locator "${selector}" not able to find`)
        }
    }
    /**
     * @description Check for element state, e.g., visible, enable, clickable
     * @element Element to wait till it's visible
     * @desiredState : Element state to wait for ("attached", "detached", "visible", "hidden")
     * @timeoutInSec : an optional parameter with default value of 5 sec
     * @returns {Promise<void>} Promise that resolves when visibility is true
     */
    async waitForElementState(
        element: Locator,
        desiredState: "attached"| "detached" | "visible" | "hidden",
        timeoutInSec: number = 10
    ): Promise<void> {
        switch (desiredState) {
            case "visible":
                await element.waitFor({
                    state: "visible",
                    timeout: timeoutInSec * 1000,
                });
                break;
            case "attached":
                await element.waitFor({
                    state: "attached",
                    timeout: timeoutInSec * 1000,

                });
                break;
            case "detached":
                await element.waitFor({
                    state: "detached",
                    timeout: timeoutInSec * 1000,
                });
                break;
            case "hidden":
                await element.waitFor({
                    state: "hidden",
                });
                break;
            default:
                console.log(`Unsupported state: ${desiredState}`);
        }
    }
    /**
     * @description Hover over a specified element on the  page
     * @param element Element to hover over
     * @param scrollIntoView Optional parameter
     */
    async hoverOverElement(element: Locator, scrollIntoView?: "yes"|"no"){
        if(!element) {
            console.error("Element not found!");
            return;
        }
        if(scrollIntoView == "yes")
            await element.evaluate((element) => {
                element.scrollIntoView();
            })
        
        await element.hover({
            force:true,
            timeout: 2000,
            position: {x:0, y:0},
        });
        
    }
    
    
    /**
     * @description Mehtod is used to scroll to specific element
     * @param {Page}
     * @param {Locator} - pass the element
     */
    async scrollToElement(element: Locator){
        try{
            await element.scrollIntoViewIfNeeded()
        }catch(e){
            console.error(e)
        }
    }

    /**
     * @description Used to get the attribute text
     * @param {Page} page
     * @param {string} locator
     * @returns {Promise<boolean>}
     */
    async getAttribute(
        page: Page,
        locator: string,
        attribute: string
    ): Promise<any> {
        try{
            await page.waitForSelector(locator, {state: "visible", timeout: 15000});
        } catch { }
        const element = page.locator(locator).first();
        if(!element){
            throw new Error("Element not found");
        }
        const value = await element.getAttribute(attribute);
        console.error(`The attribute is ${attribute} and the value is ${value}`);
        return value;
    }

    /**
     * @description Used to switch to a specific tab
     * @param { Page } page
     * @param { tabIndex} number
     * @returns {Promise<Page>} Promise that resolves when the method returns the focused Page
     */
    async switchToTab(focusPage: Page, tabIndex: number): Promise<Page> {
        console.log("Switch to tab: " + tabIndex);
        const [multiWindow] = await Promise.all([focusPage.waitForEvent("popup")]);
        await multiWindow.waitForLoadState("domcontentloaded");
        const pages = multiWindow.context().pages();
        if(tabIndex>=0 && tabIndex < pages.length) {
            const tab: Page = pages[tabIndex];
            await tab.bringToFront();
            await tab.waitForLoadState("domcontentloaded");
            return tab;
        } else {
            throw new Error("Invalid tab index");
        }

    }
    /**
     * @description capture the URL of the new tab opened by clicking a link
     * @param page The page instance where the element is expected
     */
    async getUrlOfNewTab(page:Page): Promise<string> {
        const newTab = await this.switchToTab(page, 1);
        const url = await this.getCurrentUrl(newTab);
        await this.closeCurrentTab(newTab);
        return url;

    }
    /**
     * @description closes the current tab
     * @param tab The page instance of the current tab
     */
    async closeCurrentTab(tab: Page){
        await tab.close();
    }

    /**
     * @description Method to get current URL
     * @param {Page} page the page instance
     * @returns {Promise<string>} a promise that resolves when the method returns string
     */
async getCurrentUrl(page: Page): Promise<string>{
    let url = "";
    try {
        url = page.url();
    } catch(error){
        console.error(error)
    }
    return url;
}

    /**
     * @description returns the number of elements present with a given locator
     * @param element can contain multiple elements
     */
    async getElementCount(element: Locator): Promise<number> {
        return await element.count();
    }

    /**
     * @description Does a right click on the given element
     * @param element contains the element locator
     */
    async rightClickOnElement(element: Locator): Promise<void> {
        await element.click({ button: "right"});
    }

    /**
     * @description Fetches the link of the given element and then opens the link in new tab
     * @param page contains the page value
     * @param element contains the element locator
     */
    async openLinkInNewTab(page: Page, element: string): Promise<void> {
        const currentPageUrl = await this.getCurrentUrl(page);
        let linkHref: string = await this.getAttribute(page, element, "href");

        //Open a new tab using the current context
        const newPage = await page.context().newPage(); 
        linkHref = currentPageUrl.split(".com")[0] + ".com" + linkHref;
        console.log(linkHref);
        //open the link in the new tab
        await newPage.goto(linkHref)
    }
    /**
     * @description opens a duplicate tab
     * @param page contains the page value
     * @param currentUrl contains the current URL of the tab
     */
    async openDuplicateTab(page: Page, currentUrl: string) {
        // opens a new tab using the current context
        const newPage = await page.context().newPage(); 
        await newPage.goto(currentUrl);
    }

    /**
     * @description Used to check if a check box is checked or not
     * @param {Locator} element accepts the locator for which the checkbox has to be validated
     * @returns {Promise<Page>} A Promise that resolves when the method returns boolean value, true if checkbox is checked, else false
     */
    async isCheckBoxChecked(element: Locator): Promise<boolean> {
        const status = await element.isChecked();
        return status;
    }

    /**
     * @description method is used to upload the file
     * @param {Page} page
     * @param {Locator} element - accepts the locator for which the file has to be uploaded
     * @@param {string} filePath - the path of the file which you need to upload
     */

    async fileUpload(
        page: Page,
        locator: string,
        filePath: string
    ): Promise<void> {
        try {
            await page.locator(locator).setInputFiles([filePath]);
        } catch(error){
            console.error('Error occurred: ', error)
        }
    }
    /**
     * @descripiton select the dropdown value
     * @param locator
     * @param label contains the value of visible text from the dropdown
     */
    async selectDropdownOption(locator: Locator, label: string){
        await locator.selectOption({ label: label});
    }

    /**
     * @description Get selected dropdown option
     * @param page
     * @param selectElement  to get the selected option for
     */
    async extractSelectedDisplayedValue(selectElement: Locator){
        return await selectElement.evaluate(
            (sel: HTMLSelectElement) =>
                sel.options[sel.selectedIndex]?.textContent || ""
        );
    }

    /**
     * @description Checks if a button identified by the provided locator is disabled
     * @param page
     * @param buttonSelector The locator for the button element
     * @returns A promise resolving to a boolean: true if the button is disabled, otherwise false
     */

    async isButtonDisabled(buttonElement: Locator): Promise<boolean> {
        if(!buttonElement){
            console.error('Button not found!');
            return false;
        }
        const isDisabled = await buttonElement.evaluate((btn) =>
            btn.hasAttribute('disabled')
        ); 
    return isDisabled
    }

}
export default basePage;

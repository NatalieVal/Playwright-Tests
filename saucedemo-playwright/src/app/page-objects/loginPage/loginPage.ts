import { LoginPageLocators } from './loginPageLocators';
import { basePage } from '../base.page';
import { decrypt } from '../../../../passwordEncryption';
import dotenv from "dotenv";
dotenv.config();

class LoginPage extends LoginPageLocators{
    // Constructor
    // page: represents the page object used for browser automation

    //declare object from other class
    public readonly base: basePage;
    public secretKey: any;
    

    constructor(page: any){
        super(page);
        this.base = new basePage;
        this.secretKey = process.env.SECRETKEY;
    }

    async goToApplication(url:string){
        await this.base.openUrl(url, this.page);
    }
    /**
     * @description login with encrypted password
     * @param username 
     * @param password 
     * @param ivHex 
     */
    async loginToApplication(username: string, password: string, ivHex: string) {
        console.log(`Enter ${username} in username textbox`)
        await(await this.getElement(this.txtBox_username)).fill(username);
        

        const decryptedPassword = decrypt(password, this.secretKey, ivHex);
        console.log(`Password (decrypted) in password textbox`);
        await((await this.getElement(this.txtBox_password)).fill(decryptedPassword));
        console.log('decrypted password: ', decryptedPassword);

        console.log(`Clicking on Login button`);
        await(await this.getElement(this.btnLogin)).click();
    }
    /**
     * @description standard login without password encryption/decryption
     * @param username 
     * @param password 
     */
    async defaultLoginToApplication(username: string, password: string) {
        console.log(`Enter ${username} in username textbox`)
        await(await this.getElement(this.txtBox_username)).fill(username);
        
        await((await this.getElement(this.txtBox_password)).fill(password));

        console.log(`Clicking on Login button`);
        await(await this.getElement(this.btnLogin)).click();
    }
    async getPageHeading(): Promise<string> {
        const pageHeading = await this.getElement(this.pageHeading);
        const text = await this.base.getTextOfElement(pageHeading);
        console.log(`The heading retrieved is: "${text}"`);
        return text;
    }
    //returns page title e.g. element <title>Swag Labs</title>
    async getLoginPageTitle(): Promise<string> {
        const pageTitle = await this.base.getTitle(this.page);
        console.log(`The title is "${pageTitle}"`);
        return pageTitle;
    }
}
export default LoginPage;
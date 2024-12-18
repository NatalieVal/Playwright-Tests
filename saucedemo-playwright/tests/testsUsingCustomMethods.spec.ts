import {test, expect} from '@playwright/test'
import basePage from '../src/app/page-objects/base.page';
import LoginPage from '../src/app/page-objects/loginPage/loginPage';
import { testData } from '../LoginData';
import * as crypto from "crypto";
import {encryptPassword} from '../passwordEncryption';
import ProductsPage from '../src/app/page-objects/productsPage/productsPage';
import DetailedProductPage from '../src/app/page-objects/detailedProductPage/detailedProductPage';
import MainPageHeader from '../src/app/page-objects/mainPageHeader/mainPageHeader';
import AboutPage from '../src/app/page-objects/aboutPage/aboutPage';
import FileConverterPage from '../src/app/page-objects/fileConverterPage/fileConverterPage';

test.describe('Login suite', () => {

  test('Generate secret key using crypto in Playwright @secretKey', async ({ page }) => {
    // Generate a random 32-byte secret key
    const secretKey = crypto.randomBytes(32).toString("hex");
    const ivHex = crypto.randomBytes(16).toString("hex")

    console.log("Generated SECRETKEY (Base64):", secretKey);
    console.log("generated ivhex: ", ivHex);
  });

  test('encrypt password', async ({page}) => {
    const secretKey = process.env.SECRETKEY;
    if (!secretKey) {
      throw new Error("SECRETKEY is not set in the environment variables");
      }
    const encryptedPassword = encryptPassword('secret_sauce',secretKey, '91cc5521df44bbf1f3f4928e586b3495');
    console.log(encryptedPassword);

  });

  test('login with encrypted & decrypted test data', async ({page})=> {
      const login_username = testData.standardUserloginWithPWDecryption.username;
      const login_password = testData.standardUserloginWithPWDecryption.password;
      const login_ivHex = testData.standardUserloginWithPWDecryption.ivHex;

      const login = new LoginPage(page);
      await login.goToApplication('https://www.saucedemo.com/');
      await login.loginToApplication(login_username, login_password, login_ivHex);
      const heading = await login.getPageHeading();
      expect(heading).toEqual('Products');
      const pageTitle = await login.getLoginPageTitle();
      expect(pageTitle).toEqual('Swag Labs');
      
  })

})
test.describe('Product page suite', () => {
  test.beforeEach(async({page})=> {
    const login_username = testData.standardUserlogin.username;
    const login_password = testData.standardUserlogin.password;
    const login = new LoginPage(page);
    await login.goToApplication('https://www.saucedemo.com/');
    await login.defaultLoginToApplication(login_username, login_password);
  })

  test('Validate page title', async ({page}) => {
    
    const login = new LoginPage(page);
    const pageTitle = await login.getLoginPageTitle();
    expect(pageTitle).toEqual('Swag Labs');
  
  })
  
  test('Get the list of products on the page', async ({page}) => {
    
    const login = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const expectedListOfProducts = [
      "Sauce Labs Backpack",
      "Sauce Labs Bike Light",
      "Sauce Labs Bolt T-Shirt",
      "Sauce Labs Fleece Jacket",
      "Sauce Labs Onesie",
      "Test.allTheThings() T-Shirt (Red)",
    ]
    
    const listOfProducts = await productsPage.getAllProducts();
    console.log('List of Products:', listOfProducts);
    expect(listOfProducts).toEqual(expectedListOfProducts);
    
  })
  test('Access product page and sort the products', async ({page}) => {
   
    const productsPage = new ProductsPage(page);
    const listOfProducts = await productsPage.getAllProducts();

    console.log('List of Products:', listOfProducts);
    await productsPage.selectFilter('Name (Z to A)');
    let firstProduct = await productsPage.getFirstProductName();
    expect(firstProduct).toEqual('Test.allTheThings() T-Shirt (Red)');
    await productsPage.selectFilter('Name (A to Z)');
    firstProduct = await productsPage.getFirstProductName();
    expect(firstProduct).toEqual('Sauce Labs Backpack');
    await productsPage.selectFilter('Price (low to high)');
    firstProduct = await productsPage.getFirstProductName();
    expect(firstProduct).toEqual('Sauce Labs Onesie');
    await productsPage.selectFilter('Price (high to low)');
    firstProduct = await productsPage.getFirstProductName();
    expect(firstProduct).toEqual('Sauce Labs Fleece Jacket');
    
                                     
  })
  test("Validate products sorted correctly", async ({page}) => {
  
    const productsPage = new ProductsPage(page);
    const listOfProducts = await productsPage.getAllProducts();
    console.log('List of Products:', listOfProducts);
    await productsPage.selectFilter('Name (Z to A)');
    let isSorted = await productsPage.validateProductsSortedCorrectly('Name (Z to A)');
    expect(isSorted).toBeTruthy();
    await productsPage.selectFilter('Name (A to Z)');
    isSorted = await productsPage.validateProductsSortedCorrectly("Name (A to Z)");
    expect(isSorted).toBeTruthy();
    await productsPage.selectFilter('Price (high to low)');
    isSorted = await productsPage.validateProductsSortedCorrectly('Price (high to low)');
    expect(isSorted).toBeTruthy();
    await productsPage.selectFilter('Price (low to high)');
    isSorted = await productsPage.validateProductsSortedCorrectly('Price (low to high)');
    expect(isSorted).toBeTruthy();
        
  });
  test('Access product page and select the first product', async ({page}) => {
    
    const productsPage = new ProductsPage(page);
    const detailedProductPage = new DetailedProductPage(page);
    const numberOfProducts = await productsPage.getNumberOfProductsOnPage();
    console.log(`Number of products available: ${numberOfProducts}`);
  
    const clickedProductName = await productsPage.clickOnFirstProduct();
    const productHeading = await detailedProductPage.getProductHeading();
    console.log(`selected product is ${productHeading}`);
    await detailedProductPage.validateBackToProductButton();
    expect(productHeading).toEqual(clickedProductName);
    const detailedProductPageUrl = page.url();
    const expectedProductPageURL = "https://www.saucedemo.com/inventory-item.html"
    expect(detailedProductPageUrl).toContain(expectedProductPageURL);                                 
  })
  test('Select a particular product item', async ({page}) => {
    
    const productsPage = new ProductsPage(page);
    const detailedProductPage = new DetailedProductPage(page);
     
    const clickedProductName = await productsPage.selectProduct('Sauce Labs Bike Light');
    const productHeading = await detailedProductPage.getProductHeading();
    console.log(`selected product is ${productHeading}`);
    expect(productHeading).toEqual(clickedProductName);
    const detailedProductPageUrl = page.url();
    const expectedProductPageURL = "https://www.saucedemo.com/inventory-item.html"
    expect(detailedProductPageUrl).toContain(expectedProductPageURL); 
  })
  test.only('Add a particular product item to the shopping cart', async ({page}) => {
   
    const productsPage = new ProductsPage(page);
    await productsPage.addProductToCart('Sauce Labs Backpack');
    
    const shoppingCartIcon = new MainPageHeader(page);
    await shoppingCartIcon.goToShoppingCart();
    //create shopping cart page and page locators to validate the added product
    await page.pause();
    
  })
  
  test('Check the number of items in the shopping cart', async ({page}) => {
   
    const productsPage = new ProductsPage(page);
    await productsPage.addProductToCart('Sauce Labs Backpack');

    const mainPageHeader = new MainPageHeader(page);
    let numberOfItemsInCart = await mainPageHeader.getItemsCountOnShoppingCartIcon();
    expect(numberOfItemsInCart).toEqual('1');
    await productsPage.addProductToCart('Sauce Labs Bike Light');
    numberOfItemsInCart = await mainPageHeader.getItemsCountOnShoppingCartIcon();
    expect(numberOfItemsInCart).toEqual('2');
  
  })
})
test.describe('About Page', () => {
  test('Go to About page', async ({page})=> {
    const login_username = testData.standardUserlogin.username;
    const login_password = testData.standardUserlogin.password;
    const login = new LoginPage(page);
    const mainPageHeader = new MainPageHeader(page);
    const aboutPage = new AboutPage(page);
    await login.goToApplication('https://www.saucedemo.com/');
    await login.defaultLoginToApplication(login_username, login_password);
  
    await mainPageHeader.openMenu();
    await mainPageHeader.goToAboutPage();
  
    await aboutPage.closeCookieNotification();
    await aboutPage.validateAboutPage();
    await aboutPage.validateDropdownOnHoverOverProductsOnAboutPage();
    await aboutPage.openProductOptionInNewTab('Sauce Cross-Browser');
    const currentPageTitle = await aboutPage.getTitleOfSubPage();
    expect(currentPageTitle).toContain('Cross Browser');
  
  })
})
test('File Upload', async ({page}) => {
  let filePath = 'resources/PageObjectModel.pptx';
  const { chromium } = require('playwright-extra');
  const stealth = require('puppeteer-extra-plugin-stealth');
  chromium.use(stealth());
  const browser = await chromium.launch();
  const login = new LoginPage(page);
  await login.goToApplication('https://www.ilovepdf.com/powerpoint_to_pdf');
  const fileConverterPage = new FileConverterPage(page);
  await fileConverterPage.uploadFileToConvert(filePath);
  await fileConverterPage.clickConvertToPDFButton();
  await fileConverterPage.validateConversionSuccess();
  
})
import { defineConfig, devices } from '@playwright/test';
import { TestOptions } from './test-options';


// import dotenv from 'dotenv';
// dotenv.config({ path: path.resolve(__dirname, '.env') });
require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<TestOptions>({
  timeout: 40000,
  retries: 0,
  expect: {
    timeout: 2000,
    toMatchSnapshot: {maxDiffPixels:150}
  },
  
  reporter: [
    ['json', {outputFile: 'test-results/jsonReport.json'}],
    ['junit', {outputFile: 'test-results/junitReport.xml'}],
    // ['allure-playwright']
    ['html']
  ],

  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:4200/',
    globalsQaUrl: 'https://www.globalsqa.com/demo-site/draganddrop/',

    
  },

  /* Configure projects for major browsers */
  projects: [

    {
      name: 'chromium',
          
    },
    {
      name: 'mobile',
      testMatch: 'testMobile.spec.ts',
      use: {
        // ...devices['iPhone 12 Pro']
        viewport: { width: 414, height: 800}
      }

    }
    
  ]  
  
});

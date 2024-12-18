import { defineConfig, devices } from '@playwright/test';
import { TestOptions } from './test-options';


// import dotenv from 'dotenv';
// dotenv.config({ path: path.resolve(__dirname, '.env') });
require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<TestOptions>({
  //timeout: 10000,
  globalTimeout: 60000,
  
  
  /* Retry on CI only */
  retries: 1,
  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:4200/',
    globalsQaUrl: 'https://www.globalsqa.com/demo-site/draganddrop/',
    /* baseURL: process.env.DEV === '1' ? 'http://localhost:4200/'
            : process.env.STAGING === '1' ? 'http://localhost:4201/'
            : 'http://localhost:4200/',
 */
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    actionTimeout: 20000,
    navigationTimeout: 20000,
    video: {
      mode: 'off',
      size: {width: 1920, height: 1080}
    }

  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'dev',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4200/',
       },
    },

    {
      name: 'chromium',
      timeout: 50000,
      use: {
        baseURL: 'http://localhost:4200/', 
        video: {
          mode: 'off',
          size: {width: 1920, height: 1080}
        }
      }
      
    },
    {
      name: 'pageObjectFullScreen',
      testMatch: 'usePageObjects_refactored.spec.ts',
      use: {
        viewport: {width: 1920, height: 1080}
      }

    },

    {
      name: 'firefox',
      use: { 
        browserName: 'firefox' 
      },
    },

  ]  
  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

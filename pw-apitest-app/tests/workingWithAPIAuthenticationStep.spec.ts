import { test, expect, request } from '@playwright/test';

import tags from '../test-data/tags.json'

test.beforeEach(async ({ page }) => {
  
  await page.route("\*\/\*\*\/api/tags", async route => {
    
    await route.fulfill({
      body: JSON.stringify(tags),
      
    });
    
  });

  await page.goto('https://conduit.bondaracademy.com');
  await page.getByText(' Sign in ').click();
  await page.getByRole('textbox', {name: 'Email'}).fill('testbunny@test.com');
  await page.getByRole('textbox', {name: 'Password'}).fill('test&bunny');
  await page.getByRole('button').click();
  
});

test('has title', async ({ page }) => {
  await page.route('*/**/api/articles*', async route => {
    const response = await route.fetch();
    const responseBody = await response.json();
    responseBody.articles[0].title = 'This is a MOCK test title';
    responseBody.articles[0].description = 'This is a MOCK description';

    await route.fulfill({
      body: JSON.stringify(responseBody)
    })
  })
  await page.getByText(' Global Feed ').click();
  await expect(page.locator('.navbar-brand')).toHaveText('conduit');
  await expect(page.locator('app-article-list h1').first()).toContainText('This is a MOCK test title');
  await expect(page.locator('app-article-list p').first()).toContainText('This is a MOCK description');
});
test('deleting an article', async({page, request}) => {
  const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: {
      user:{email: "testbunny@test.com", password: "test&bunny"}}
  })
  const responseBody = await response.json()
  const accessToken = responseBody.user.token
  const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles?', {
    data: {
      article:{title: "my first article", description: "about something", body: "this is my first article", tagList: []}
    },
    headers: {
      Authorization: `Token ${accessToken}`
    }
  })
  expect(articleResponse.status()).toEqual(201);

  await page.getByText(' Global Feed ').click();
  await page.getByText('my first article').click();
  await page.getByRole('button', {name: ' Delete Article '}).first().click();
  await expect(page.locator('app-article-list h1').first()).not.toContainText('my first article');
})
test('create article using UI and delete it using API', async ({page, request}) => {
await page.getByText(' New Article ').click();
await page.getByRole('textbox', {name: 'Article Title'}).fill('Playwright is awersome');
await page.getByRole('textbox', {name: `What's this article about?`}).fill('About the Playwright');
await page.getByRole('textbox', {name: `Write your article (in markdown)`}).fill('we like to use Playwright for automation');
await page.getByRole('button', {name: ' Publish Article '}).click();

const articleResponse = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/');
const articleResponseBody = await articleResponse.json();
const slugId = await articleResponseBody.article.slug;

await expect(page.locator('.article-page h1')).toContainText('Playwright is awersome');
await page.getByText(' Home ').click();
await page.getByText(' Global Feed ').click();
await expect(page.locator('app-article-list h1').first()).toContainText('Playwright is awersome');

const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
  data: {
    user:{email: "testbunny@test.com", password: "test&bunny"}}
})
const responseBody = await response.json();
const accessToken = responseBody.user.token;
const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
  headers: {
    Authorization: `Token ${accessToken}`
  }

})
expect(deleteArticleResponse.status()).toEqual(204);
})
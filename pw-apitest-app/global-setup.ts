import { request, expect } from "@playwright/test";
import user from '../pw-apitest-app/.auth/user.json';
import fs from 'fs';

async function globalSetup(){
    const authFile = '.auth/user.json'

    const context = await request.newContext()
    const responseToken = await context.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {
          user:{email: "testbunny@test.com", password: "test&bunny"}}
      })
      const responseBody = await responseToken.json();
      const accessToken = responseBody.user.token;
      user.origins[0].localStorage[0].value = accessToken;
      // updating the file with the new token, writing it to the authFile (first argument) and passing the user object (second argument)
      fs.writeFileSync(authFile, JSON.stringify(user)) ;
      
      // providing the name of the variable in ['']
      process.env['ACCESS_TOKEN'] = accessToken;
    const articleResponse = await context.post('https://conduit-api.bondaracademy.com/api/articles?', {
        data: {
          article:{title: "Global likes test article", description: "about something", body: "this is my first article", tagList: []}
        },
        headers: {
            Authorization: `Token ${process.env.ACCESS_TOKEN}`
        }
      })
      expect(articleResponse.status()).toEqual(201);
      const response = await articleResponse.json();
      const slugId = response.article.slug;
      process.env['SLUGID'] = slugId;
}
export default globalSetup;
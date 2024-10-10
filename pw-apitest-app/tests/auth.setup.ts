import { test as setup } from '@playwright/test';
import user from '../.auth/user.json';
import fs from 'fs';

// the name of the file could be anything
const authFile = '.auth/user.json'

setup('authentication', async({page, request}) => {

    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {
          user:{email: "testbunny@test.com", password: "test&bunny"}}
      })
      const responseBody = await response.json();
      const accessToken = responseBody.user.token;
      user.origins[0].localStorage[0].value = accessToken;
      // updating the file with the new token, writing it to the authFile (first argument) and passing the user object (second argument)
      fs.writeFileSync(authFile, JSON.stringify(user)) ;
      
      // providing the name of the variable in ['']
      process.env['ACCESS_TOKEN'] = accessToken;
})
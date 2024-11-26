# github-email-fetcher
//Script to fetch Gmail addresses of GitHub users.
const axios = require('axios');
require('dotenv').config();
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const BASE_URL = 'https://api.github.com/users';
const HEADERS = {
  Authorization: `token ${GITHUB_TOKEN}`,
  'User-Agent': 'Node.js Script',
};
const fetchEmails = async () => {
  let emails = [];
  let page = 1;
  while (emails.length < 100) {
    try {
      const response = await axios.get(`${BASE_URL}?per_page=30&page=${page}`, { headers: HEADERS });
      const users = response.data;

      if (!users.length) break; 

      for (const user of users) {
        if (emails.length >= 100) break;

        try {
          const userResponse = await axios.get(user.url, { headers: HEADERS });
          const email = userResponse.data.email;

          
          if (email && email.endsWith('@gmail.com')) {
            emails.push(email);
            console.log(email);
          }
        } catch (userError) {
          console.error(`Error fetching user details: ${userError.message}`);
        }
      }
      page++;
    } catch (error) {
      console.error(`Error fetching users: ${error.message}`);
      break;
    }
  }
  console.log(`Total Gmail addresses fetched: ${emails.length}`);
};
fetchEmails();

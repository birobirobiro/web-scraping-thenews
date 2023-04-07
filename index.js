const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = process.env.PORT || 3000; // Use the port specified by Railway or default to 3000

app.get('/', async (req, res) => {
  try {
    // Initialize the browser
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] }); // Add '--no-sandbox' option for running in Railway

    const page = await browser.newPage();

    // Navigate to the desired URL
    await page.goto('https://thenewscc.com.br/category/tecnologia/');

    // Wait for the page to fully load
    await page.waitForSelector('#infinite-wrap');

    // Extract the desired data
    const data = await page.evaluate(() => {
      const titleElements = document.querySelectorAll('.entry-title > a');
      const articles = [];
      for (let i = 0; i < titleElements.length; i++) {
        const title = titleElements[i].innerText;
        const link = titleElements[i].href;
        articles.push({ title, link });
      }
      return articles;
    });

    // Send the data as response
    res.send(data);

    // Close the browser
    await browser.close();
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error.');
  }
});

app.listen(port, () => {
  console.log(`Express server is running on port ${port}`);
});

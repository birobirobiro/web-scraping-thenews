const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 3000; // porta para o servidor Express

app.get('/', async (req, res) => {
  try {
    // Inicializar o navegador
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navegar para a URL desejada
    await page.goto('https://thenewscc.com.br/category/tecnologia/');

    // Aguardar a renderização completa da página
    await page.waitForSelector('#infinite-wrap');

    // Extrair os dados desejados
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

    // Enviar os dados como resposta
    res.send(data);

    // Fechar o navegador
    await browser.close();
  } catch (error) {
    console.error(error);
    res.status(500).send('Ocorreu um erro no servidor.');
  }
});

app.listen(port, () => {
  console.log(`Servidor Express em execução na porta ${port}`);
});

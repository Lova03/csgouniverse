const puppeteer = require('puppeteer');

const scrapePrice = async ({ url }) => {
  if (!url) return { success: false, msg: 'You need to specify an url' };
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);

  const bx = '/html/body/div[6]/div/div[6]/table/tbody/tr[2]/td[5]/div[1]/strong';
  await page.waitForXPath(bx);

  const bxHandle = await page.$x(bx);

  const price = await page
    .evaluate((el) => el.textContent, bxHandle[0])
    .catch(() => 'Failed to scrape price');

  await browser.close();

  return price;
};

module.exports = scrapePrice;

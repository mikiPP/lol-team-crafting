import { chromium } from 'playwright';

const CHAMPIONS_SELECTOR = '[data-testid=card-title]';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://www.leagueoflegends.com/en-us/champions/');
  const childElements = await page.locator(CHAMPIONS_SELECTOR).all();

  await Promise.all(
    childElements.map(async (element) => {
      const champName = await (await element.innerText()).toLocaleLowerCase();
      console.log(champName);
    }),
  );

  await browser.close();
})();

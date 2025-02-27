import { chromium } from 'playwright';

const ARCHETYPES_SELECTOR =
  '.article-table.sticky-header.sortable.jquery-tablesorter > tbody > tr > td:nth-child(2)';
const CHAMPIONS_SELECTOR =
  '.article-table.sticky-header.sortable.jquery-tablesorter > tbody > tr > td:nth-child(1)';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://leagueoflegends.fandom.com/wiki/List_of_champions');
  const archetypesElements = await page.locator(ARCHETYPES_SELECTOR).all();
  const champsElements = await page.locator(CHAMPIONS_SELECTOR).all();

  await Promise.all(
    archetypesElements.map(async (element, index) => {
      const archetype = (await element.innerText()).toLowerCase();
      const champion = (await champsElements[index].innerText()).toLowerCase();
      console.log(`${champion}-${archetype}`);
    }),
  );
  await browser.close();
})();

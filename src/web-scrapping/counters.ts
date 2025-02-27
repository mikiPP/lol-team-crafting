import { chromium, Page } from 'playwright';
import { archetypes, mobafire_best_guide_champ_url, scrappedChamps } from './scrappedResults';
import { Counter, getCounterType, getSynergyType, Synergy } from '../types/relationship';
import { Champion } from '../types/champion';
import { Archetype } from '../types/archetype';
import * as fs from 'fs';
import * as path from 'path';

const LINKS_SELECTOR = '.champ-list.champ-list--details > a';
const WEB_DOMAIN = 'https://www.mobafire.com';
const BEST_GUIDE_SELECTOR = '.mf-listings__divider:nth-of-type(1) + a';

const getChampGuidesLink = async (page: Page) => {
  await page.goto(`${WEB_DOMAIN}/league-of-legends/champion`);

  const acceptCookiesButton = page.locator('.cmptxt_btn_yes');
  await acceptCookiesButton.click();

  const sortByNameButton = page.locator('[for=st-name]');
  await sortByNameButton.click();

  const childElements = await page.locator(LINKS_SELECTOR).all();
  const links: string[] = [];

  await Promise.all(
    childElements.map(async (element) => {
      const link = await element.getAttribute('href');
      links.push(`${WEB_DOMAIN}${link}`);
    }),
  );

  return links;
};

const getBestGuide = async (page: Page) => {
  const links = await getChampGuidesLink(page);
  const bestGuides: string[] = [];

  for (const link of links) {
    try {
      await page.goto(link, { timeout: 60000 }); // Increase timeout to 60 seconds
      const bestGuideElement = page.locator(BEST_GUIDE_SELECTOR);
      const bestGuideLink = await bestGuideElement.getAttribute('href');
      bestGuides.push(`${WEB_DOMAIN}${bestGuideLink}`);
    } catch (error) {
      console.error(`Failed to load page: ${link}`, error);
      bestGuides.push('tba');
    }
  }
};

function createJsonFile(synergies: Synergy[], counters: Counter[], index: number) {
  const champName = scrappedChamps[index];
  const archetype = archetypes[index];

  const champ = new Champion({
    name: champName,
    archetype: archetype.split(',') as Archetype[],
    synergies,
    counters,
  });
  const champJson = champ.toString();
  const dirPath = path.join(__dirname, '../data'); // Adjust the path to src/data
  const filePath = path.join(dirPath, `${champName}.json`);

  fs.writeFileSync(filePath, champJson, 'utf8');
}

const getCountersAndSynergies = async (page: Page) => {
  const links = mobafire_best_guide_champ_url;

  for (let index = 0; index < links.length; index++) {
    const link = links[index];
    const counters: Counter[] = [];
    const synergies: Synergy[] = [];
    try {
      await page.goto(link, { timeout: 10000 }); // Increase timeout to 10 seconds
      const countersForThisChamp = await page.locator('.view-guide__tS__bot__left > .row').all();

      for (let counter of countersForThisChamp) {
        const innerText = await counter.innerText();
        const innerTextCleaned = innerText
          .split('\n')
          .map((text) => text.replace('\t', '').trim())
          .filter((text) => text.length);
        const [champName, counterLevel, description] = innerTextCleaned;
        const type = getCounterType(counterLevel);
        if (!type) {
          continue;
        }

        counters.push({
          type,
          champName: champName.toLowerCase(),
          description: description?.toLowerCase(),
        });
      }

      const synergiesForThisChamp = await page.locator('.view-guide__tS__bot__right > .row').all();

      for (let synergy of synergiesForThisChamp) {
        const innerText = await synergy.innerText();
        const innerTextCleaned = innerText
          .split('\n')
          .map((text) => text.replace('\t', '').trim())
          .filter((text) => text.length);
        const [champName, synergyLevel, description] = innerTextCleaned;

        const type = getSynergyType(synergyLevel);
        if (!type) {
          continue;
        }

        synergies.push({
          type,
          champName: champName.toLowerCase(),
          description: description?.toLowerCase(),
        });
      }
    } catch (error) {
      console.error(`Failed to load info:`, scrappedChamps[index], error);
    }

    createJsonFile(synergies, counters, index);
  }
};

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  await getCountersAndSynergies(page);

  await browser.close();
})();

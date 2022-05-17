import * as puppeteer from 'puppeteer';
import { Browser, Page } from 'puppeteer';
import { readFileSync } from 'fs';

/**
 * Creates and returns an instance of a puppeteer browser
 * @returns a puppeteer browser instance
 */
async function launchBrowser(): Promise<Browser> {
  const browser = puppeteer.launch();
  console.log('launched new browser instance');
  return browser;
}

async function launchPage(): Promise<Page> {
  const browser = await launchBrowser();
  return browser.newPage();
}

function getConfigurations(): { iterations: number; webpages: string[] } {
  const configFile = readFileSync('./src/config.json');
  const config = JSON.parse(configFile.toString());

  const webpagesFile = readFileSync('./src/webpages.json');
  const webpages = JSON.parse(webpagesFile.toString());

  return {
    iterations: config.iterations,
    webpages,
  };
}

async function app(): Promise<void> {
  const page = await launchPage();
  const { webpages, iterations } = getConfigurations();

  for (let i = 0; i < iterations; i++) {
    for (const url of webpages) {
      await page.goto(url, { waitUntil: 'load', timeout: 0 });
      await page.waitForTimeout(1000 * (Math.random() * 3 + 1));
      console.log(`navigated to ${url}`);
    }
  }
}

app();

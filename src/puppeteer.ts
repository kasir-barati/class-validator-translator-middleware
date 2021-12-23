import Puppeteer from 'puppeteer';

async function start() {
    const browser = await Puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://translate.google.com/');
    await page.screenshot({ path: 'amazing.png' });
    await browser.close();
}

start();

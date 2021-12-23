import Puppeteer from 'puppeteer';
import { join } from 'path';

function fakeAsync(millisecond: number) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, millisecond);
    });
}

async function start() {
    try {
        const browser = await Puppeteer.launch();
        const page = await browser.newPage();

        await page.goto('https://translate.google.com/');
        // Do not work
        /* const jqueryFilePath = join(
            __dirname,
            '..',
            'lib',
            'jquery-3.6.0.slim.min.js',
        );
        await page.addScriptTag({
            path: jqueryFilePath,
        }); */

        // Do not work
        /* await page.addScriptTag({
            url: 'https://code.jquery.com/jquery-3.2.1.min.js',
        }); */

        const cookieAcceptBtn = await page.$(
            'window.jQuery(\'button:contains("I agree")\')',
        );

        if (!cookieAcceptBtn) {
            throw new Error(
                'could not get the "I agree" button to accept the cookies',
            );
        }
        await cookieAcceptBtn.click();
        await fakeAsync(2000 + Math.random() * 832);
        await browser.close();
        await page.screenshot({ path: 'amazing.png' });
    } catch (error) {
        console.dir(error, { depth: null });
        process.exit(1);
    }
}

start();

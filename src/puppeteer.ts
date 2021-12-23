import Puppeteer from 'puppeteer';

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

        const cookieAcceptBtn = await page.$(
            'button[aria-label="Agree to the use of cookies and other data for the purposes described"]',
        );

        if (!cookieAcceptBtn) {
            throw new Error(
                'could not get the "I agree" button to accept the cookies',
            );
        }
        await cookieAcceptBtn.click();

        await page.evaluate(() => {
            let sourceContentDivs = document.querySelectorAll(
                'div[jsController="gWGePc"]',
            );

            for (const sourceContentDiv of sourceContentDivs) {
                sourceContentDiv.innerHTML = 'change to something';
            }
        });

        await page.waitForSelector('span[jsname="W297wb"]');
        const targetContent = await page.$('span[jsname="W297wb"]');
        const targetContentValue = await page.evaluate(
            (element) => element.textContent,
            targetContent,
        );
        console.log(targetContentValue);

        await fakeAsync(2000 + Math.random() * 832);
        await page.screenshot({ path: 'amazing.png' });
        await browser.close();
    } catch (error) {
        console.dir(error, { depth: null });
        process.exit(1);
    }
}

start();

import type { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer';

let _browser: Browser;
let _page: Page;

const start = async () => {
    // This starts a new puppeteer browser (Chrome)
    // and load the localhost page, this page will load the
    // javascript modules (see server.js for more info)
    _browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    _page = await _browser.newPage();
    // _page.on('console', msg => console.log(msg.text()));
    await _page.goto(`http://localhost:3000/`, {
        waitUntil: 'networkidle0',
    });
};

const stop = async () => {
    await _page.close();
    await _browser.close();
};

async function evaluate<T extends (...args: any[]) => any>(fn: T) {
    return await _page.evaluate(fn);
}

// eslint-disable-next-line @typescript-eslint/ban-types
const exposeFunction = async (name: string, fn: Function) => {
    return await _page.exposeFunction(name, fn);
};

export default {
    start,
    stop,
    evaluate,
    exposeFunction,
};

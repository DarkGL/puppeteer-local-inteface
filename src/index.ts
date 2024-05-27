import os from 'node:os';

import puppeteer from 'puppeteer';

const networkInterfaces = os.networkInterfaces();

const interfaceToUse = '';
let interfacesToSkip = '';

for (const [interfaceName, interfaces] of Object.entries(networkInterfaces)) {
    if (!interfaceName || !interfaces) {
        continue;
    }

    console.log(`Interface: ${interfaceName}`);

    for (const iface of interfaces) {
        console.log(`  Address: ${iface.address}`);
        console.log(`  Family: ${iface.family}`);
        console.log(`  Internal: ${iface.internal}`);
        console.log('---------------------');
    }

    if(interfaceName === interfaceToUse) {
        continue;
    }

    interfacesToSkip += `${interfaceName},`;
}

console.log('interfacesToSkip', interfacesToSkip);

async function test() {
    const browser = await puppeteer.launch({
        headless: true,
        args: [`--netifs-to-ignore=${interfacesToSkip}`]
    });
    const page = await browser.newPage();

    await page.goto('https://ipinfo.io/ip');

    // Set screen size
    await page.setViewport({width: 1080, height: 1024});

    const content = await page.content();

    console.log('content', content);

    await browser.close();
}

test();
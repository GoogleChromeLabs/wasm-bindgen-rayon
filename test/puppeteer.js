const puppeteer = require("puppeteer");

(async () => {
	const browser = await puppeteer.launch();

	await new Promise(async (resolve, reject) => {
		const page = await browser.newPage();
		page.on('console', message => {
			console.log(`${message.type()}: ${message.text()}`);
		});
		page.on('pageerror', reject);
		await page.goto('http://localhost:5000/test.html');
		await page.waitForFunction('window.DONE');
		resolve();
	});

	await browser.close();
})().catch(err => {
	setTimeout(() => {
		throw err;
	});
});

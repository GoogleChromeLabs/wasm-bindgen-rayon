const handler = require('serve-handler');
const http = require('http');
const puppeteer = require('puppeteer');

function randInRange(min, max) {
  return (min + Math.random() * (max - min + 1)) | 0;
}

(async () => {
  const server = http.createServer((request, response) => {
    return handler(request, response, {
      cleanUrls: false,
      headers: [
        {
          source: '**/*.{js,html}',
          headers: [
            { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
            { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' }
          ]
        }
      ]
    });
  });
  const port = randInRange(49152, 65535);
  process.stdout.write(`Starting server on port ${port}... `);
  await new Promise(resolve => server.listen(port, resolve));
  process.stdout.write(`done\n`);

  process.stdout.write(`Starting browser... `);
  const browser = await puppeteer.launch();
  process.stdout.write(`done\n`);

  async function runTest(name) {
    const url = `http://localhost:${port}/pkg/test.${name}.js/index.html`;
    const page = await browser.newPage();
    page.on('console', message => {
      console.log(`${name}: ${message.type()}: ${message.text()}`);
    });
    const errorPromise = new Promise((_, reject) => {
      page.on('pageerror', reject);
    });
    await page.goto(url);
    await Promise.race([page.waitForFunction('window.DONE'), errorPromise]);
    await page.close();
  }

  console.log('Running tests...');
  await Promise.allSettled(
    ['rollup', 'webpack'/*, 'parcel'*/].map(name =>
      runTest(name).catch(err => console.error(name, err))
    )
  );

  console.log('Shutting down...');
  await browser.close();
  server.unref();
})().catch(err => {
  setTimeout(() => {
    throw err;
  });
});

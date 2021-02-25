/**
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
  // We don't want to block the script on the server.
  server.unref();
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
  await Promise.all(
    ['rollup', 'webpack'/*, 'parcel'*/].map(name =>
      runTest(name).catch(err => console.error(name, err))
    )
  );

  console.log('Shutting down...');
  await browser.close();
})().catch(err => {
  setTimeout(() => {
    throw err;
  });
});

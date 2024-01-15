/*
 * Copyright 2022 Google Inc. All Rights Reserved.
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

import serveHandler from 'serve-handler';
import { createServer } from 'http';
import puppeteer from 'puppeteer';
import getPort from 'get-port';
import { promises as fs } from 'fs';

(async () => {
  async function logStep(description, promise) {
    process.stdout.write(`${description}…`);
    const result = await promise;
    process.stdout.write(' done.\n');
    return result;
  }

  async function startServer() {
    const config = JSON.parse(await fs.readFile('serve.json', 'utf-8'));

    return new Promise(resolve => {
      createServer((request, response) =>
        serveHandler(request, response, config)
      )
        .unref() // We don't want to block the script on the server.
        .listen(port, resolve);
    });
  }

  const port = await logStep('Getting available port', getPort());
  await logStep(`Starting server on port ${port}`, startServer());
  const browser = await logStep(`Starting browser`, puppeteer.launch());

  async function runTest(name, url = `/pkg/${name}/index.html`) {
    const page = await browser.newPage();
    page.on('console', message => {
      console.log(`${name}: ${message.type()}: ${message.text()}`);
    });
    const errorPromise = new Promise((_, reject) => {
      page.on('pageerror', reject);
    });
    await page.goto(`http://localhost:${port}${url}`);
    await Promise.race([page.waitForFunction('window.DONE'), errorPromise]);
    await page.close();
  }

  console.log('Running tests...');
  await Promise.all([
    runTest('no-bundler', '/index.html'),
    ...['rollup', 'webpack', 'parcel'].map(name =>
      runTest(name).catch(err => console.error(name, err))
    )
  ]);

  await logStep('Shutting down', browser.close());
})().catch(err => {
  setTimeout(() => {
    throw err;
  });
});

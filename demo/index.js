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

import * as Comlink from 'comlink';

const maxIterations = 1000;

const canvas = document.getElementById('canvas');
const { width, height } = canvas;
const ctx = canvas.getContext('2d');
const timeOutput = document.getElementById('time');
const threadInput = document.getElementById('thread-count');

(async function init() {
  // Create a separate thread from wasm-worker.js and get a proxy to its handlers.
  let handlers = await Comlink.wrap(
    new Worker(new URL('./wasm-worker.js', import.meta.url), {
      type: 'module'
    })
  ).handlers;

  function setupBtn(id) {
    // Handlers are named in the same way as buttons.
    let handler = handlers[id];
    // If handler doesn't exist, it's not supported.
    if (!handler) return;
    // Assign onclick handler + enable the button.
    Object.assign(document.getElementById(id), {
      async onclick() {
        let thisHandler = handler;
        let tmpWorker;

        // Super hacky, but create a new worker for multi-threaded version
        // so a particular number of threads can be initialized.
        if (id === 'multiThread') {
          tmpWorker = new Worker(new URL(`./wasm-worker.js`, import.meta.url), {
            type: 'module',
            // I'd rather pass this data in via the URL
            // but Webpack is making assumptions about the source that prevent that.
            name: `threads=${threadInput.value}`
          });
          thisHandler = (await Comlink.wrap(tmpWorker).handlers)[id];
        }

        let { rawImageData, time } = await thisHandler({
          width,
          height,
          maxIterations
        });
        timeOutput.value = `${time.toFixed(2)} ms`;
        const imgData = new ImageData(rawImageData, width, height);
        ctx.putImageData(imgData, 0, 0);
        if (tmpWorker) tmpWorker.terminate();
      },
      disabled: false
    });
  }

  setupBtn('singleThread');
  if (await handlers.supportsThreads) {
    setupBtn('multiThread');
    threadInput.value = navigator.hardwareConcurrency;
    threadInput.disabled = false;
  }
})();

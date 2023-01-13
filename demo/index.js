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

const maxIterations = 1000;

const canvas = document.getElementById('canvas');
const { width, height } = canvas;
const ctx = canvas.getContext('2d');
const timeOutput = document.getElementById('time');
const threadInput = document.getElementById('thread-count');


async function callInWorker(worker, action, args) {
  const channel = new MessageChannel();
  const reply = channel.port1;
  const result = new Promise((resolve) => {
    channel.port2.onmessage = (event) => {
      resolve(event.data);
      channel.port2.close();
    }
  });
  worker.postMessage({ action, args, reply }, [reply]);
  return result;
}

(async function init() {
  const worker = new Worker(new URL('./wasm-worker.js', import.meta.url), {
    type: 'module'
  });

  const handlerKeys = await callInWorker(worker, 'getKeys');

  function setupBtn(id) {
    // If handler doesn't exist, it's not supported.
    if (!handlerKeys.includes(id)) return;
    // Assign onclick handler + enable the button.
    Object.assign(document.getElementById(id), {
      async onclick() {
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
        }

        const { rawImageData, time } = await callInWorker(tmpWorker || worker, id, [{
          width,
          height,
          maxIterations
        }]);

        timeOutput.value = `${time.toFixed(2)} ms`;
        const imgData = new ImageData(rawImageData, width, height);
        ctx.putImageData(imgData, 0, 0);

        if (tmpWorker) {
          console.log('terminating worker');
          tmpWorker.terminate();
        }
      },
      disabled: false
    });
  }

  setupBtn('singleThread');
  if (await callInWorker(worker, 'supportsThreads')) {
    setupBtn('multiThread');
    threadInput.value = navigator.hardwareConcurrency;
    threadInput.disabled = false;
  }
})();

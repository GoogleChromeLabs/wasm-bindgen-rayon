/**
 * Copyright 2021 Google Inc. All Rights Reserved.
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

import { threads } from 'wasm-feature-detect';
import * as Comlink from 'comlink';

const maxIterations = 1000;

const canvas = document.getElementById('canvas');
const { width, height } = canvas;
const ctx = canvas.getContext('2d');
const timeOutput = document.getElementById('time');

// Create a separate thread from wasm-worker.js and get a proxy to its `generate` function.
const generate = Comlink.wrap(new Worker(new URL('./wasm-worker.js', import.meta.url), {
  type: 'module'
}));

const btnProps = {
  async onclick(event) {
    let { rawImageData, time } = await generate({
      type: event.target.id,
      width,
      height,
      maxIterations
    });
    timeOutput.value = `${time.toFixed(2)} ms`;
    const imgData = new ImageData(rawImageData, width, height);
    ctx.putImageData(imgData, 0, 0);
  },
  disabled: false
};

Object.assign(document.getElementById('singleThread'), btnProps);

threads().then(supportsThreads => {
  if (!supportsThreads) return;
  Object.assign(document.getElementById('multiThread'), btnProps);
});

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

import * as singleThread from './pkg/wasm_bindgen_rayon_demo.js';
import * as multiThread from './pkg-parallel/wasm_bindgen_rayon_demo.js';

const maxIterations = 1000;

const canvas = document.getElementById('canvas');
const { width, height } = canvas;
const ctx = canvas.getContext('2d');

const time = document.getElementById('time');

async function wrapGenerate(buttonId, asyncInit) {
  const generate = await asyncInit();
  const btn = document.getElementById(buttonId);

  btn.onclick = () => {
    const start = performance.now();
    const rawImageData = generate(width, height, maxIterations);
    const end = performance.now();
    time.value = `${(end - start).toFixed(2)} ms`;
    const imgData = new ImageData(rawImageData, width, height);
    ctx.putImageData(imgData, 0, 0);
  };

  btn.disabled = false;
}

wrapGenerate('singleThread', async () => {
  await singleThread.default();
  return singleThread.generate;
});

wrapGenerate('multiThread', async () => {
  await multiThread.default();
  await multiThread.initThreadPool(navigator.hardwareConcurrency);
  return multiThread.generate;
});

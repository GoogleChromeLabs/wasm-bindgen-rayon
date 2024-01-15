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

import init, { initThreadPool, sum } from './pkg/test.js';

async function runTest() {
  await init();
  await initThreadPool(navigator.hardwareConcurrency);
  // 1...10
  let arr = Int32Array.from({ length: 10 }, (_, i) => i + 1);
  if (sum(arr) !== 55) {
    throw new Error('Wrong result.');
  }
  console.log('OK');
}

runTest().then(postMessage);

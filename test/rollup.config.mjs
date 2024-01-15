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

import nodeResolve from '@rollup/plugin-node-resolve';
import offMainThread from '@surma/rollup-plugin-off-main-thread';
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';
import html from '@rollup/plugin-html';
import { readFileSync } from 'fs';

export default {
  input: './index.js',
  output: {
    dir: 'pkg/rollup',
    format: 'esm',
    exports: 'named',
    name: 'rollupTest'
  },
  plugins: [nodeResolve(), offMainThread(), importMetaAssets(), html({
    template: () => readFileSync('./index.html', 'utf-8')
  })]
};

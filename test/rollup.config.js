import nodeResolve from 'rollup-plugin-node-resolve';
import offMainThread from '@surma/rollup-plugin-off-main-thread';
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';
import html from '@rollup/plugin-html';

export default {
  input: './index.js',
  output: {
    dir: 'pkg/test.rollup.js',
    format: 'esm',
    exports: 'named',
    name: 'rollupTest'
  },
  plugins: [nodeResolve(), offMainThread(), importMetaAssets(), html({})]
};

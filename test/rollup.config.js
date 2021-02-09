import nodeResolve from 'rollup-plugin-node-resolve';
import offMainThread from '@surma/rollup-plugin-off-main-thread';
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';

export default {
  input: './index.js',
  output: {
    dir: 'pkg/test.rollup.js',
    format: 'amd',
    exports: 'named',
    name: 'rollupTest'
  },
  plugins: [nodeResolve(), offMainThread(), importMetaAssets()]
};

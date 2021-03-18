This is a test project for wasm-bindgen-rayon that ensures that Rayon integration works end-to-end in a browser.

It's built in several variants:

 - with Webpack v5
 - with Rollup
   - including [`@web/rollup-plugin-import-meta-assets`](https://modern-web.dev/docs/building/rollup-plugin-import-meta-assets/) for Wasm bundling
   - including [`@surma/rollup-plugin-off-main-thread`](https://github.com/surma/rollup-plugin-off-main-thread) for Worker bundling
 - with `--features no-bundler` for direct usage in a browser

Then, each of those variants is tested in a headless Chrome using [Puppeteer](https://developers.google.com/web/tools/puppeteer).

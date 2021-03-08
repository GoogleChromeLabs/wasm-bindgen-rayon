`wasm-bindgen-rayon` is an adapter for enabling [Rayon](https://github.com/rayon-rs/rayon)-based concurrency on the Web with WebAssembly (via [wasm-bindgen](https://github.com/rustwasm/wasm-bindgen), Web Workers and SharedArrayBuffer support).

# Usage

WebAssembly thread support is not yet a first-class citizen in Rust, so there are a few things to keep in mind when using this crate. Bear with me :)

First of all, add this crate as a dependency to your `Cargo.toml` and reexport the `init_thread_pool` function:

```rust
pub use wasm_bindgen_rayon::init_thread_pool;

// ...
```

This will expose an async `initThreadPool` function in the final generated JavaScript for your library.

You'll need to invoke it right after instantiating your module on the main thread in order to prepare the threadpool before calling into actual library functions:

```js
import init, { initThreadPool, /* ... */ } from './pkg/index.js';

await init();
await initThreadPool(navigator.hardwareConcurrency /* or any number of threads you want to dedicate to the Rayon threadpool */);
// ...now you can invoke any exported functions as you normally would
```

## Building Rust code

First limitation to note is that you'll have to use `wasm-bindgen`/`wasm-pack`'s `web` target (`--target web`).

<details>
<summary><i>Why?</i></summary>

This is because the Wasm code needs to take its own object (the `WebAssembly.Module`) and share it with other threads when spawning them. This object is only accessible from the `--target web` and `--target no-modules` outputs, but we further restrict it to only `--target web` as we also use [JS snippets feature](https://rustwasm.github.io/wasm-bindgen/reference/js-snippets.html).
</details>

The other issue is that the Rust standard library for the WebAssembly target is built without threads support to ensure maximum portability.

Since we do want standard APIs like [`Mutex`, `Arc` and so on to work](https://doc.rust-lang.org/std/sync/), you'll need to use the nightly compiler toolchain and pass some flags to rebuild the standard library in addition to your own code.

If you're using [`wasm-pack`](https://rustwasm.github.io/wasm-pack/book/), the whole command for building your code with threads support will look like this:

```bash
RUSTFLAGS='-C target-feature=+atomics,+bulk-memory' rustup run nightly wasm-pack build [...normal wasm-pack params...] -- -Z build-std=panic_abort,std
```

It looks a bit scary, but it takes care of everything - choosing the nightly toolchain, enabling the required features as well as telling Cargo to rebuild the standard library. You only need to copy it once and hopefully forget about it :)

## Feature detection

[Not all browsers](https://webassembly.org/roadmap/) support WebAssembly threads yet, so you'll likely want to make two builds - one with threads support and one without - and use feature detection to choose the right one on the JavaScript side.

You can use [`wasm-feature-detect`](https://github.com/GoogleChromeLabs/wasm-feature-detect) for this purpose. The code will look like this:

```js
import { threads } from 'wasm-feature-detect';

// ...
let wasmPkg;
if (await threads()) {
	wasmPkg = await import('./pkg-with-threads/index.js');
	await wasmPkg.default();
	await wasmPkg.initThreadPool(navigator.hardwareConcurrency);
} else {
	wasmPkg = await import('./pkg-without-threads/index.js');
	await wasmPkg.default();
}

wasmPkg.nowCallAnyExportedFuncs();
```

## Usage with various bundlers

WebAssembly threads use Web Workers under the hood for instantiating other threads with the same WebAssembly module & memory.

wasm-bindgen-rayon provides the required JS code for those Workers internally, and uses a syntax that is recognised across various bundlers.

### Usage with Webpack

If you're using Webpack v5, you don't need to do anything special, as it already support [bundling Workers](https://webpack.js.org/guides/web-workers/) out of the box.

### Usage with Rollup

For Rollup, you'll need [`@surma/rollup-plugin-off-main-thread`](https://github.com/surma/rollup-plugin-off-main-thread) plugin which brings the same functionality and was tested with this crate.

### Usage with Parcel

*[Coming soon...]* Parcel v2 also recognises the used syntax, but it's still in development and there are some issues to fix it can be used with this crate.

### Usage without bundlers

This crate's JS glue was designed in a way that works great with bundlers and code-splitting, but, sadly, not yet in browsers due to different treatment of import paths. We're keeping an eye on the [`WICG/import-maps`](https://github.com/WICG/import-maps) spec which might allow full compatibility.

It's possible to provide a separate JS glue just for bundlerless apps, but this use-case is currently not prioritised. If it's something you need, please let us know via issues!

# License

This crate is licensed under the Apache-2.0 license.

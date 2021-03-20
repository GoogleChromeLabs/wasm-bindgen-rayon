wasm-pack build --target web
RUSTFLAGS='-C target-feature=+atomics,+bulk-memory' rustup run nightly-2021-02-11 wasm-pack build --target web --out-dir pkg-parallel -- --features parallel -Z build-std=panic_abort,std
npx webpack build -o dist --mode production ./index.js

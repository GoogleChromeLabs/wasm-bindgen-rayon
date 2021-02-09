#!/bin/sh -e

RUSTFLAGS='-C target-feature=+atomics,+bulk-memory' rustup run nightly wasm-pack build --target web --out-name test -- -Z build-std=panic_abort,std

webpack
rollup -c
# node puppeteer

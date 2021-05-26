import * as Comlink from 'comlink';

let handlers = {
  singleThread: (async () => {
    const singleThread = await import('./pkg/wasm_bindgen_rayon_demo.js');
    await singleThread.default();
    return singleThread;
  })(),

  multiThread: (async () => {
    const multiThread = await import(
      './pkg-parallel/wasm_bindgen_rayon_demo.js'
    );
    await multiThread.default();
    await multiThread.initThreadPool(navigator.hardwareConcurrency);
    return multiThread;
  })()
};

async function generate({ type, width, height, maxIterations }) {
  const generator = await handlers[type];
  // Doing time measurement on the worker thread to avoid measuring cost of communication.
  const start = performance.now();
  const rawImageData = generator.generate(width, height, maxIterations);
  const time = performance.now() - start;
  return {
    rawImageData: Comlink.transfer(rawImageData, [rawImageData.buffer]),
    time
  };
}

// Expose the `generate` function to the main thread.
Comlink.expose(generate);

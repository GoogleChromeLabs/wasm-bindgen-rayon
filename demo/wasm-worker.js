import { threads } from 'wasm-feature-detect';

// Wrap wasm-bindgen exports (the `generate` function) to add time measurement.
function wrapExports({ generate }) {
  return ({ width, height, maxIterations }) => {
    const start = performance.now();
    const rawImageData = generate(width, height, maxIterations);
    const time = performance.now() - start;
    return [{
      rawImageData,
      time
    }, [rawImageData.buffer]];
  };
}

const exposedPromise = (async () => {
  const [singleThread, multiThread] = await Promise.all([
    (async () => {
      const singleThread = await import('./pkg/wasm_bindgen_rayon_demo.js');
      await singleThread.default();
      return wrapExports(singleThread);
    })(),
    (async () => {
      // If threads are unsupported in this browser, skip this handler.
      if (!(await threads())) return;
      const multiThread = await import(
        './pkg-parallel/wasm_bindgen_rayon_demo.js'
      );
      await multiThread.default();
      const nameData = new URLSearchParams(self.name);
      const numThreads = Number(nameData.get('threads'));
      await multiThread.initThreadPool(numThreads || navigator.hardwareConcurrency);
      return wrapExports(multiThread);
    })()
  ]);

  const exposed = {
    singleThread,
    supportsThreads: () => ['multiThread' in exposed],
    getKeys: () => [Object.keys(exposed)],
  }

  if (multiThread) exposed.multiThread = multiThread;

  return exposed;
})();

addEventListener('message', async (event) => {
  const exposed = await exposedPromise;
  if (!(event.data.action in exposed)) return;
  const action = exposed[event.data.action];
  const result = await action(...(event.data.args || []));
  event.data.reply.postMessage(...result);
});


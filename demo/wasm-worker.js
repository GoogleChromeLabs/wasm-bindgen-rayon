const generators = {
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

onmessage = async ({ data: { type, width, height, maxIterations } }) => {
  const generator = await generators[type];
  const start = performance.now();
  const rawImageData = generator.generate(width, height, maxIterations);
  const time = performance.now() - start;
  postMessage({ rawImageData, time }, [rawImageData.buffer]);
};

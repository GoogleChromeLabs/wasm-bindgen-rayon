// Note: we use `wasm_bindgen_worker_`-prefixed message types to make sure
// we can handle bundling into other files, which might happen to have their
// own `postMessage`/`onmessage` communication channels.
//
// If we didn't take that into the account, we could send much simpler signals
// like just `0` or whatever, but the code would be less resilient.

function waitForMsgType(target, type) {
  return new Promise(resolve => {
    target.addEventListener('message', function onMsg({ data }) {
      if (data == null || data.type !== type) return;
      target.removeEventListener('message', onMsg);
      resolve(data);
    });
  });
}

waitForMsgType(self, 'wasm_bindgen_worker_init').then(async data => {
  // This could be a regular import, but then some bundlers complain about
  // circular deps.
  //
  // Dynamic import could be cheap if this file was inlined into the parent,
  // which would require us just using `../../..` in `new Worker` below,
  // but that doesn't work because wasm-pack unconditionally adds
  // "sideEffects":false (see below).
  const pkg = await import('../../..');
  await pkg.default(data.module, data.memory);
  postMessage({ type: 'wasm_bindgen_worker_ready' });
  pkg.wbg_rayon_start_worker(data.receiver);
});

export async function startWorkers(module, memory, builder) {
  const workerInit = {
    type: 'wasm_bindgen_worker_init',
    module,
    memory,
    receiver: builder.receiver()
  };

  try {
    await Promise.all(
      Array.from({ length: builder.numThreads() }, () => {
        // Self-spawn into a new Worker.
        //
        // TODO: while `new URL('...', import.meta.url) becomes a semi-standard
        // way to get asset URLs relative to the module across various bundlers
        // and browser, ideally we should switch to `import.meta.resolve`
        // once it becomes a standard.
        //
        // Note: we could use `../../..` as the URL here to inline workerHelpers.js
        // into the parent entry instead of creating another split point -
        // this would be preferable from optimization perspective -
        // however, Webpack then eliminates all message handler code
        // because wasm-pack produces "sideEffects":false in package.json
        // unconditionally.
        //
        // The only way to work around that is to have side effect code
        // in an entry point such as Worker file itself.
        const worker = new Worker(new URL('./workerHelpers.js', import.meta.url), {
          type: 'module'
        });
        worker.postMessage(workerInit);
        return waitForMsgType(worker, 'wasm_bindgen_worker_ready');
      })
    );
    builder.build();
  } finally {
    builder.free();
  }
}

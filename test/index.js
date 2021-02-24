import init, { initThreadPool, sum } from './pkg';

async function runTest() {
  await init(new URL('./pkg/test_bg.wasm', import.meta.url), undefined);
  await initThreadPool(navigator.hardwareConcurrency);
  // 1...10
  let arr = Int32Array.from({ length: 10 }, (_, i) => i + 1);
  if (sum(arr) !== 55) {
    throw new Error('Wrong result.');
  }
  console.log('OK');
}

runTest().then(() => {
  globalThis.DONE = true;
});

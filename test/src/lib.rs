extern crate wasm_bindgen_rayon;

use rayon::prelude::*;
use wasm_bindgen::prelude::*;

// While this is a primitive test, it already requires Rayon to be spawned
// correctly, send tasks to different threads and collect the results back -
// which is all that we need to verify.
#[wasm_bindgen]
pub fn sum(numbers: &[i32]) -> i32 {
    numbers.par_iter().sum()
}

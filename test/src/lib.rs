/*
 * Copyright 2022 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
pub use wasm_bindgen_rayon::init_thread_pool;

use rayon::prelude::*;
use wasm_bindgen::prelude::*;

// While this is a primitive test, it already requires Rayon to be spawned
// correctly, send tasks to different threads and collect the results back -
// which is all that we need to verify.
#[wasm_bindgen]
pub fn sum(numbers: &[i32]) -> i32 {
    numbers.par_iter().sum()
}

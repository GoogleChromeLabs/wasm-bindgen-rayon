(self.webpackChunk=self.webpackChunk||[]).push([[54,443,203],{54:(e,n,t)=>{"use strict";function r(e,n){return new Promise((t=>{e.addEventListener("message",(function r({data:_}){null!=_&&_.type===n&&(e.removeEventListener("message",r),t(_))}))}))}async function _(e,n,_){const i={type:"wasm_bindgen_worker_init",module:e,memory:n,receiver:_.receiver()};await Promise.all(Array.from({length:_.numThreads()},(()=>{const e=new Worker(new URL(new URL(t.p+t.u(203),t.b)),{type:void 0});return e.postMessage(i),r(e,"wasm_bindgen_worker_ready")}))),_.build()}t.d(n,{Q:()=>_}),r(self,"wasm_bindgen_worker_init").then((async e=>{const n=await t.e(443).then(t.bind(t,443));await n.default(e.module,e.memory),postMessage({type:"wasm_bindgen_worker_ready"}),n.wbg_rayon_start_worker(e.receiver)}))},443:(e,n,t)=>{"use strict";t.r(n),t.d(n,{generate:()=>y,initThreadPool:()=>m,wbg_rayon_start_worker:()=>h,wbg_rayon_PoolBuilder:()=>v,default:()=>k});var r=t(54);let _;const i=new Array(32).fill(void 0);function o(e){return i[e]}i.push(void 0,null,!0,!1);let a=i.length;function s(e){const n=o(e);return function(e){e<36||(i[e]=a,a=e)}(e),n}let u=new TextDecoder("utf-8",{ignoreBOM:!0,fatal:!0});u.decode();let b=null;function w(){return null!==b&&b.buffer===_.__wbindgen_export_0.buffer||(b=new Uint8Array(_.__wbindgen_export_0.buffer)),b}function f(e,n){return u.decode(w().slice(e,e+n))}function c(e){a===i.length&&i.push(i.length+1);const n=a;return a=i[n],i[n]=e,n}let d=null;function l(){return null!==d&&d.buffer===_.__wbindgen_export_0.buffer||(d=new Int32Array(_.__wbindgen_export_0.buffer)),d}let g=null;function y(e,n,t){try{const u=_.__wbindgen_add_to_stack_pointer(-16);_.generate(u,e,n,t);var r=l()[u/4+0],i=l()[u/4+1],o=(a=r,s=i,(null!==g&&g.buffer===_.__wbindgen_export_0.buffer||(g=new Uint8ClampedArray(_.__wbindgen_export_0.buffer)),g).subarray(a/1,a/1+s)).slice();return _.__wbindgen_free(r,1*i),o}finally{_.__wbindgen_add_to_stack_pointer(16)}var a,s}function p(e){return function(){try{return e.apply(this,arguments)}catch(e){_.__wbindgen_exn_store(c(e))}}}function m(e){return s(_.initThreadPool(e))}function h(e){_.wbg_rayon_start_worker(e)}class v{static __wrap(e){const n=Object.create(v.prototype);return n.ptr=e,n}__destroy_into_raw(){const e=this.ptr;return this.ptr=0,e}free(){const e=this.__destroy_into_raw();_.__wbg_wbg_rayon_poolbuilder_free(e)}numThreads(){return _.wbg_rayon_poolbuilder_numThreads(this.ptr)>>>0}receiver(){return _.wbg_rayon_poolbuilder_receiver(this.ptr)}build(){_.wbg_rayon_poolbuilder_build(this.ptr)}}const k=async function e(n,i){void 0===n&&(n=new URL(t(386),t.b));const a={wbg:{}};a.wbg.__wbg_getRandomValues_57e4008f45f0e105=p((function(e,n){o(e).getRandomValues(o(n))})),a.wbg.__wbindgen_object_drop_ref=function(e){s(e)},a.wbg.__wbg_randomFillSync_d90848a552cbd666=p((function(e,n,t){var r,_;o(e).randomFillSync((r=n,_=t,w().subarray(r/1,r/1+_)))})),a.wbg.__wbg_self_f865985e662246aa=p((function(){return c(self.self)})),a.wbg.__wbg_static_accessor_MODULE_39947eb3fe77895f=function(){return c(b)},a.wbg.__wbg_require_c59851dfa0dc7e78=p((function(e,n,t){return c(o(e).require(f(n,t)))})),a.wbg.__wbg_crypto_bfb05100db79193b=function(e){return c(o(e).crypto)},a.wbg.__wbg_msCrypto_f6dddc6ae048b7e2=function(e){return c(o(e).msCrypto)},a.wbg.__wbindgen_is_undefined=function(e){return void 0===o(e)},a.wbg.__wbg_buffer_0be9fb426f2dd82b=function(e){return c(o(e).buffer)},a.wbg.__wbg_length_3a5138f465b971ad=function(e){return o(e).length},a.wbg.__wbg_new_4e8d18dbf9cd5240=function(e){return c(new Uint8Array(o(e)))},a.wbg.__wbg_set_4769de301eb521d7=function(e,n,t){o(e).set(o(n),t>>>0)},a.wbg.__wbg_newwithlength_19241666d161c55f=function(e){return c(new Uint8Array(e>>>0))},a.wbg.__wbg_subarray_b07d46fd5261d77f=function(e,n,t){return c(o(e).subarray(n>>>0,t>>>0))},a.wbg.__wbindgen_throw=function(e,n){throw new Error(f(e,n))},a.wbg.__wbindgen_module=function(){return c(e.__wbindgen_wasm_module)},a.wbg.__wbindgen_memory=function(){return c(_.__wbindgen_export_0)},a.wbg.__wbg_startWorkers_914655bb4d5bb5e1=function(e,n,t){return c((0,r.Q)(s(e),s(n),v.__wrap(t)))},("string"==typeof n||"function"==typeof Request&&n instanceof Request||"function"==typeof URL&&n instanceof URL)&&(n=fetch(n)),a.wbg.memory=i||new WebAssembly.Memory({initial:17,maximum:16384,shared:!0});const{instance:u,module:b}=await async function(e,n){if("function"==typeof Response&&e instanceof Response){if("function"==typeof WebAssembly.instantiateStreaming)try{return await WebAssembly.instantiateStreaming(e,n)}catch(n){if("application/wasm"==e.headers.get("Content-Type"))throw n;console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",n)}const t=await e.arrayBuffer();return await WebAssembly.instantiate(t,n)}{const t=await WebAssembly.instantiate(e,n);return t instanceof WebAssembly.Instance?{instance:t,module:e}:t}}(await n,a);return _=u.exports,e.__wbindgen_wasm_module=b,_.__wbindgen_start(),_}},386:(e,n,t)=>{"use strict";e.exports=t.p+"4d4a4adaffe609f7daca.wasm"}}]);
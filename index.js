(()=>{var e={m:{},u:e=>e+".index.js"};e.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),e.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var t;e.g.importScripts&&(t=e.g.location+"");var n=e.g.document;if(!t&&n&&(n.currentScript&&(t=n.currentScript.src),!t)){var r=n.getElementsByTagName("script");r.length&&(t=r[r.length-1].src)}if(!t)throw new Error("Automatic publicPath is not supported in this browser");t=t.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),e.p=t})(),e.b=document.baseURI||self.location.href;const t=document.getElementById("canvas"),{width:n,height:r}=t,o=t.getContext("2d"),a=document.getElementById("time"),i=new Worker(new URL(new URL(e.p+e.u(979),e.b)),{type:void 0});function c(e){i.postMessage({type:e.target.id,width:n,height:r,maxIterations:1e3})}i.onmessage=({data:{rawImageData:e,time:t}})=>{a.value=`${t.toFixed(2)} ms`;const i=new ImageData(e,n,r);o.putImageData(i,0,0)},document.getElementById("singleThread").onclick=c,document.getElementById("multiThread").onclick=c})();
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.supercop_wasm = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Generated by LiveScript 1.5.0
/**
 * @package   supercop.wasm
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2017, Nazar Mokrynskyi
 * @copyright Copyright (c) 2016-2017, https://github.com/1p6
 * @license   MIT License, see license.txt
 */
(function(){
  var supercop, randombytes, x$;
  supercop = require('./supercop')();
  randombytes = require('./randombytes');
  x$ = exports;
  x$.createSeed = function(){
    return randombytes(32);
  };
  x$.createKeyPair = function(seed){
    var seedPtr, seedBuf, pubKeyPtr, publicKey, privKeyPtr, privateKey, x$;
    if (!(seed instanceof Uint8Array)) {
      throw new Error('not Uint8Array!');
    }
    seedPtr = supercop._malloc(32);
    seedBuf = new Uint8Array(supercop.HEAPU8.buffer, seedPtr, 32);
    pubKeyPtr = supercop._malloc(32);
    publicKey = new Uint8Array(supercop.HEAPU8.buffer, pubKeyPtr, 32);
    privKeyPtr = supercop._malloc(64);
    privateKey = new Uint8Array(supercop.HEAPU8.buffer, privKeyPtr, 64);
    seedBuf.set(seed);
    x$ = supercop;
    x$._create_keypair(pubKeyPtr, privKeyPtr, seedPtr);
    x$._free(seedPtr);
    x$._free(pubKeyPtr);
    x$._free(privKeyPtr);
    return {
      publicKey: new Uint8Array(publicKey),
      secretKey: new Uint8Array(privateKey)
    };
  };
  x$.sign = function(message, publicKey, privateKey){
    var msgArrPtr, msgArr, pubKeyArrPtr, pubKeyArr, privKeyArrPtr, privKeyArr, sigPtr, sig, x$;
    if (!(message instanceof Uint8Array) || !(publicKey instanceof Uint8Array) || !(privateKey instanceof Uint8Array)) {
      throw new Error('not Uint8Arrays!');
    }
    msgArrPtr = supercop._malloc(message.length);
    msgArr = new Uint8Array(supercop.HEAPU8.buffer, msgArrPtr, message.length);
    pubKeyArrPtr = supercop._malloc(32);
    pubKeyArr = new Uint8Array(supercop.HEAPU8.buffer, pubKeyArrPtr, 32);
    privKeyArrPtr = supercop._malloc(64);
    privKeyArr = new Uint8Array(supercop.HEAPU8.buffer, privKeyArrPtr, 64);
    sigPtr = supercop._malloc(64);
    sig = new Uint8Array(supercop.HEAPU8.buffer, sigPtr, 64);
    msgArr.set(message);
    pubKeyArr.set(publicKey);
    privKeyArr.set(privateKey);
    x$ = supercop;
    x$._sign(sigPtr, msgArrPtr, message.length, pubKeyArrPtr, privKeyArrPtr);
    x$._free(msgArrPtr);
    x$._free(pubKeyArrPtr);
    x$._free(privKeyArrPtr);
    x$._free(sigPtr);
    return new Uint8Array(sig);
  };
  x$.verify = function(sig, message, publicKey){
    var msgArrPtr, msgArr, sigArrPtr, sigArr, pubKeyArrPtr, pubKeyArr, result, x$;
    if (!(message instanceof Uint8Array) || !(sig instanceof Uint8Array) || !(publicKey instanceof Uint8Array)) {
      throw new Error('not Uint8Arrays!');
    }
    msgArrPtr = supercop._malloc(message.length);
    msgArr = new Uint8Array(supercop.HEAPU8.buffer, msgArrPtr, message.length);
    sigArrPtr = supercop._malloc(64);
    sigArr = new Uint8Array(supercop.HEAPU8.buffer, sigArrPtr, 64);
    pubKeyArrPtr = supercop._malloc(32);
    pubKeyArr = new Uint8Array(supercop.HEAPU8.buffer, pubKeyArrPtr, 32);
    msgArr.set(message);
    sigArr.set(sig);
    pubKeyArr.set(publicKey);
    result = supercop._verify(sigArrPtr, msgArrPtr, message.length, pubKeyArrPtr) === 1;
    x$ = supercop;
    x$._free(msgArrPtr);
    x$._free(sigArrPtr);
    x$._free(pubKeyArrPtr);
    return result;
  };
}).call(this);

},{"./randombytes":2,"./supercop":3}],2:[function(require,module,exports){
module.exports = function (size) {
	var array = new Uint8Array(size);
	window.crypto.getRandomValues(array);
	return array;
};

},{}],3:[function(require,module,exports){
var Module = function(Module) {
  Module = Module || {};
  var Module = Module;

var b;b||(b=eval("(function() { try { return Module || {} } catch(e) { return {} } })()"));var g={},m;for(m in b)b.hasOwnProperty(m)&&(g[m]=b[m]);var q=!1,r=!1,t=!1,u=!1;
if(b.ENVIRONMENT)if("WEB"===b.ENVIRONMENT)q=!0;else if("WORKER"===b.ENVIRONMENT)r=!0;else if("NODE"===b.ENVIRONMENT)t=!0;else if("SHELL"===b.ENVIRONMENT)u=!0;else throw Error("The provided Module['ENVIRONMENT'] value is not valid. It must be one of: WEB|WORKER|NODE|SHELL.");else q="object"===typeof window,r="function"===typeof importScripts,t="object"===typeof process&&"function"===typeof require&&!q&&!r,u=!q&&!t&&!r;
if(t){b.print||(b.print=console.log);b.printErr||(b.printErr=console.warn);var v,w;b.read=function(a,c){v||(v=require("fs"));w||(w=require("path"));a=w.normalize(__dirname+"/"+a);var d=v.readFileSync(a);return c?d:d.toString()};b.readBinary=function(a){a=b.read(a,!0);a.buffer||(a=new Uint8Array(a));assert(a.buffer);return a};b.load=function(a){aa(read(a))};b.thisProgram||(b.thisProgram=1<process.argv.length?process.argv[1].replace(/\\/g,"/"):"unknown-program");b.arguments=process.argv.slice(2);"undefined"!==
typeof module&&(module.exports=b);process.on("uncaughtException",function(a){if(!(a instanceof x))throw a;});b.inspect=function(){return"[Emscripten Module object]"}}else if(u)b.print||(b.print=print),"undefined"!=typeof printErr&&(b.printErr=printErr),b.read="undefined"!=typeof read?read:function(){throw"no read() available";},b.readBinary=function(a){if("function"===typeof readbuffer)return new Uint8Array(readbuffer(a));a=read(a,"binary");assert("object"===typeof a);return a},"undefined"!=typeof scriptArgs?
b.arguments=scriptArgs:"undefined"!=typeof arguments&&(b.arguments=arguments),"function"===typeof quit&&(b.quit=function(a){quit(a)}),eval("if (typeof gc === 'function' && gc.toString().indexOf('[native code]') > 0) var gc = undefined");else if(q||r)b.read=function(a){var c=new XMLHttpRequest;c.open("GET",a,!1);c.send(null);return c.responseText},r&&(b.readBinary=function(a){var c=new XMLHttpRequest;c.open("GET",a,!1);c.responseType="arraybuffer";c.send(null);return new Uint8Array(c.response)}),b.readAsync=
function(a,c,d){var e=new XMLHttpRequest;e.open("GET",a,!0);e.responseType="arraybuffer";e.onload=function(){200==e.status||0==e.status&&e.response?c(e.response):d()};e.onerror=d;e.send(null)},"undefined"!=typeof arguments&&(b.arguments=arguments),"undefined"!==typeof console?(b.print||(b.print=function(a){console.log(a)}),b.printErr||(b.printErr=function(a){console.warn(a)})):b.print||(b.print=function(){}),r&&(b.load=importScripts),"undefined"===typeof b.setWindowTitle&&(b.setWindowTitle=function(a){document.title=
a});else throw"Unknown runtime environment. Where are we?";function aa(a){eval.call(null,a)}!b.load&&b.read&&(b.load=function(a){aa(b.read(a))});b.print||(b.print=function(){});b.printErr||(b.printErr=b.print);b.arguments||(b.arguments=[]);b.thisProgram||(b.thisProgram="./this.program");b.quit||(b.quit=function(a,c){throw c;});b.print=b.print;b.c=b.printErr;b.preRun=[];b.postRun=[];for(m in g)g.hasOwnProperty(m)&&(b[m]=g[m]);
var g=void 0,z={u:function(a){return tempRet0=a},s:function(){return tempRet0},w:function(){return y},v:function(a){y=a},k:function(a){switch(a){case "i1":case "i8":return 1;case "i16":return 2;case "i32":return 4;case "i64":return 8;case "float":return 4;case "double":return 8;default:return"*"===a[a.length-1]?z.e:"i"===a[0]?(a=parseInt(a.substr(1)),assert(0===a%8),a/8):0}},r:function(a){return Math.max(z.k(a),z.e)},A:16,P:function(a,c){"double"===c||"i64"===c?a&7&&(assert(4===(a&7)),a+=4):assert(0===
(a&3));return a},J:function(a,c,d){return d||"i64"!=a&&"double"!=a?a?Math.min(c||(a?z.r(a):0),z.e):Math.min(c,8):8},g:function(a,c,d){return d&&d.length?b["dynCall_"+a].apply(null,[c].concat(d)):b["dynCall_"+a].call(null,c)},b:[],n:function(a){for(var c=0;c<z.b.length;c++)if(!z.b[c])return z.b[c]=a,2*(1+c);throw"Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS.";},t:function(a){z.b[(a-2)/2]=null},a:function(a){z.a.i||(z.a.i={});z.a.i[a]||(z.a.i[a]=1,b.c(a))},
h:{},L:function(a,c){assert(c);z.h[c]||(z.h[c]={});var d=z.h[c];d[a]||(d[a]=1===c.length?function(){return z.g(c,a)}:2===c.length?function(d){return z.g(c,a,[d])}:function(){return z.g(c,a,Array.prototype.slice.call(arguments))});return d[a]},K:function(){throw"You must build with -s RETAIN_COMPILER_SETTINGS=1 for Runtime.getCompilerSetting or emscripten_get_compiler_setting to work";},l:function(a){var c=y;y=y+a|0;y=y+15&-16;return c},m:function(a){var c=B;B=B+a|0;B=B+15&-16;return c},q:function(a){var c=
C[D>>2];a=(c+a+15|0)&-16;C[D>>2]=a;if(a=a>=E)F(),a=!0;return a?(C[D>>2]=c,0):c},j:function(a,c){return Math.ceil(a/(c?c:16))*(c?c:16)},O:function(a,c,d){return d?+(a>>>0)+4294967296*+(c>>>0):+(a>>>0)+4294967296*+(c|0)},d:1024,e:4,B:0};z.addFunction=z.n;z.removeFunction=z.t;var G=0;function assert(a,c){a||H("Assertion failed: "+c)}
function ba(a){var c;c="i32";"*"===c.charAt(c.length-1)&&(c="i32");switch(c){case "i1":return I[a>>0];case "i8":return I[a>>0];case "i16":return K[a>>1];case "i32":return C[a>>2];case "i64":return C[a>>2];case "float":return L[a>>2];case "double":return M[a>>3];default:H("invalid type for setValue: "+c)}return null}
function N(a,c,d){var e,h,f;"number"===typeof a?(h=!0,f=a):(h=!1,f=a.length);var l="string"===typeof c?c:null,k;4==d?k=e:k=["function"===typeof O?O:z.m,z.l,z.m,z.q][void 0===d?2:d](Math.max(f,l?1:c.length));if(h){e=k;assert(0==(k&3));for(a=k+(f&-4);e<a;e+=4)C[e>>2]=0;for(a=k+f;e<a;)I[e++>>0]=0;return k}if("i8"===l)return a.subarray||a.slice?P.set(a,k):P.set(new Uint8Array(a),k),k;e=0;for(var n,J;e<f;){var p=a[e];"function"===typeof p&&(p=z.M(p));d=l||c[e];if(0===d)e++;else{"i64"==d&&(d="i32");h=k+
e;var A=d,A=A||"i8";"*"===A.charAt(A.length-1)&&(A="i32");switch(A){case "i1":I[h>>0]=p;break;case "i8":I[h>>0]=p;break;case "i16":K[h>>1]=p;break;case "i32":C[h>>2]=p;break;case "i64":tempI64=[p>>>0,(tempDouble=p,1<=+ca(tempDouble)?0<tempDouble?(da(+ea(tempDouble/4294967296),4294967295)|0)>>>0:~~+fa((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)];C[h>>2]=tempI64[0];C[h+4>>2]=tempI64[1];break;case "float":L[h>>2]=p;break;case "double":M[h>>3]=p;break;default:H("invalid type for setValue: "+A)}J!==
d&&(n=z.k(d),J=d);e+=n}}return k}function ga(a){var c;if(0===c||!a)return"";for(var d=0,e,h=0;;){e=P[a+h>>0];d|=e;if(0==e&&!c)break;h++;if(c&&h==c)break}c||(c=h);e="";if(128>d){for(;0<c;)d=String.fromCharCode.apply(String,P.subarray(a,a+Math.min(c,1024))),e=e?e+d:d,a+=1024,c-=1024;return e}return b.UTF8ToString(a)}"undefined"!==typeof TextDecoder&&new TextDecoder("utf8");
function ha(a,c,d,e){if(0<e){e=d+e-1;for(var h=0;h<a.length;++h){var f=a.charCodeAt(h);55296<=f&&57343>=f&&(f=65536+((f&1023)<<10)|a.charCodeAt(++h)&1023);if(127>=f){if(d>=e)break;c[d++]=f}else{if(2047>=f){if(d+1>=e)break;c[d++]=192|f>>6}else{if(65535>=f){if(d+2>=e)break;c[d++]=224|f>>12}else{if(2097151>=f){if(d+3>=e)break;c[d++]=240|f>>18}else{if(67108863>=f){if(d+4>=e)break;c[d++]=248|f>>24}else{if(d+5>=e)break;c[d++]=252|f>>30;c[d++]=128|f>>24&63}c[d++]=128|f>>18&63}c[d++]=128|f>>12&63}c[d++]=
128|f>>6&63}c[d++]=128|f&63}}c[d]=0}}function ia(a){for(var c=0,d=0;d<a.length;++d){var e=a.charCodeAt(d);55296<=e&&57343>=e&&(e=65536+((e&1023)<<10)|a.charCodeAt(++d)&1023);127>=e?++c:c=2047>=e?c+2:65535>=e?c+3:2097151>=e?c+4:67108863>=e?c+5:c+6}return c}"undefined"!==typeof TextDecoder&&new TextDecoder("utf-16le");
function ja(a){return a.replace(/__Z[\w\d_]+/g,function(a){var d;a:{var e=b.___cxa_demangle||b.__cxa_demangle;if(e)try{var h=a.substr(1),f=ia(h)+1,l=O(f);ha(h,P,l,f);var k=O(4),n=e(l,0,0,k);if(0===ba(k)&&n){d=ga(n);break a}}catch(J){}finally{l&&Q(l),k&&Q(k),n&&Q(n)}else z.a("warning: build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling");d=a}return a===d?a:a+" ["+d+"]"})}
function ka(){var a;a:{a=Error();if(!a.stack){try{throw Error(0);}catch(c){a=c}if(!a.stack){a="(no stack trace available)";break a}}a=a.stack.toString()}b.extraStackTrace&&(a+="\n"+b.extraStackTrace());return ja(a)}var buffer,I,P,K,la,C,ma,L,M;
function na(){b.HEAP8=I=new Int8Array(buffer);b.HEAP16=K=new Int16Array(buffer);b.HEAP32=C=new Int32Array(buffer);b.HEAPU8=P=new Uint8Array(buffer);b.HEAPU16=la=new Uint16Array(buffer);b.HEAPU32=ma=new Uint32Array(buffer);b.HEAPF32=L=new Float32Array(buffer);b.HEAPF64=M=new Float64Array(buffer)}var R,B,S,y,T,U,D;R=B=S=y=T=U=D=0;
function F(){H("Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value "+E+", (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ")}var oa=b.TOTAL_STACK||5242880,E=b.TOTAL_MEMORY||16777216;E<oa&&b.c("TOTAL_MEMORY should be larger than TOTAL_STACK, was "+E+"! (TOTAL_STACK="+oa+")");
b.buffer?buffer=b.buffer:"object"===typeof WebAssembly&&"function"===typeof WebAssembly.Memory?(b.wasmMemory=new WebAssembly.Memory({initial:E/65536,maximum:E/65536}),buffer=b.wasmMemory.buffer):buffer=new ArrayBuffer(E);na();C[0]=1668509029;K[1]=25459;if(115!==P[2]||99!==P[3])throw"Runtime error: expected the system to be little-endian!";b.HEAP=void 0;b.buffer=buffer;b.HEAP8=I;b.HEAP16=K;b.HEAP32=C;b.HEAPU8=P;b.HEAPU16=la;b.HEAPU32=ma;b.HEAPF32=L;b.HEAPF64=M;
function V(a){for(;0<a.length;){var c=a.shift();if("function"==typeof c)c();else{var d=c.I;"number"===typeof d?void 0===c.f?b.dynCall_v(d):b.dynCall_vi(d,c.f):d(void 0===c.f?null:c.f)}}}var pa=[],qa=[],ra=[],sa=[],ta=[],W=!1;function ua(){var a=b.preRun.shift();pa.unshift(a)}function va(a){var c=Array(ia(a)+1);ha(a,c,0,c.length);return c}Math.imul&&-5===Math.imul(4294967295,5)||(Math.imul=function(a,c){var d=a&65535,e=c&65535;return d*e+((a>>>16)*e+d*(c>>>16)<<16)|0});Math.N=Math.imul;
if(!Math.fround){var wa=new Float32Array(1);Math.fround=function(a){wa[0]=a;return wa[0]}}Math.H=Math.fround;Math.clz32||(Math.clz32=function(a){a=a>>>0;for(var c=0;32>c;c++)if(a&1<<31-c)return c;return 32});Math.D=Math.clz32;Math.trunc||(Math.trunc=function(a){return 0>a?Math.ceil(a):Math.floor(a)});Math.trunc=Math.trunc;var ca=Math.abs,fa=Math.ceil,ea=Math.floor,da=Math.min,X=0,xa=null,Y=null;function ya(){X++;b.monitorRunDependencies&&b.monitorRunDependencies(X)}
function za(){X--;b.monitorRunDependencies&&b.monitorRunDependencies(X);if(0==X&&(null!==xa&&(clearInterval(xa),xa=null),Y)){var a=Y;Y=null;a()}}b.preloadedImages={};b.preloadedAudios={};var Z=null;
(function(a){function c(c){var d=a.usingWasm?65536:16777216;0<c%d&&(c+=d-c%d);var d=a.buffer,e=d.byteLength;if(a.usingWasm)try{return-1!==a.wasmMemory.grow((c-e)/65536)?a.buffer=a.wasmMemory.buffer:null}catch(f){return null}else return n.__growWasmMemory((c-e)/65536),a.buffer!==d?a.buffer:null}function d(){if(!a.wasmBinary&&"function"===typeof fetch){var c=document.currentScript.src.split("/").slice(0,-1).join("/");return fetch(c+"/"+f,{F:"same-origin"}).then(function(a){if(!a.ok)throw"failed to load wasm binary file at '"+
f+"'";return a.arrayBuffer()})}return new Promise(function(c){var d;if(a.wasmBinary)d=a.wasmBinary,d=new Uint8Array(d);else if(a.readBinary)d=a.readBinary(f);else throw"on the web, we need the wasm binary to be preloaded and set on Module['wasmBinary']. emcc.py will do that for you when generating HTML (but not JS)";c(d)})}function e(c,e){function f(c){n=c.exports;if(n.memory){c=n.memory;var d=a.buffer;c.byteLength<d.byteLength&&a.printErr("the new buffer in mergeMemory is smaller than the previous one. in native wasm, we should grow memory here");
var d=new Int8Array(d),e=new Int8Array(c);Z||d.set(e.subarray(a.STATIC_BASE,a.STATIC_BASE+a.STATIC_BUMP),a.STATIC_BASE);e.set(d);b.buffer=buffer=c;na()}a.asm=n;a.usingWasm=!0;za()}if("object"!==typeof WebAssembly)return a.printErr("no native wasm support detected"),!1;if(!(a.wasmMemory instanceof WebAssembly.Memory))return a.printErr("no native wasm Memory in use"),!1;e.memory=a.wasmMemory;k.global={NaN:NaN,Infinity:Infinity};k["global.Math"]=c.Math;k.env=e;ya();if(a.instantiateWasm)try{return a.instantiateWasm(k,
f)}catch(h){return a.printErr("Module.instantiateWasm callback failed with error: "+h),!1}d().then(function(a){return WebAssembly.instantiate(a,k)}).then(function(a){f(a.instance)}).catch(function(c){a.printErr("failed to asynchronously prepare wasm: "+c);a.quit(1,c)});return{}}a.wasmJSMethod=a.wasmJSMethod||"native-wasm";var h=a.wasmTextFile||"supercop.wast",f=a.wasmBinaryFile||"supercop.wasm",l=a.asmjsCodeFile||"supercop.temp.asm.js";"function"===typeof a.locateFile&&(h=a.locateFile(h),f=a.locateFile(f),
l=a.locateFile(l));var k={global:null,env:null,asm2wasm:{"f64-rem":function(a,c){return a%c},"f64-to-int":function(a){return a|0},"i32s-div":function(a,c){return(a|0)/(c|0)|0},"i32u-div":function(a,c){return(a>>>0)/(c>>>0)>>>0},"i32s-rem":function(a,c){return(a|0)%(c|0)|0},"i32u-rem":function(a,c){return(a>>>0)%(c>>>0)>>>0},"debugger":function(){debugger}},parent:a},n=null;a.asmPreload=a.asm;var J=a.reallocBuffer;a.reallocBuffer=function(a){return"asmjs"===p?J(a):c(a)};var p="";a.asm=function(c,d){if(!d.table){var f=
a.wasmTableSize;void 0===f&&(f=1024);var h=a.wasmMaxTableSize;d.table="object"===typeof WebAssembly&&"function"===typeof WebAssembly.Table?void 0!==h?new WebAssembly.Table({initial:f,maximum:h,element:"anyfunc"}):new WebAssembly.Table({initial:f,element:"anyfunc"}):Array(f);a.wasmTable=d.table}d.memoryBase||(d.memoryBase=a.STATIC_BASE);d.tableBase||(d.tableBase=0);return e(c,d)}})(b);R=z.d;B=R+34272;qa.push();
Z=0<=b.wasmJSMethod.indexOf("asmjs")||0<=b.wasmJSMethod.indexOf("interpret-asm2wasm")?"supercop.js.mem":null;b.STATIC_BASE=R;b.STATIC_BUMP=34272;var Aa=B;B+=16;b._sbrk=Ba;D=N(1,"i32",2);S=y=z.j(B);T=S+oa;U=z.j(T);C[D>>2]=U;b.wasmTableSize=0;b.wasmMaxTableSize=0;b.o={Math:Math,Int8Array:Int8Array,Int16Array:Int16Array,Int32Array:Int32Array,Uint8Array:Uint8Array,Uint16Array:Uint16Array,Uint32Array:Uint32Array,Float32Array:Float32Array,Float64Array:Float64Array,NaN:NaN,Infinity:Infinity};
b.p={abort:H,assert:assert,enlargeMemory:function(){F()},getTotalMemory:function(){return E},abortOnCannotGrowMemory:F,_abort:function(){b.abort()},___setErrNo:function(a){b.___errno_location&&(C[b.___errno_location()>>2]=a);return a},DYNAMICTOP_PTR:D,tempDoublePtr:Aa,ABORT:G,STACKTOP:y,STACK_MAX:T};var Ca=b.asm(b.o,b.p,buffer);b.asm=Ca;b._sign=function(){return b.asm._sign.apply(null,arguments)};b.getTempRet0=function(){return b.asm.getTempRet0.apply(null,arguments)};
b._verify=function(){return b.asm._verify.apply(null,arguments)};b._create_keypair=function(){return b.asm._create_keypair.apply(null,arguments)};b.runPostSets=function(){return b.asm.runPostSets.apply(null,arguments)};b.setTempRet0=function(){return b.asm.setTempRet0.apply(null,arguments)};b.establishStackSpace=function(){return b.asm.establishStackSpace.apply(null,arguments)};b.stackRestore=function(){return b.asm.stackRestore.apply(null,arguments)};
var O=b._malloc=function(){return b.asm._malloc.apply(null,arguments)};b._emscripten_get_global_libc=function(){return b.asm._emscripten_get_global_libc.apply(null,arguments)};b.stackAlloc=function(){return b.asm.stackAlloc.apply(null,arguments)};b.setThrew=function(){return b.asm.setThrew.apply(null,arguments)};var Ba=b._sbrk=function(){return b.asm._sbrk.apply(null,arguments)},Q=b._free=function(){return b.asm._free.apply(null,arguments)};
b.stackSave=function(){return b.asm.stackSave.apply(null,arguments)};z.l=b.stackAlloc;z.w=b.stackSave;z.v=b.stackRestore;z.G=b.establishStackSpace;z.u=b.setTempRet0;z.s=b.getTempRet0;b.asm=Ca;
if(Z)if("function"===typeof b.locateFile?Z=b.locateFile(Z):b.memoryInitializerPrefixURL&&(Z=b.memoryInitializerPrefixURL+Z),t||u){var Da=b.readBinary(Z);P.set(Da,z.d)}else{var Fa=function(){b.readAsync(Z,Ea,function(){throw"could not load memory initializer "+Z;})};ya();var Ea=function(a){a.byteLength&&(a=new Uint8Array(a));P.set(a,z.d);b.memoryInitializerRequest&&delete b.memoryInitializerRequest.response;za()};if(b.memoryInitializerRequest){var Ga=function(){var a=b.memoryInitializerRequest;200!==
a.status&&0!==a.status?(console.warn("a problem seems to have happened with Module.memoryInitializerRequest, status: "+a.status+", retrying "+Z),Fa()):Ea(a.response)};b.memoryInitializerRequest.response?setTimeout(Ga,0):b.memoryInitializerRequest.addEventListener("load",Ga)}else Fa()}b.then=function(a){if(b.calledRun)a(b);else{var c=b.onRuntimeInitialized;b.onRuntimeInitialized=function(){c&&c();a(b)}}return b};
function x(a){this.name="ExitStatus";this.message="Program terminated with exit("+a+")";this.status=a}x.prototype=Error();x.prototype.constructor=x;var Ha=null,Y=function Ia(){b.calledRun||Ja();b.calledRun||(Y=Ia)};
b.callMain=b.C=function(a){function c(){for(var a=0;3>a;a++)e.push(0)}a=a||[];W||(W=!0,V(qa));var d=a.length+1,e=[N(va(b.thisProgram),"i8",0)];c();for(var h=0;h<d-1;h+=1)e.push(N(va(a[h]),"i8",0)),c();e.push(0);e=N(e,"i32",0);try{var f=b._main(d,e,0);Ka(f,!0)}catch(l){l instanceof x||("SimulateInfiniteLoop"==l?b.noExitRuntime=!0:((a=l)&&"object"===typeof l&&l.stack&&(a=[l,l.stack]),b.c("exception thrown: "+a),b.quit(1,l)))}finally{}};
function Ja(a){function c(){if(!b.calledRun&&(b.calledRun=!0,!G)){W||(W=!0,V(qa));V(ra);if(b.onRuntimeInitialized)b.onRuntimeInitialized();b._main&&La&&b.callMain(a);if(b.postRun)for("function"==typeof b.postRun&&(b.postRun=[b.postRun]);b.postRun.length;){var c=b.postRun.shift();ta.unshift(c)}V(ta)}}a=a||b.arguments;null===Ha&&(Ha=Date.now());if(!(0<X)){if(b.preRun)for("function"==typeof b.preRun&&(b.preRun=[b.preRun]);b.preRun.length;)ua();V(pa);0<X||b.calledRun||(b.setStatus?(b.setStatus("Running..."),
setTimeout(function(){setTimeout(function(){b.setStatus("")},1);c()},1)):c())}}b.run=b.run=Ja;function Ka(a,c){if(!c||!b.noExitRuntime){if(!b.noExitRuntime&&(G=!0,y=void 0,V(sa),b.onExit))b.onExit(a);t&&process.exit(a);b.quit(a,new x(a))}}b.exit=b.exit=Ka;var Ma=[];
function H(a){void 0!==a?(b.print(a),b.c(a),a=JSON.stringify(a)):a="";G=!0;var c="abort("+a+") at "+ka()+"\nIf this abort() is unexpected, build with -s ASSERTIONS=1 which can give more information.";Ma&&Ma.forEach(function(d){c=d(c,a)});throw c;}b.abort=b.abort=H;if(b.preInit)for("function"==typeof b.preInit&&(b.preInit=[b.preInit]);0<b.preInit.length;)b.preInit.pop()();var La=!0;b.noInitialRun&&(La=!1);b.noExitRuntime=!0;Ja();

  return Module;
};
if (typeof module === "object" && module.exports) {
  module['exports'] = Module;
};

},{"fs":undefined,"path":undefined}]},{},[1])(1)
});
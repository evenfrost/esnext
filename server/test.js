import fs from 'fs';

// console.log(fs);


let resolved = Promise.resolve();

function* generator() {
  yield '3';
}

let wm = new WeakMap();

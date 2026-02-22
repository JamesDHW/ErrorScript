//// [tests/cases/compiler/checkedErrors/combinators/any_unions_rejects.ts] ////

//// [any_unions_rejects.ts]
async function a() {
    throw "a";
}
async function b() {
    throw 123;
}
async function anyRequiresHandling() {
    await Promise.any([a(), b()]);
}


//// [any_unions_rejects.js]
"use strict";
async function a() {
    throw "a";
}
async function b() {
    throw 123;
}
async function anyRequiresHandling() {
    await Promise.any([a(), b()]);
}

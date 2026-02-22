//// [tests/cases/compiler/checkedThrows/combinators/allSettled_no_handling.ts] ////

//// [allSettled_no_handling.ts]
async function a() {
    throw "a";
}
async function b() {
    throw 123;
}
async function allSettledNoHandlingRequired() {
    await Promise.allSettled([a(), b()]);
}


//// [allSettled_no_handling.js]
"use strict";
async function a() {
    throw "a";
}
async function b() {
    throw 123;
}
async function allSettledNoHandlingRequired() {
    await Promise.allSettled([a(), b()]);
}

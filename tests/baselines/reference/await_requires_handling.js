//// [tests/cases/compiler/checkedErrors/rejects/await_requires_handling.ts] ////

//// [await_requires_handling.ts]
async function boom() {
    throw new Error("x");
}
async function awaitRequiresHandling() {
    await boom();
}


//// [await_requires_handling.js]
"use strict";
async function boom() {
    throw new Error("x");
}
async function awaitRequiresHandling() {
    await boom();
}

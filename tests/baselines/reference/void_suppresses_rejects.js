//// [tests/cases/compiler/checkedErrors/rejects/void_suppresses_rejects.ts] ////

//// [void_suppresses_rejects.ts]
async function boom() {
    throw new Error("x");
}
void boom();


//// [void_suppresses_rejects.js]
"use strict";
async function boom() {
    throw new Error("x");
}
void boom();

//// [tests/cases/compiler/checkedErrors/rejects/fire_and_forget_requires_explicit_ignore.ts] ////

//// [fire_and_forget_requires_explicit_ignore.ts]
async function boom() {
    throw new Error("x");
}
function fireAndForget() {
    boom();
}


//// [fire_and_forget_requires_explicit_ignore.js]
"use strict";
async function boom() {
    throw new Error("x");
}
function fireAndForget() {
    boom();
}

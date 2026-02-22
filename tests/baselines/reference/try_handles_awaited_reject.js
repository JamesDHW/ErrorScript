//// [tests/cases/compiler/checkedThrows/rejects/try_handles_awaited_reject.ts] ////

//// [try_handles_awaited_reject.ts]
async function boom() {
    throw new Error("x");
}
async function tryHandlesAwaitedRejection() {
    try {
        await boom();
    } catch (e) {
        e.message;
    }
}


//// [try_handles_awaited_reject.js]
"use strict";
async function boom() {
    throw new Error("x");
}
async function tryHandlesAwaitedRejection() {
    try {
        await boom();
    }
    catch (e) {
        e.message;
    }
}

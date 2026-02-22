//// [tests/cases/compiler/checkedThrows/throws/rethrow_preserves_effect.ts] ////

//// [rethrow_preserves_effect.ts]
function boom() {
    throw new Error("x");
}
function c() {
    try {
        boom();
    } catch (e) {
        throw e;
    }
}
c();


//// [rethrow_preserves_effect.js]
"use strict";
function boom() {
    throw new Error("x");
}
function c() {
    try {
        boom();
    }
    catch (e) {
        throw e;
    }
}
c();

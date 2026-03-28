//// [tests/cases/compiler/checkedErrors/throws/finally_contributes.ts] ////

//// [finally_contributes.ts]
function boom() {
    throw new Error("x");
}
function withFinally() {
    try {
        boom();
    } catch (e) {
    } finally {
        throw "finally";
    }
}
withFinally();


//// [finally_contributes.js]
"use strict";
function boom() {
    throw new Error("x");
}
function withFinally() {
    try {
        boom();
    }
    catch (e) {
    }
    finally {
        throw "finally";
    }
}
withFinally();

//// [tests/cases/compiler/checkedThrowsFinally.ts] ////

//// [checkedThrowsFinally.ts]
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


//// [checkedThrowsFinally.js]
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

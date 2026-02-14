//// [tests/cases/compiler/checkedThrowsRethrow.ts] ////

//// [checkedThrowsRethrow.ts]
function boom3() {
    throw new Error("x");
}

function c() {
    try {
        boom3();
    } catch (e) {
        throw e;
    }
}
c();


//// [checkedThrowsRethrow.js]
"use strict";
function boom3() {
    throw new Error("x");
}
function c() {
    try {
        boom3();
    }
    catch (e) {
        throw e;
    }
}
c();

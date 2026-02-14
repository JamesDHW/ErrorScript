//// [tests/cases/compiler/checkedThrowsAbsorption.ts] ////

//// [checkedThrowsAbsorption.ts]
function boom() {
    throw new Error("x");
}

function a() {
    boom();
}

function b() {
    try {
        a();
    } catch (e) { }
}

b();


//// [checkedThrowsAbsorption.js]
"use strict";
function boom() {
    throw new Error("x");
}
function a() {
    boom();
}
function b() {
    try {
        a();
    }
    catch (e) { }
}
b();

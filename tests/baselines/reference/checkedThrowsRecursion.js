//// [tests/cases/compiler/checkedThrowsRecursion.ts] ////

//// [checkedThrowsRecursion.ts]
function r1() {
    r2();
}
function r2() {
    r1();
    throw new Error("x");
}
r1();


//// [checkedThrowsRecursion.js]
"use strict";
function r1() {
    r2();
}
function r2() {
    r1();
    throw new Error("x");
}
r1();

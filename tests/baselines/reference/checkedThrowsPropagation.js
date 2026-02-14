//// [tests/cases/compiler/checkedThrowsPropagation.ts] ////

//// [checkedThrowsPropagation.ts]
function inner() {
    throw 123;
}
function outer() {
    inner();
}
outer();


//// [checkedThrowsPropagation.js]
"use strict";
function inner() {
    throw 123;
}
function outer() {
    inner();
}
outer();

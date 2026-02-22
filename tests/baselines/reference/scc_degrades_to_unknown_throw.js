//// [tests/cases/compiler/checkedThrows/recursion/scc_degrades_to_unknown_throw.ts] ////

//// [scc_degrades_to_unknown_throw.ts]
function r1() {
    r2();
}
function r2() {
    r1();
    throw new Error("x");
}
r1();


//// [scc_degrades_to_unknown_throw.js]
"use strict";
function r1() {
    r2();
}
function r2() {
    r1();
    throw new Error("x");
}
r1();

//// [tests/cases/compiler/checkedErrors/throws/unhandled_top_level.ts] ////

//// [unhandled_top_level.ts]
function boom() {
    throw new Error("x");
}
boom();


//// [unhandled_top_level.js]
"use strict";
function boom() {
    throw new Error("x");
}
boom();

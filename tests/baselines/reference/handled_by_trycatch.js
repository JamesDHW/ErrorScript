//// [tests/cases/compiler/checkedErrors/throws/handled_by_trycatch.ts] ////

//// [handled_by_trycatch.ts]
function boom() {
    throw new Error("x");
}
try {
    boom();
} catch (e) {
    e.message;
}


//// [handled_by_trycatch.js]
"use strict";
function boom() {
    throw new Error("x");
}
try {
    boom();
}
catch (e) {
    e.message;
}

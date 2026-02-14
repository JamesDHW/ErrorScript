//// [tests/cases/compiler/checkedThrowsBasic.ts] ////

//// [checkedThrowsBasic.ts]
function boom2() {
    throw new Error("x");
}
boom2();

try {
    boom2();
} catch (e) {
    e.message;
}


//// [checkedThrowsBasic.js]
"use strict";
function boom2() {
    throw new Error("x");
}
boom2();
try {
    boom2();
}
catch (e) {
    e.message;
}

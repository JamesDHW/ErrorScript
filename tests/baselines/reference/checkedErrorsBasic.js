//// [tests/cases/compiler/checkedErrorsBasic.ts] ////

//// [checkedErrorsBasic.ts]
function boom2() {
    throw new Error("x");
}
boom2();

try {
    boom2();
} catch (e) {
    e.message;
}


//// [checkedErrorsBasic.js]
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

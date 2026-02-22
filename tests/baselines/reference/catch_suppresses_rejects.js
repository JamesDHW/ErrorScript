//// [tests/cases/compiler/checkedThrows/rejects/catch_suppresses_rejects.ts] ////

//// [catch_suppresses_rejects.ts]
async function boom() {
    throw new Error("x");
}
boom().catch(() => {});


//// [catch_suppresses_rejects.js]
"use strict";
async function boom() {
    throw new Error("x");
}
boom().catch(() => { });

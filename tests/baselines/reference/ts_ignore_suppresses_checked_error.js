//// [tests/cases/compiler/checkedErrors/suppress/ts_ignore_suppresses_checked_error.ts] ////

//// [ts_ignore_suppresses_checked_error.ts]
async function fail() {
    throw new Error("x");
}
async function tsIgnoreSuppressesAll() {
    // @ts-ignore
    await fail();
}


//// [ts_ignore_suppresses_checked_error.js]
"use strict";
async function fail() {
    throw new Error("x");
}
async function tsIgnoreSuppressesAll() {
    // @ts-ignore
    await fail();
}

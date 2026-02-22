//// [tests/cases/compiler/checkedThrows/suppress/expect_exception_suppresses_checked_error.ts] ////

//// [expect_exception_suppresses_checked_error.ts]
async function fail() {
    throw new Error("x");
}
async function ignoreThrowsSuppressesRejection() {
    // @ts-expect-exception
    await fail();
}


//// [expect_exception_suppresses_checked_error.js]
"use strict";
async function fail() {
    throw new Error("x");
}
async function ignoreThrowsSuppressesRejection() {
    // @ts-expect-exception
    await fail();
}

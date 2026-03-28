//// [tests/cases/compiler/checkedErrors/suppress/expect_exception_does_not_suppress_type_error.ts] ////

//// [expect_exception_does_not_suppress_type_error.ts]
async function fail() {
    throw new Error("x");
}
async function ignoreThrowsDoesNotSuppressTypeError() {
    // @ts-expect-exception
    const x: number = await fail();
}


//// [expect_exception_does_not_suppress_type_error.js]
"use strict";
async function fail() {
    throw new Error("x");
}
async function ignoreThrowsDoesNotSuppressTypeError() {
    // @ts-expect-exception
    const x = await fail();
}

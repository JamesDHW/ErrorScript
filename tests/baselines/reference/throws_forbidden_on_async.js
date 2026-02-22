//// [tests/cases/compiler/checkedThrows/decl/throws_forbidden_on_async.ts] ////

//// [throws_forbidden_on_async.ts]
async function illegalAsyncThrows(): Promise<void> throws Error {
    return;
}


//// [throws_forbidden_on_async.js]
"use strict";
async function illegalAsyncThrows() {
    return;
}

//// [tests/cases/compiler/checkedErrors/combinators/promise_reject_requires_handling.ts] ////

//// [promise_reject_requires_handling.ts]
async function rejectRequiresHandling() {
    await Promise.reject(new Error("reject"));
}


//// [promise_reject_requires_handling.js]
"use strict";
async function rejectRequiresHandling() {
    await Promise.reject(new Error("reject"));
}

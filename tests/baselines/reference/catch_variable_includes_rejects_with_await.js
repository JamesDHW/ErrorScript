//// [tests/cases/compiler/checkedErrors/try/catch_variable_includes_rejects_with_await.ts] ////

//// [catch_variable_includes_rejects_with_await.ts]
class RejectTimeError extends Error { readonly kind = "RejectTimeError"; }
declare function acceptRejectTimeError(e: RejectTimeError): void;
async function rejectingPromise() {
    throw new RejectTimeError("reject");
}
async function withAwait() {
    try {
        await rejectingPromise();
    } catch (e) {
        acceptRejectTimeError(e);
    }
}


//// [catch_variable_includes_rejects_with_await.js]
"use strict";
class RejectTimeError extends Error {
    kind = "RejectTimeError";
}
async function rejectingPromise() {
    throw new RejectTimeError("reject");
}
async function withAwait() {
    try {
        await rejectingPromise();
    }
    catch (e) {
        acceptRejectTimeError(e);
    }
}

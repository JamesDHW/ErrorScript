//// [tests/cases/compiler/checkedThrows/both/void_does_not_suppress_throw.ts] ////

//// [void_does_not_suppress_throw.ts]
class CallTimeError extends Error { readonly kind = "CallTimeError"; }
class RejectTimeError extends Error { readonly kind = "RejectTimeError"; }

function promiseFnBoth() {
    if (Math.random() > 0.5) {
        throw new CallTimeError("thrown before returning promise");
    }
    return Promise.reject(new RejectTimeError("rejected after returning promise"));
}
void promiseFnBoth();


//// [void_does_not_suppress_throw.js]
"use strict";
class CallTimeError extends Error {
    kind = "CallTimeError";
}
class RejectTimeError extends Error {
    kind = "RejectTimeError";
}
function promiseFnBoth() {
    if (Math.random() > 0.5) {
        throw new CallTimeError("thrown before returning promise");
    }
    return Promise.reject(new RejectTimeError("rejected after returning promise"));
}
void promiseFnBoth();

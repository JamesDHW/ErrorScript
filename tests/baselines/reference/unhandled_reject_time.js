//// [tests/cases/compiler/checkedErrors/both/unhandled_reject_time.ts] ////

//// [unhandled_reject_time.ts]
class CallTimeError extends Error { readonly kind = "CallTimeError"; }
class RejectTimeError extends Error { readonly kind = "RejectTimeError"; }

function promiseFnBoth() {
    return Promise.reject(new RejectTimeError("rejected after returning promise"));
}
try {
    promiseFnBoth();
} catch (e) {
    if (e instanceof CallTimeError) { }
}


//// [unhandled_reject_time.js]
"use strict";
class CallTimeError extends Error {
    kind = "CallTimeError";
}
class RejectTimeError extends Error {
    kind = "RejectTimeError";
}
function promiseFnBoth() {
    return Promise.reject(new RejectTimeError("rejected after returning promise"));
}
try {
    promiseFnBoth();
}
catch (e) {
    if (e instanceof CallTimeError) { }
}

//// [tests/cases/compiler/checkedErrors/both/try_does_not_handle_reject.ts] ////

//// [try_does_not_handle_reject.ts]
class CallTimeError extends Error { readonly kind = "CallTimeError"; }
class RejectTimeError extends Error { readonly kind = "RejectTimeError"; }

function promiseFnBoth() {
    if (Math.random() > 0.5) {
        throw new CallTimeError("thrown before returning promise");
    }
    return Promise.reject(new RejectTimeError("rejected after returning promise"));
}
try {
    promiseFnBoth();
} catch (e) {
    if (e instanceof CallTimeError) { }
}


//// [try_does_not_handle_reject.js]
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
try {
    promiseFnBoth();
}
catch (e) {
    if (e instanceof CallTimeError) { }
}

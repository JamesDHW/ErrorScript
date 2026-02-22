//// [tests/cases/compiler/checkedErrors/typing/promise_catch_param_is_rejects.ts] ////

//// [promise_catch_param_is_rejects.ts]
class RejectTimeError extends Error { readonly kind = "RejectTimeError"; }
declare function acceptRejectTimeError(e: RejectTimeError): void;
function promiseFnBoth() {
    return Promise.reject(new RejectTimeError("rejected after returning promise"));
}
try {
    promiseFnBoth().catch(e => acceptRejectTimeError(e));
} catch (e) { }


//// [promise_catch_param_is_rejects.js]
"use strict";
class RejectTimeError extends Error {
    kind = "RejectTimeError";
}
function promiseFnBoth() {
    return Promise.reject(new RejectTimeError("rejected after returning promise"));
}
try {
    promiseFnBoth().catch(e => acceptRejectTimeError(e));
}
catch (e) { }

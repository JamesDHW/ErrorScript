//// [tests/cases/compiler/checkedErrors/typing/promise_catch_param_excludes_throws.ts] ////

//// [promise_catch_param_excludes_throws.ts]
class CallTimeError extends Error { readonly kind = "CallTimeError"; }
class RejectTimeError extends Error { readonly kind = "RejectTimeError"; }
declare function acceptCallTimeError(e: CallTimeError): void;
function promiseFnBoth() {
    if (Math.random() > 0.5) {
        throw new CallTimeError("thrown before returning promise");
    }
    return Promise.reject(new RejectTimeError("rejected after returning promise"));
}
try {
    promiseFnBoth().catch(e => acceptCallTimeError(e));
} catch (e) { }


//// [promise_catch_param_excludes_throws.js]
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
    promiseFnBoth().catch(e => acceptCallTimeError(e));
}
catch (e) { }

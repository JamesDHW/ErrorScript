//// [tests/cases/compiler/checkedThrows/both/await_without_handling_reports_throw.ts] ////

//// [await_without_handling_reports_throw.ts]
// Sync throw unhandled; rejection handled by .catch => TS18063 only

class CallTimeError extends Error { readonly kind = "CallTimeError"; }
class RejectTimeError extends Error { readonly kind = "RejectTimeError"; }

function promiseFnBoth() {
    if (Math.random() > 0.5) {
        throw new CallTimeError("thrown before returning promise");
    }
    return Promise.reject(new RejectTimeError("rejected after returning promise"));
}
promiseFnBoth().catch(() => { });


//// [await_without_handling_reports_throw.js]
"use strict";
// Sync throw unhandled; rejection handled by .catch => TS18063 only
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
promiseFnBoth().catch(() => { });

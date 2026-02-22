// @checkedErrors: true
// Rejection unhandled; sync throw handled by try/catch => TS18064 only

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

// @checkedErrors: true

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

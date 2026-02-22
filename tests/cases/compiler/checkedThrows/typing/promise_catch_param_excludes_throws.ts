// @checkedThrows: true

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

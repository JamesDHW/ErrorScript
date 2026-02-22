// @checkedThrows: true

class RejectTimeError extends Error { readonly kind = "RejectTimeError"; }
declare function acceptRejectTimeError(e: RejectTimeError): void;
function promiseFnBoth() {
    return Promise.reject(new RejectTimeError("rejected after returning promise"));
}
try {
    promiseFnBoth().then(() => { }, e => acceptRejectTimeError(e));
} catch (e) { }

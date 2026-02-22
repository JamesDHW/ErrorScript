// @checkedThrows: true

class RejectTimeError extends Error { readonly kind = "RejectTimeError"; }
declare function acceptRejectTimeError(e: RejectTimeError): void;
async function rejectingPromise() {
    throw new RejectTimeError("reject");
}
async function withAwait() {
    try {
        await rejectingPromise();
    } catch (e) {
        acceptRejectTimeError(e);
    }
}

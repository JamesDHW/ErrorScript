// @checkedThrows: true

class CallTimeError extends Error { readonly kind = "CallTimeError"; }
class RejectTimeError extends Error { readonly kind = "RejectTimeError"; }

declare function acceptCallTimeError(e: CallTimeError): void;
declare function acceptRejectTimeError(e: RejectTimeError): void;

function promiseFnBoth() {
    if (Math.random() > 0.5) {
        throw new CallTimeError("thrown before returning promise");
    }
    return Promise.reject(new RejectTimeError("rejected after returning promise"));
}
async function awaitHandlesBothChannels() {
    try {
        await promiseFnBoth();
    } catch (e) {
        acceptCallTimeError(e);
        acceptRejectTimeError(e);
    }
}

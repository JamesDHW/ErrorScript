// @checkedErrors: true

class CallTimeError extends Error { readonly kind = "CallTimeError"; }
class RejectTimeError extends Error { readonly kind = "RejectTimeError"; }

function mkBoth1() {
    if (Math.random() > 0.5) throw new CallTimeError("A");
    return Promise.reject(new RejectTimeError("A"));
}
function mkBoth2() {
    if (Math.random() > 0.5) throw new CallTimeError("B");
    return Promise.reject(new RejectTimeError("B"));
}
async function allWithBoth() {
    try {
        await Promise.all([mkBoth1(), mkBoth2()]);
    } catch (e) {
        if (e instanceof RejectTimeError) { }
    }
}

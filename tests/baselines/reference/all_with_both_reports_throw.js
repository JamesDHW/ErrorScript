//// [tests/cases/compiler/checkedThrows/combinators/all_with_both_reports_throw.ts] ////

//// [all_with_both_reports_throw.ts]
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


//// [all_with_both_reports_throw.js]
"use strict";
class CallTimeError extends Error {
    kind = "CallTimeError";
}
class RejectTimeError extends Error {
    kind = "RejectTimeError";
}
function mkBoth1() {
    if (Math.random() > 0.5)
        throw new CallTimeError("A");
    return Promise.reject(new RejectTimeError("A"));
}
function mkBoth2() {
    if (Math.random() > 0.5)
        throw new CallTimeError("B");
    return Promise.reject(new RejectTimeError("B"));
}
async function allWithBoth() {
    try {
        await Promise.all([mkBoth1(), mkBoth2()]);
    }
    catch (e) {
        if (e instanceof RejectTimeError) { }
    }
}

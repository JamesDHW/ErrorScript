//// [tests/cases/compiler/checkedThrows/try/catch_variable_excludes_rejects_without_await.ts] ////

//// [catch_variable_excludes_rejects_without_await.ts]
async function rejectingPromise() {
    throw new Error("reject");
}
try {
    rejectingPromise();
} catch (e) {
}


//// [catch_variable_excludes_rejects_without_await.js]
"use strict";
async function rejectingPromise() {
    throw new Error("reject");
}
try {
    rejectingPromise();
}
catch (e) {
}

//// [tests/cases/compiler/checkedThrows/decl/rejects_requires_promise_like.ts] ////

//// [rejects_requires_promise_like.ts]
function illegalSyncRejects(): number rejects Error {
    return 1;
}


//// [rejects_requires_promise_like.js]
"use strict";
function illegalSyncRejects() {
    return 1;
}

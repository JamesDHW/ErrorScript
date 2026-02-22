//// [tests/cases/compiler/checkedThrows/decl/impl_rejects_wider_than_declared_errors.ts] ////

//// [impl_rejects_wider_than_declared_errors.ts]
declare function g(): Promise<number> rejects TypeError;
async function unhandledReject() {
    await g();
}


//// [impl_rejects_wider_than_declared_errors.js]
"use strict";
async function unhandledReject() {
    await g();
}

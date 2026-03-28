//// [tests/cases/compiler/checkedErrors/overloads/overload_async_rejects_enforced.ts] ////

//// [overload_async_rejects_enforced.ts]
declare function overload(x: string): number throws Error;
declare function overload(x: number): Promise<number> rejects TypeError;
async function unhandledOverload() {
    await overload(1);
}


//// [overload_async_rejects_enforced.js]
"use strict";
async function unhandledOverload() {
    await overload(1);
}

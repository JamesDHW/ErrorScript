//// [tests/cases/compiler/checkedErrors/overloads/overload_sync_throws_enforced.ts] ////

//// [overload_sync_throws_enforced.ts]
declare function overload(x: string): number throws Error;
declare function overload(x: number): Promise<number> rejects TypeError;
overload("a");


//// [overload_sync_throws_enforced.js]
"use strict";
overload("a");

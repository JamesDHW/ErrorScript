//// [tests/cases/compiler/checkedErrors/decl/impl_throws_wider_than_declared_errors.ts] ////

//// [impl_throws_wider_than_declared_errors.ts]
function implThrowsNarrower(): number throws RangeError {
    throw new TypeError("x");
}


//// [impl_throws_wider_than_declared_errors.js]
"use strict";
function implThrowsNarrower() {
    throw new TypeError("x");
}

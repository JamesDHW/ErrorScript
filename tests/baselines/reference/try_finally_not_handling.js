//// [tests/cases/compiler/checkedErrors/throws/try_finally_not_handling.ts] ////

//// [try_finally_not_handling.ts]
function boom() {
    throw new Error("x");
}
try {
    boom();
} finally {
}


//// [try_finally_not_handling.js]
"use strict";
function boom() {
    throw new Error("x");
}
try {
    boom();
}
finally {
}

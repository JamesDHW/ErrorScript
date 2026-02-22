//// [tests/cases/compiler/checkedThrows/typing/catch_variable_is_throws_union.ts] ////

//// [catch_variable_is_throws_union.ts]
class E1 extends Error { readonly kind = "E1"; }
declare function acceptE1(e: E1): void;
function throwsE1() {
    throw new E1("e1");
}
try {
    throwsE1();
} catch (e) {
    acceptE1(e);
}


//// [catch_variable_is_throws_union.js]
"use strict";
class E1 extends Error {
    kind = "E1";
}
function throwsE1() {
    throw new E1("e1");
}
try {
    throwsE1();
}
catch (e) {
    acceptE1(e);
}

// @checkedErrors: true

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

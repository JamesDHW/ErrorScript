// @checkedThrows: true

function r1() {
    r2();
}
function r2() {
    r1();
    throw new Error("x");
}
r1();

// @checkedThrows: true

function inner() {
    throw 123;
}
function outer() {
    inner();
}
outer();

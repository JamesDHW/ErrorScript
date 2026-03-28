// @checkedErrors: true

function boom2() {
    throw new Error("x");
}
boom2();

try {
    boom2();
} catch (e) {
    e.message;
}

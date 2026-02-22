// @checkedThrows: true

function boom() {
    throw new Error("x");
}
try {
    boom();
} catch (e) {
    e.message;
}

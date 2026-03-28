// @checkedErrors: true

function boom() {
    throw new Error("x");
}
try {
    boom();
} finally {
}

// @checkedErrors: true

function boom() {
    throw new Error("x");
}
function c() {
    try {
        boom();
    } catch (e) {
        throw e;
    }
}
c();

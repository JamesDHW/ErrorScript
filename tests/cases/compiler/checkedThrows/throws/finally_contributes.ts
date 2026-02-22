// @checkedThrows: true

function boom() {
    throw new Error("x");
}
function withFinally() {
    try {
        boom();
    } catch (e) {
    } finally {
        throw "finally";
    }
}
withFinally();

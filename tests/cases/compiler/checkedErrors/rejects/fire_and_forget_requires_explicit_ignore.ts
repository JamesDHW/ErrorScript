// @checkedErrors: true

async function boom() {
    throw new Error("x");
}
function fireAndForget() {
    boom();
}

// @checkedErrors: true

async function boom() {
    throw new Error("x");
}
async function awaitRequiresHandling() {
    await boom();
}

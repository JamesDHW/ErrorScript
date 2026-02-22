// @checkedThrows: true

async function boom() {
    throw new Error("x");
}
async function tryHandlesAwaitedRejection() {
    try {
        await boom();
    } catch (e) {
        e.message;
    }
}

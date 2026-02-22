// @checkedThrows: true

async function rejectingPromise() {
    throw new Error("reject");
}
try {
    rejectingPromise();
} catch (e) {
}

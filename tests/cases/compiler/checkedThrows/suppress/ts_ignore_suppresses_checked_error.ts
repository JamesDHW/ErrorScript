// @checkedThrows: true

async function fail() {
    throw new Error("x");
}
async function tsIgnoreSuppressesAll() {
    // @ts-ignore
    await fail();
}

// @checkedThrows: true

async function fail() {
    throw new Error("x");
}
async function ignoreThrowsSuppressesRejection() {
    // @ts-expect-exception
    await fail();
}

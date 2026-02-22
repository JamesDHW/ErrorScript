// @checkedThrows: true

async function fail() {
    throw new Error("x");
}
async function ignoreThrowsDoesNotSuppressTypeError() {
    // @ts-expect-exception
    const x: number = await fail();
}

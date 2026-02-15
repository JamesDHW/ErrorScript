// @checkedThrows: true

async function fail() {
    throw new Error("x");
}

async function ignoreThrowsSuppressesRejection() {
    // @ts-expect-exception
    await fail();
}

async function ignoreThrowsDoesNotSuppressTypeError() {
    // @ts-expect-exception
    const x: number = await fail();
}

function ignoreThrowsSuppressesSyncThrow() {
    function throws() {
        throw "sync";
    }
    // @ts-expect-exception
    throws();
}

async function tsIgnoreSuppressesAll() {
    // @ts-ignore
    await fail();
}

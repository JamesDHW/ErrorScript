// @checkedThrows: true

async function boom() {
    throw new Error("x");
}

async function awaitRequiresHandling() {
    await boom();
}

async function tryHandlesAwaitedRejection() {
    try {
        await boom();
    } catch (e) {
        e.message;
    }
}

function fireAndForget() {
    boom();
    void boom();
    boom().catch(() => {});
}

function wrap() {
    return boom();
}

async function wrapperPropagation() {
    await wrap();
}

async function a() {
    throw "a";
}
async function b() {
    throw 123;
}
async function promiseAllUnion() {
    await Promise.all([a(), b()]);
}

JSON.parse("{");

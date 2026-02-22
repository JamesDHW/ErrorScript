// @checkedThrows: true

async function a() {
    throw "a";
}
async function b() {
    throw 123;
}
async function allSettledNoHandlingRequired() {
    await Promise.allSettled([a(), b()]);
}

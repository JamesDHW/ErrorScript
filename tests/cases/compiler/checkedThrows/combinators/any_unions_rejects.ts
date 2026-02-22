// @checkedThrows: true

async function a() {
    throw "a";
}
async function b() {
    throw 123;
}
async function anyRequiresHandling() {
    await Promise.any([a(), b()]);
}

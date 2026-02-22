// @checkedThrows: true

async function a() {
    throw "a";
}
async function b() {
    throw 123;
}
async function raceRequiresHandling() {
    await Promise.race([a(), b()]);
}

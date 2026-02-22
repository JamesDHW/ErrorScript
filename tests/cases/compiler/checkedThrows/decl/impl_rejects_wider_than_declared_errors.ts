// @checkedThrows: true

declare function g(): Promise<number> rejects TypeError;
async function unhandledReject() {
    await g();
}

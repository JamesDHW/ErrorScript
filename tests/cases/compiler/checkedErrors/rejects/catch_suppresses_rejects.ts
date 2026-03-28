// @checkedErrors: true

async function boom() {
    throw new Error("x");
}
boom().catch(() => {});

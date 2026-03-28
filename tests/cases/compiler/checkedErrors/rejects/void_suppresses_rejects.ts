// @checkedErrors: true

async function boom() {
    throw new Error("x");
}
void boom();

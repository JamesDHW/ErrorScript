// @checkedErrors: true

async function rejectRequiresHandling() {
    await Promise.reject(new Error("reject"));
}

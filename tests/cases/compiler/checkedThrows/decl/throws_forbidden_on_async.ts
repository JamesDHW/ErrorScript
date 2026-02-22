// @checkedThrows: true

async function illegalAsyncThrows(): Promise<void> throws Error {
    return;
}

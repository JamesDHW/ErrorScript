// @checkedThrows: true

function boom3() {
    throw new Error("x");
}

function c() {
    try {
        boom3();
    } catch (e) {
        throw e;
    }
}
c();

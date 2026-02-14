// @checkedThrows: true

function boom() {
    throw new Error("x");
}

function a() {
    boom();
}

function b() {
    try {
        a();
    } catch (e) { }
}

b();

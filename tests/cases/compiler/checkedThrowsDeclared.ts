// @checkedThrows: true

function withThrows(): number throws Error {
    return 1;
}

declare function declaredThrows(): number throws RangeError;

withThrows();

declare function f(): number throws RangeError;
f();

try {
    f();
} catch (e) {
    e;
}

function implThrowsStricter(): number throws Error {
    throw new TypeError("x");
}

function implThrowsNarrower(): number throws RangeError {
    throw new TypeError("x");
}

declare function g(): Promise<number> rejects TypeError;

async function unhandledReject() {
    await g();
}

async function tryHandlesReject() {
    try {
        await g();
    } catch (e) {
        e;
    }
}

function fireAndForgetDeclared() {
    g();
    void g();
    g().catch(() => {});
}

declare function badRejects(): number rejects Error;

declare function badThrows(): Promise<number> throws Error;

function declaredWiderThanImpl(): number throws Error {
    throw new RangeError("x");
}

declare function overload(x: string): number throws Error;
declare function overload(x: number): Promise<number> rejects TypeError;
try {
    overload("a");
} catch (e) {
    e;
}

async function unhandledOverload() {
    await overload(1);
}

type Fn = (x: string) => number throws Error;
const fn: Fn = (x: string): number throws Error => {
    throw new Error(x);
};
try {
    fn("");
} catch (e) {
    e;
}

interface X {
    m(): number throws Error;
}
const o: X = {
    m(): number throws Error {
        throw new Error("");
    },
};
try {
    o.m();
} catch (e) {
    e;
}

// @checkedThrows: true

function assertNever(x: never): never {
    throw new Error(`unreachable: ${x}`);
}

type A = { kind: "a"; value: number };
type B = { kind: "b"; value: string };

function exhaustiveSwitch(x: A | B): number {
    switch (x.kind) {
        case "a": return x.value;
        case "b": return x.value.length;
        default: assertNever(x);
    }
}

class ParseError extends Error { }
class ValidationError extends Error { }

function catchThenAssertNever(input: string): number {
    try {
        if (!input) throw new ParseError("empty");
        const n = parseInt(input, 10);
        if (Number.isNaN(n)) throw new ValidationError("nan");
        return n;
    } catch (e) {
        if (e instanceof ParseError) return 0;
        if (e instanceof ValidationError) return 1;
        assertNever(e);
    }
}

catchThenAssertNever("123");

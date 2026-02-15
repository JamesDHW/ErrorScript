// @checkedThrows: true

class ParseError extends Error {
    constructor(message: string) { super(message); }
}
class ValidationError extends Error {
    constructor(message: string) { super(message); }
}

function throwingCall(s: string): number {
    if (!s) throw new ParseError("empty");
    const n = parseInt(s, 10);
    if (Number.isNaN(n)) throw new ValidationError("not a number");
    return n;
}

function catchVariableFromInitializer(input: string): number {
    try {
        const x = throwingCall(input);
        return x;
    } catch (e) {
        if (e instanceof ParseError) return 0;
        if (e instanceof ValidationError) return 1;
        throw e;
    }
}

catchVariableFromInitializer("123");

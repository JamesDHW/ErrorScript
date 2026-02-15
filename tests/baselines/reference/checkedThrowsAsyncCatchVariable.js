//// [tests/cases/compiler/checkedThrowsAsyncCatchVariable.ts] ////

//// [checkedThrowsAsyncCatchVariable.ts]
class NetworkError extends Error { }
class StorageError extends Error { }
class ParseError extends Error { }
class ValidationError extends Error { }

declare function fetchJson(url: string): Promise<string> rejects NetworkError;
declare function readFromDisk(path: string): string throws StorageError;

function readConfig(raw: string) {
    const obj = JSON.parse(raw); // EXPECT: throws SyntaxError (stdlib)
    if (typeof obj !== "object" || obj === null) throw new ParseError("not an object");
    return obj as Record<string, unknown>;
}

async function loadConfig(remote: boolean) {
    if (remote) {
        const text = await fetchJson("https://cfg");
        return readConfig(text);
    }
    const local = readFromDisk("config.json");
    return readConfig(local);
}

loadConfig(true);

async function demoLoadConfigHandled() {
    try {
        const c = await loadConfig(true);
        return c;
    } catch (e) {
        if (e instanceof NetworkError) return {};
        if (e instanceof StorageError) return {};
        if (e instanceof SyntaxError) return {};
        if (e instanceof ParseError) return {};
        assertNever(e);
    }
}

function assertNever(x: never): never {
    throw new Error(`unreachable: ${x}`);
}

demoLoadConfigHandled();

//// [checkedThrowsAsyncCatchVariable.js]
"use strict";
class NetworkError extends Error {
}
class StorageError extends Error {
}
class ParseError extends Error {
}
class ValidationError extends Error {
}
function readConfig(raw) {
    const obj = JSON.parse(raw); // EXPECT: throws SyntaxError (stdlib)
    if (typeof obj !== "object" || obj === null)
        throw new ParseError("not an object");
    return obj;
}
async function loadConfig(remote) {
    if (remote) {
        const text = await fetchJson("https://cfg");
        return readConfig(text);
    }
    const local = readFromDisk("config.json");
    return readConfig(local);
}
loadConfig(true);
async function demoLoadConfigHandled() {
    try {
        const c = await loadConfig(true);
        return c;
    }
    catch (e) {
        if (e instanceof NetworkError)
            return {};
        if (e instanceof StorageError)
            return {};
        if (e instanceof SyntaxError)
            return {};
        if (e instanceof ParseError)
            return {};
        assertNever(e);
    }
}
function assertNever(x) {
    throw new Error(`unreachable: ${x}`);
}
demoLoadConfigHandled();

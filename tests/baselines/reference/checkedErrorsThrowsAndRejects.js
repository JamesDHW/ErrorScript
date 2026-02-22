//// [tests/cases/compiler/checkedErrorsThrowsAndRejects.ts] ////

//// [checkedErrorsThrowsAndRejects.ts]
/* Sync = throws only; async = rejects only; non-async Promise-returning = both throws and rejects. */

class CallTimeError extends Error { readonly kind = "CallTimeError"; }
class RejectTimeError extends Error { readonly kind = "RejectTimeError"; }
class BothErrorA extends Error { readonly kind = "BothErrorA"; }
class BothErrorB extends Error { readonly kind = "BothErrorB"; }

function syncThrowsA() {
    throw new CallTimeError("sync throw");
}

syncThrowsA();

try {
    syncThrowsA();
} catch (e) {
    if (e instanceof CallTimeError) { }
}

async function asyncRejectsEarly() {
    throw new RejectTimeError("async throw becomes rejection");
}

asyncRejectsEarly();

void asyncRejectsEarly();

asyncRejectsEarly().catch(() => { });

async function handlesAsyncReject() {
    try {
        await asyncRejectsEarly();
    } catch (e) {
        if (e instanceof RejectTimeError) { }
    }
}
void handlesAsyncReject();

function promiseFnBoth() {
    if (Math.random() > 0.5) {
        throw new CallTimeError("thrown before returning promise");
    }
    return Promise.reject(new RejectTimeError("rejected after returning promise"));
}

promiseFnBoth();

void promiseFnBoth();

promiseFnBoth().catch(() => { });

try {
    promiseFnBoth();
} catch (e) {
    if (e instanceof CallTimeError) { }
}

try {
    promiseFnBoth().catch(() => { });
} catch (e) {
    if (e instanceof CallTimeError) { }
}

try {
    void promiseFnBoth();
} catch (e) {
    if (e instanceof CallTimeError) { }
}

async function awaitHandlesBothChannels() {
    try {
        await promiseFnBoth();
    } catch (e) {
        if (e instanceof CallTimeError) { }
        if (e instanceof RejectTimeError) { }
    }
}
void awaitHandlesBothChannels();

async function awaitWithoutHandling() {
    await promiseFnBoth();
}
void awaitWithoutHandling();

function wrapperReturnsPromise() {
    return promiseFnBoth();
}

wrapperReturnsPromise();

async function asyncWrapper() {
    return await promiseFnBoth();
}

asyncWrapper();

async function handleAsyncWrapper() {
    try {
        await asyncWrapper();
    } catch (e) {
        if (e instanceof CallTimeError) { }
        if (e instanceof RejectTimeError) { }
    }
}
void handleAsyncWrapper();

declare function declaredBoth(): Promise<number> throws BothErrorA rejects BothErrorB;

declaredBoth();

declaredBoth().catch(() => { });

void declaredBoth();

try {
    declaredBoth();
} catch (e) {
    if (e instanceof BothErrorA) { }
}

async function handleDeclaredBoth() {
    try {
        await declaredBoth();
    } catch (e) {
        if (e instanceof BothErrorA) { }
        if (e instanceof BothErrorB) { }
    }
}
void handleDeclaredBoth();

async function illegalAsyncThrows(): Promise<void> throws Error {
    return;
}

function illegalSyncRejects(): number rejects Error {
    return 1;
}

function mkBoth1() {
    if (Math.random() > 0.5) throw new CallTimeError("A");
    return Promise.reject(new RejectTimeError("A"));
}
function mkBoth2() {
    if (Math.random() > 0.5) throw new CallTimeError("B");
    return Promise.reject(new RejectTimeError("B"));
}

async function allWithBoth() {
    await Promise.all([mkBoth1(), mkBoth2()]);
}
void allWithBoth();

async function allWithBothHandled() {
    try {
        await Promise.all([mkBoth1(), mkBoth2()]);
    } catch (e) {
        if (e instanceof CallTimeError) { }
        if (e instanceof RejectTimeError) { }
    }
}
void allWithBothHandled();

function demoCatchTypingForBoth() {
    try {
        promiseFnBoth().catch(() => { });
    } catch (e) {
        if (e instanceof CallTimeError) { }
    }
}

promiseFnBoth().catch(e => {
    if (e instanceof RejectTimeError) { }
});

promiseFnBoth().then(() => { }, e => {
    if (e instanceof RejectTimeError) { }
});

declaredBoth().catch(e => {
    if (e instanceof BothErrorB) { }
});

asyncRejectsEarly().catch(e => {
    if (e instanceof RejectTimeError) { }
});

function assertRejectTimeError(e: RejectTimeError): asserts e is RejectTimeError { }

promiseFnBoth().catch((e) => {
    assertRejectTimeError(e);
});


//// [checkedErrorsThrowsAndRejects.js]
"use strict";
/* Sync = throws only; async = rejects only; non-async Promise-returning = both throws and rejects. */
class CallTimeError extends Error {
    kind = "CallTimeError";
}
class RejectTimeError extends Error {
    kind = "RejectTimeError";
}
class BothErrorA extends Error {
    kind = "BothErrorA";
}
class BothErrorB extends Error {
    kind = "BothErrorB";
}
function syncThrowsA() {
    throw new CallTimeError("sync throw");
}
syncThrowsA();
try {
    syncThrowsA();
}
catch (e) {
    if (e instanceof CallTimeError) { }
}
async function asyncRejectsEarly() {
    throw new RejectTimeError("async throw becomes rejection");
}
asyncRejectsEarly();
void asyncRejectsEarly();
asyncRejectsEarly().catch(() => { });
async function handlesAsyncReject() {
    try {
        await asyncRejectsEarly();
    }
    catch (e) {
        if (e instanceof RejectTimeError) { }
    }
}
void handlesAsyncReject();
function promiseFnBoth() {
    if (Math.random() > 0.5) {
        throw new CallTimeError("thrown before returning promise");
    }
    return Promise.reject(new RejectTimeError("rejected after returning promise"));
}
promiseFnBoth();
void promiseFnBoth();
promiseFnBoth().catch(() => { });
try {
    promiseFnBoth();
}
catch (e) {
    if (e instanceof CallTimeError) { }
}
try {
    promiseFnBoth().catch(() => { });
}
catch (e) {
    if (e instanceof CallTimeError) { }
}
try {
    void promiseFnBoth();
}
catch (e) {
    if (e instanceof CallTimeError) { }
}
async function awaitHandlesBothChannels() {
    try {
        await promiseFnBoth();
    }
    catch (e) {
        if (e instanceof CallTimeError) { }
        if (e instanceof RejectTimeError) { }
    }
}
void awaitHandlesBothChannels();
async function awaitWithoutHandling() {
    await promiseFnBoth();
}
void awaitWithoutHandling();
function wrapperReturnsPromise() {
    return promiseFnBoth();
}
wrapperReturnsPromise();
async function asyncWrapper() {
    return await promiseFnBoth();
}
asyncWrapper();
async function handleAsyncWrapper() {
    try {
        await asyncWrapper();
    }
    catch (e) {
        if (e instanceof CallTimeError) { }
        if (e instanceof RejectTimeError) { }
    }
}
void handleAsyncWrapper();
declaredBoth();
declaredBoth().catch(() => { });
void declaredBoth();
try {
    declaredBoth();
}
catch (e) {
    if (e instanceof BothErrorA) { }
}
async function handleDeclaredBoth() {
    try {
        await declaredBoth();
    }
    catch (e) {
        if (e instanceof BothErrorA) { }
        if (e instanceof BothErrorB) { }
    }
}
void handleDeclaredBoth();
async function illegalAsyncThrows() {
    return;
}
function illegalSyncRejects() {
    return 1;
}
function mkBoth1() {
    if (Math.random() > 0.5)
        throw new CallTimeError("A");
    return Promise.reject(new RejectTimeError("A"));
}
function mkBoth2() {
    if (Math.random() > 0.5)
        throw new CallTimeError("B");
    return Promise.reject(new RejectTimeError("B"));
}
async function allWithBoth() {
    await Promise.all([mkBoth1(), mkBoth2()]);
}
void allWithBoth();
async function allWithBothHandled() {
    try {
        await Promise.all([mkBoth1(), mkBoth2()]);
    }
    catch (e) {
        if (e instanceof CallTimeError) { }
        if (e instanceof RejectTimeError) { }
    }
}
void allWithBothHandled();
function demoCatchTypingForBoth() {
    try {
        promiseFnBoth().catch(() => { });
    }
    catch (e) {
        if (e instanceof CallTimeError) { }
    }
}
promiseFnBoth().catch(e => {
    if (e instanceof RejectTimeError) { }
});
promiseFnBoth().then(() => { }, e => {
    if (e instanceof RejectTimeError) { }
});
declaredBoth().catch(e => {
    if (e instanceof BothErrorB) { }
});
asyncRejectsEarly().catch(e => {
    if (e instanceof RejectTimeError) { }
});
function assertRejectTimeError(e) { }
promiseFnBoth().catch((e) => {
    assertRejectTimeError(e);
});

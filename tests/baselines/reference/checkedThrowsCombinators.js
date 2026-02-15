//// [tests/cases/compiler/checkedThrowsCombinators.ts] ////

//// [checkedThrowsCombinators.ts]
async function a() {
    throw "a";
}
async function b() {
    throw 123;
}

async function raceRequiresHandling() {
    await Promise.race([a(), b()]);
}

async function anyRequiresHandling() {
    await Promise.any([a(), b()]);
}

async function allSettledNoHandlingRequired() {
    await Promise.allSettled([a(), b()]);
}

async function rejectRequiresHandling() {
    await Promise.reject(new Error("reject"));
}


//// [checkedThrowsCombinators.js]
"use strict";
async function a() {
    throw "a";
}
async function b() {
    throw 123;
}
async function raceRequiresHandling() {
    await Promise.race([a(), b()]);
}
async function anyRequiresHandling() {
    await Promise.any([a(), b()]);
}
async function allSettledNoHandlingRequired() {
    await Promise.allSettled([a(), b()]);
}
async function rejectRequiresHandling() {
    await Promise.reject(new Error("reject"));
}

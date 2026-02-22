//// [tests/cases/compiler/checkedThrows/combinators/race_unions_rejects.ts] ////

//// [race_unions_rejects.ts]
async function a() {
    throw "a";
}
async function b() {
    throw 123;
}
async function raceRequiresHandling() {
    await Promise.race([a(), b()]);
}


//// [race_unions_rejects.js]
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

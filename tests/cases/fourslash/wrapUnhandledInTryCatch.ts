/// <reference path='fourslash.ts' />

// @checkedThrows: true
//// function boom() {
////     throw new Error("x");
//// }
//// boom();

verify.codeFix({
    description: ts.Diagnostics.Wrap_in_try_Slashcatch.message,
    errorCode: ts.Diagnostics.Unhandled_thrown_type_Colon_0.code,
    newFileContent: `function boom() {
    throw new Error("x");
}
try {
    boom();
} catch (e) { }`,
});

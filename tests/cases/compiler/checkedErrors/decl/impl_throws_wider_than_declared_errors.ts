// @checkedErrors: true

function implThrowsNarrower(): number throws RangeError {
    throw new TypeError("x");
}

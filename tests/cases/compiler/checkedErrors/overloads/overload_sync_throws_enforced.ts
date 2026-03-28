// @checkedErrors: true

declare function overload(x: string): number throws Error;
declare function overload(x: number): Promise<number> rejects TypeError;
overload("a");

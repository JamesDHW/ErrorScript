# Milestone 3: Declaration-site throws / rejects

## Goal

Add first-class declaration-site effect contracts to TypeScript via new syntax:

- **`throws <Type>`** — for synchronous exceptions
- **`rejects <Type>`** — for promise rejections

These must work in `.d.ts` and `.ts`, integrate with call-site checking, and (optionally) validate against implementation bodies in `.ts`.

This milestone removes reliance on curated “throw maps” for ecosystem boundaries: `.d.ts` authors can express contracts directly.

## Specification

### 1) Syntax

#### 1.1 Where clauses can appear

Support on any signature-like construct that has a return type annotation:

- Function declarations
- Method declarations (class/interface/type literal)
- Function expressions / arrow functions only if they have an explicit return type annotation (optional for PoC; you can restrict to declarations + methods)
- Constructor signatures: **not supported** (no return type; out of scope for M3)
- Call/construct signatures in type literals / interfaces
- Overload signatures

#### 1.2 Grammar shape

After return type:

```ts
function f(): R throws E { ... }
function g(): Promise<R> rejects E { ... }
```

In `.d.ts`:

```ts
declare function f(): R throws E;
interface X { m(): R throws E; }
type Fn = (x: string) => R throws E;
```

#### 1.3 Mutual exclusivity

For Milestone 3 (PoC), enforce:

- A signature may have at most one of `throws` or `rejects`.
- Using both is a parse error or grammar disallow.

#### 1.4 Type after clause

`E` is a normal TypeNode. It may be: union, intersection, generic instantiation, etc.

### 2) Semantics: where effect types come from

Define for a resolved call signature `S`:

- `declThrows(S)` = declared thrown type from `throws` clause, or absent
- `declRejects(S)` = declared rejection type from `rejects` clause, or absent
- `infThrows(S)` = inferred thrown type from body analysis (existing M1)
- `infRejects(S)` = inferred rejection type from body analysis (existing M2)

#### 2.1 Call-site “effective effects” (the source of truth)

At call sites, compute effective effects as:

- **If `declThrows(S)` exists** ⇒ `effectiveThrows = declThrows(S)` (ignore inference for call-site)
- **Else** ⇒ `effectiveThrows = infThrows(S)`

Similarly for promise-producing calls:

- **If `declRejects(S)` exists** ⇒ `effectiveRejects = declRejects(S)`
- **Else** ⇒ `effectiveRejects = infRejects(S)`

Rationale: declaration is the explicit contract; inference is fallback.

#### 2.2 Basic correctness constraints (diagnostics)

When `--checkedThrows` is enabled:

- If `rejects E` is used on a signature whose return type is **not** `PromiseLike<…>` ⇒ diagnostic (new error)
- If `throws E` is used on a signature whose return type **is** `PromiseLike<…>` ⇒ Milestone 3 requirement: make it an error (clearer separation). (If you want to allow it later as “rejects on await”, do that in a later milestone.)

So:

- **`throws`** requires non-promise return type
- **`rejects`** requires promise-like return type

Define “promise-like” using existing TS logic (`isThenableType` or your existing reject-effect detection); keep it consistent with M2.

### 3) Semantics: implementation validation in .ts

#### 3.1 Soundness-only validation (required)

If a function/method has a body and declares `throws Edecl`:

- Compute `Einf = infThrows(signature)`
- Require `Einf` assignable to `Edecl` (i.e. `Einf ⊆ Edecl`)
- If not, diagnostic: **“Declared throws type ‘Edecl’ does not include inferred thrown type ‘Einf’.”**

Same for `rejects`:

- Compute `Rinf = infRejects(signature)`
- Require `Rinf` assignable to `Rdecl`

#### 3.2 No completeness checks

Do not error if `Edecl` includes types not thrown by the implementation.

#### 3.3 Validation scope (keep it simple)

For Milestone 3:

- Validate only declarations with bodies (function/method).
- **Overloads:** if an overload signature has throws/rejects, use it at call-site when that overload is selected. Validation: only validate the implementation signature if it has a clause. Do not attempt to validate “overload union matches implementation”; out of scope.

### 4) Integration with existing features

#### 4.1 try/catch catch-variable typing

Your existing catch typing rule should use `effectiveThrows` of calls inside try blocks (declared if present).

Example:

```ts
declare function f(): number throws RangeError | TypeError;

try { f(); } catch (e) {
  // e: RangeError | TypeError
}
```

#### 4.2 Async await enforcement

`await f()` uses `effectiveRejects` for `f()`. If a call returns a promise but uses declared `rejects`, then:

- `rejectEffect(callExpr) = declaredRejects`
- `thrownEffect(awaitExpr) = declaredRejects` (so try/catch works naturally)

#### 4.3 Fire-and-forget stance 2

Dropping a promise from a call that has declared `rejects` should behave exactly like inferred reject effects:

- `f();` → error
- `void f();` → ok
- `f().catch(...)` → ok

## Implementation plan: code changes

This is organized by compiler subsystems.

### A) Parser + AST

#### A.1 Tokens

Add new keyword tokens:

- `ThrowsKeyword`
- `RejectsKeyword`

Where:

- `src/compiler/types.ts` (token enums / SyntaxKind)
- `src/compiler/scanner.ts` (recognize keywords)

#### A.2 AST Nodes

Add fields on relevant nodes that represent signatures with return types. Likely candidates in `src/compiler/types.ts`:

- SignatureDeclarationBase or whatever base is used for function/method signatures
- FunctionDeclaration, MethodDeclaration, MethodSignature, CallSignatureDeclaration, FunctionTypeNode, ConstructSignatureDeclaration (exclude constructors), etc.

Add:

- `throwsType?: TypeNode`
- `rejectsType?: TypeNode`

(Or a unified `effectClause?: { kind: "throws"|"rejects", type: TypeNode }`—either is fine; separate fields are simpler for PoC.)

#### A.3 Parsing

Update signature parsing so that after parsing the return type annotation (`: TypeNode`) it optionally parses:

- `throws TypeNode`
- `rejects TypeNode`

Where to implement:

- `src/compiler/parser.ts` in the function that parses return type for signatures (`parseReturnType` / `parseTypeOrTypePredicate` area), and the signature parsing routines: function/method declarations, call signatures, function type nodes, method signatures in interfaces/type literals

#### A.4 Emission / Printer

Update printer so `.d.ts` output includes these clauses if present.

Where:

- `src/compiler/printer.ts` (emit function/method signatures)

Ensure formatting is stable: `): R throws E;`

### B) Binder (optional)

If your checker reads the fields directly from nodes, you might not need binder changes. But if you attach symbol/signature metadata during binding, you’ll add it here. Likely: no binder change required for PoC.

### C) Checker: signature metadata + effect resolution

#### C.1 Store declared effect on Signature

When the checker creates a Signature for a declaration, capture the declared clause type node and resolve it to a Type.

Where: `src/compiler/checker.ts` — in signature creation / `getSignatureFromDeclaration` / similar internal function.

Add fields to your internal signature metadata (not public types):

- `signature.declaredThrowsType?: Type`
- `signature.declaredRejectsType?: Type`

#### C.2 Compute effective throws/rejects helpers

You likely already have helpers for inferred effects. Add:

- `getEffectiveThrows(signature): Type`
- `getEffectiveRejects(signature): Type`

Rules as per spec: declared wins, else inferred.

#### C.3 Call expression checking uses effective effects

Update your existing call-site enforcement and try-block analysis to use effective effects.

Where: the code where you currently look up inferred throws for a call expression.

Ensure both:

- sync call checking uses `getEffectiveThrows`
- async reject-effect assignment uses `getEffectiveRejects`

#### C.4 Clause compatibility diagnostics

- When a signature has `rejects`: verify return type is promise-like.
- When a signature has `throws`: verify return type is not promise-like.

Where: during signature check / declaration check stage (when checking a function/method declaration), emit diagnostics.

### D) Checker: implementation validation

#### D.1 Soundness checks

For `.ts` declarations with bodies:

- **If `declaredThrowsType` exists:** `Einf = getInferredThrows(signature)` (your current mechanism); if `!isTypeAssignableTo(Einf, Edecl)` → diagnostic
- **If `declaredRejectsType` exists:** `Rinf = getInferredRejects(signature)`; if `!isTypeAssignableTo(Rinf, Rdecl)` → diagnostic

Where: in the existing “checkFunctionLikeDeclaration” or “checkSignatureDeclaration” routines in `checker.ts`.

## Test plan

You should implement both compiler tests (repo harness) and a manual harness (run your built tsc against a scratch project). Below are test cases with expected outcomes.

### 1) Parsing and printing

#### 1.1 Parses in .ts

```ts
function f(): number throws Error { return 1; }
```

✅ no parse errors

#### 1.2 Parses in .d.ts

```ts
declare function f(): number throws Error;
```

✅ no parse errors

#### 1.3 Printer emits clause in .d.ts

Input `.d.ts` or `.ts` with `--declaration` output should include throws/rejects. Expected `.d.ts` contains:

```ts
export declare function f(): number throws Error;
```

### 2) Call-site enforcement uses declared effects

#### 2.1 Declared throws triggers handling

```ts
declare function f(): number throws RangeError;

f(); // ERROR: Unhandled thrown type RangeError
try { f(); } catch (e) { e; } // OK, e: RangeError
```

#### 2.2 Declared overrides inferred at call sites

```ts
function g(): number throws RangeError { throw new TypeError(); } // also triggers validation error (see below)
try { g(); } catch (e) {
  // e should be RangeError (declared), but validation will fail due to body
}
```

Call-site uses declared; implementation validation emits separate diagnostic.

### 3) Implementation validation (soundness)

#### 3.1 Throws validation fails if body throws outside declared set

```ts
function f(): number throws RangeError {
  throw new TypeError();
}
```

❌ ERROR: inferred TypeError not assignable to declared RangeError

#### 3.2 Throws validation passes when declared is wider

```ts
function f(): number throws Error {
  if (Math.random()) throw new TypeError();
  throw new RangeError();
}
```

✅ OK

#### 3.3 Rejects validation (async)

```ts
async function f(): Promise<number> rejects TypeError {
  throw new RangeError();
}
```

❌ ERROR: inferred reject RangeError not assignable to declared TypeError

### 4) rejects semantics

#### 4.1 Await enforces declared rejects

```ts
declare function f(): Promise<number> rejects TypeError;

async function test() {
  await f(); // ERROR: Unhandled promise rejection type TypeError
  try { await f(); } catch (e) { e; } // OK, e: TypeError
}
```

#### 4.2 Fire-and-forget stance 2 works with declared rejects

```ts
declare function f(): Promise<void> rejects Error;

function test() {
  f(); // ERROR (dropped rejecting promise)
  void f(); // OK
  f().catch(() => {}); // OK
}
```

### 5) Clause compatibility diagnostics

#### 5.1 rejects on non-promise return type

```ts
declare function f(): number rejects Error;
```

❌ ERROR: rejects requires Promise-like return type

#### 5.2 throws on promise return type

```ts
declare function f(): Promise<number> throws Error;
```

❌ ERROR: throws not allowed on Promise-like return type (per M3 spec)

### 6) Overloads

#### 6.1 overload selected clause used

```ts
declare function f(x: "a"): number throws TypeError;
declare function f(x: "b"): number throws RangeError;
declare function f(x: string): number;

f("a"); // ERROR: TypeError
try { f("b"); } catch (e) { e; } // e: RangeError
```

(You’re not required to validate overloads vs implementation in M3.)

### 7) Type positions (function types / call signatures)

#### 7.1 Function type node carries effects

```ts
type Fn = (x: string) => number throws Error;
declare const fn: Fn;
fn("x"); // ERROR unless handled
```

#### 7.2 Interface method signature

```ts
interface X { m(): number throws Error; }
declare const x: X;
x.m(); // ERROR unless handled
```

## Deliverables checklist (done = all checked)

- [ ] `throws` and `rejects` tokens added and scanned
- [ ] AST fields exist on all relevant signature nodes
- [ ] Parser accepts clauses after return types in all required locations
- [ ] Printer emits clauses (at least in `.d.ts` emit)
- [ ] Checker reads clauses, resolves type nodes to Type
- [ ] Call-site and try/catch typing use declared effects where present
- [ ] Async await + fire-and-forget use declared rejects where present
- [ ] Validation: body-inferred effects must be assignable to declared effects
- [ ] Compatibility diagnostics: `rejects` requires promise-like; `throws` forbids promise-like
- [ ] Tests added for parse/emit/check/validation

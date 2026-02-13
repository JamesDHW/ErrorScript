# Inferred Checked Errors — Proof of Concept Specification

## 1. Purpose

This feature introduces checked error semantics to TypeScript based entirely on inferred thrown types, without adding new language syntax (e.g. no `throws` keyword).

The goal is to experimentally evaluate:

- Whether inferred checked errors are ergonomically viable in TypeScript.
- Whether error handling can be enforced statically without explicit annotations.
- How well such a system integrates with async/Promise-based JavaScript.

This is a compiler-level feature and cannot be implemented as an ESLint rule or language service plugin.

## 2. High-Level Behavior

The system enforces that:

- Any expression that may throw (or reject) must either be handled locally via try/catch or explicitly propagated.

There is no explicit `throws` annotation. All thrown types are inferred from:

- `throw` statements
- Calls to other functions
- Known stdlib throw mappings (curated metadata)

## 3. Core Semantics

### 3.1 Thrown Type Inference

**Rule 1 — `throw expr`**

```ts
throw expr;
```

Contributes the type: `TypeOf(expr)`.

Examples:

```ts
throw new Error()        → Error
throw new FooError()     → FooError
throw ""                 → string
throw 123                → number
```

There is no restriction on thrown types.

**Rule 2 — `throw;` (rethrow)**

Inside a `catch (e)` block:

```ts
throw;
```

Contributes: `TypeOf(e)`.

### 3.2 Function Thrown Type

For a function `f`, its inferred thrown type is:

```
Union(
  direct throws in body,
  thrown types of any called functions,
  rethrows
)
```

If a cycle is detected in call graph analysis:

- `ThrownType = unknown`

This is an intentional PoC simplification.

### 3.3 Call Site Enforcement

If a call expression may throw type `E`, then it must satisfy one of:

- Be enclosed within a `try` that has a `catch`
- Be inside another function that is itself inferred to throw (i.e. propagation)
- For async calls: be awaited inside a try, or explicitly handled via `.catch(...)`
- Be explicitly ignored using `void` (see async section)

Otherwise, a compile-time error is produced:

- **Unhandled thrown type: E**

## 4. try/catch/finally Semantics

### 4.1 Absorption Rule

For:

```ts
try {
  TRY
} catch (e) {
  CATCH
} finally {
  FINALLY
}
```

Define:

- `T_try` = thrown type of TRY
- `T_catch` = thrown type of CATCH
- `T_finally` = thrown type of FINALLY

Then:

- **If catch exists:** `Thrown(tryStatement) = T_catch | T_finally` — `T_try` is considered handled (absorbed).
- **If no catch exists:** `Thrown(tryStatement) = T_try | T_finally`

### 4.2 Catch Variable Typing

For:

```ts
try {
  ...
} catch (e) {
  ...
}
```

The type of `e` is: **union of all types thrown from TRY**.

Example:

```ts
try {
  if (x) throw new FooError()
  else throw new BarError()
} catch (e) {
  // e: FooError | BarError
}
```

This type supports standard TypeScript narrowing (e.g. `instanceof`).

## 5. Async / Promise Semantics

### 5.1 Async Functions

For:

```ts
async function f() { ... }
```

If the function body infers thrown type `E`, then `f(): Promise<T>` is considered a promise that may reject with `E`. This is treated as an effect attached to the promise value.

### 5.2 Enforcement on await

For:

```ts
await expr
```

If `expr` is a promise that may reject with type `E`, then:

- The `await` must be inside a try/catch, or
- The enclosing function must propagate the error.

Otherwise compile error: **unhandled rejection type E**.

### 5.3 Fire-and-Forget (Stance 2)

The following are allowed patterns:

**Explicit ignore**

```ts
void f();
```

This suppresses enforcement.

**Explicit catch**

```ts
f().catch(() => {});
```

Any `.catch(...)` counts as handling.

**Disallowed**

```ts
f(); // error if f returns Promise that may reject
```

Unless explicitly ignored or handled.

### 5.4 Promise.all

If:

- `p1` rejects `E1`
- `p2` rejects `E2`

Then `Promise.all([p1, p2])` produces `Promise<...>` rejecting with `(E1 | E2)`.

Thus:

```ts
await Promise.all([a(), b()])
```

Requires handling of `E1 | E2`.

## 6. Standard Library and Declaration Files

Since `.d.ts` files do not contain bodies, thrown types cannot be inferred.

To address this:

- A curated metadata mapping provides thrown types for selected stdlib functions.
- This mapping may be derived from eslint-plugin-exception-handling.
- For declarations without mapping: they default to `never` OR a conservative `unknown` (implementation choice, but must be consistent).

This metadata does not introduce a new language feature.

## 7. Recursion Handling

If call graph analysis detects recursion:

- `ThrownType = unknown`

This avoids fixpoint complexity in the PoC. Future improvements may replace this with a recursive type marker.

## 8. Non-Goals (PoC Scope)

The following are explicitly out of scope:

- Adding a `throws` keyword
- Perfect interprocedural analysis
- Precise modeling of all Promise combinators
- Exhaustive stdlib throw coverage
- Soundness guarantees across all JS patterns
- Runtime enforcement

## 9. Compile-Time Errors Introduced

New error class:

- **Unhandled thrown type: E**

And for async:

- **Unhandled promise rejection type: E**

These errors occur when:

- A throwing call is not in try/catch
- An awaited promise rejection is not handled
- A rejecting promise is dropped without `.catch` or `void`

## 10. Expected Developer Experience

**Before**

```ts
foo(); // may throw
```

**After**

```ts
try {
  foo();
} catch (e) {
  ...
}
```

Or propagate:

```ts
function bar() {
  foo(); // allowed because bar now inferred to throw
}
```

**Async**

```ts
try {
  await foo();
} catch (e) {
  ...
}
```

Or explicitly ignore:

```ts
void foo();
```

## 11. Design Principles

- No new syntax.
- Purely inferred.
- JS-compatible (anything can be thrown).
- Try/catch absorbs.
- Async integrates via rejection.
- Explicit ignore required for fire-and-forget.
- Cycles degrade to `unknown`.

## 12. Intended Outcome of the PoC

This feature should allow evaluation of:

- Whether inferred-only checked errors are usable in a JS ecosystem.
- Whether Promise rejection typing improves correctness.
- Whether explicit ignore (`void`) is sufficient ergonomically.
- Whether lack of explicit `throws` syntax is a blocker.
- Whether inference noise becomes unmanageable.

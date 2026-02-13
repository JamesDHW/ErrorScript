# Milestone 2: practical implementation plan + local testing

Milestone 2 target: async + Promise rejection effects, fire-and-forget stance 2, Promise.all unions, and stdlib / .d.ts throws mapping (bootstrapped from eslint-plugin-exception-handling). This builds on Milestone 1 (sync inference + try/catch typing/absorption + call propagation).

## Milestone 2 outcomes you must hit

- **Async functions:** `async function f()` inferred “throws E” becomes: returns a Promise that may reject with E.
- **Enforcement at await:** `await expr` requires handling (try/catch) if the awaited promise may reject.
- **Propagation via return:** returning a rejecting promise propagates that rejection effect to the caller (so caller must handle when awaited).
- **Fire-and-forget stance 2:**
  - `f();` is an error if `f()` returns a promise that may reject
  - allowed if explicitly ignored via `void f();`
  - allowed if explicitly handled via `.catch(...)` on the resulting promise
- **Promise.all:** union rejection effects from inputs into the returned promise.
- **Stdlib mapping:** .d.ts-only functions can have declared throw/reject effects via curated metadata (no new syntax).
- **Recursion policy** remains: cycles → `unknown`.

## Key design decision (implementation-friendly)

You need a representation for “may reject with E” that doesn’t require rewriting the whole type system.

**Recommended PoC approach:** maintain a parallel effect system:

- **ThrownEffect** for sync expressions/statements (Milestone 1)
- **RejectEffect** for promise-producing expressions

These are not encoded into the public Type string; they are tracked internally and used for diagnostics and catch-variable typing.

## Core internal helpers (conceptual)

- `getThrownEffectOfExpression(expr): Type` — for sync throws
- `getRejectEffectOfExpression(expr): Type` — for promise rejections
- `setRejectEffect(exprOrType, E)` / caches keyed by nodes

In practice you’ll likely compute reject effects by:

- special-casing `await`
- looking at the callee (async function / mapped stdlib async API)
- and propagating through a handful of Promise combinators

## Sectioned plan (small, reliable increments)

### Section 5 — Add reject effect for async functions (foundation)

**Goal:** derive “rejects E” for async functions from their inferred body throws.

#### 5.1 Compute async-body “throws” as before

Milestone 1 already infers thrown types for function bodies.

For `async function f() { ... }`:

- Let `E = inferredThrownType(f.body)`
- Define `rejectEffect(f) = E`

**Important:** this does not mean `f()` “throws”; it means `f()` returns a promise that may reject with E.

#### 5.2 Identify “promise-producing calls that have reject effects”

At `CallExpression`:

- Resolve signature / declaration
- If callee is async with a body → attach reject effect E to this call expression result.
- If callee is mapped stdlib async → attach reject effect from mapping.

**Deliverable:**

```ts
async function boomAsync() { throw new Error("x"); }
const p = boomAsync(); // p has rejectEffect Error
```

No enforcement yet; just compute.

### Section 6 — Enforce at await (first async diagnostic)

**Goal:** `await` requires handling when awaited expression may reject.

#### 6.1 Check await expr

- Compute `E = rejectEffect(expr)`
- If E is not `never`:
  - if inside try-with-catch → handled
  - else → report diagnostic: **Unhandled promise rejection type: E**

#### 6.2 Type catch (e) for async try/await

This naturally follows if your try-block thrown inference includes await points.

Inside `try { await boomAsync() } catch (e) { ... }` the try block’s “escapes” must now include rejections of awaited expressions. So the thrown type of an `AwaitExpression` should be considered: it “throws” whatever it may reject with.

i.e. `thrownEffect(await expr) = rejectEffect(expr)`.

Then the existing Milestone 1 rule (“catch var type = throws from try block”) automatically picks up async rejections.

**Deliverable:**

```ts
try { await boomAsync(); } catch (e) {
  e; // Error
}
```

### Section 7 — Propagation for async via returns

**Goal:** returning a rejecting promise means caller must handle later.

**Cases:**

```ts
async function a() { throw new FooError(); }        // rejects FooError
function b() { return a(); }                        // returns promise rejects FooError
async function c() { return a(); }                  // rejects FooError (since await/return semantics)
```

**Implementation rules:**

- If a function returns an expression with `rejectEffect` E, then:
  - if the function is async: its rejectEffect unions in E
  - if the function is non-async but returns a promise: the returned expression retains its reject effect (caller sees it)

This means you need rejectEffect to flow through:

- `return expr`
- variable assignment (optional for PoC; you can avoid deep aliasing at first)
- direct expression returns

**Deliverable:**

```ts
function wrapper() { return boomAsync(); }
await wrapper(); // must handle Error
```

### Section 8 — Fire-and-forget stance 2 (void/catch)

**Goal:** disallow “dropped rejecting promises” unless explicitly ignored or caught.

#### 8.1 Detect “dropped promise” pattern

When checking an ExpressionStatement like:

```ts
boomAsync();
```

- Let `E = rejectEffect(callExpression)`
- If E not `never`:
  - **Allow** if expression is explicitly `void boomAsync()` (UnaryExpression void)
  - **Allow** if expression is a `.catch(...)` call chained from the promise
  - **Else** error: **Unhandled promise rejection type: E** (promise dropped; use await, .catch, or void)

#### 8.2 What counts as .catch(...)?

PoC-friendly rule: if the outermost expression is a call where the target is a property access named `"catch"` and it is invoked with ≥1 arg, then it counts as handled. You don’t need to typecheck the handler; any `.catch` absorbs.

**Deliverable:**

```ts
boomAsync();                // error
void boomAsync();           // ok
boomAsync().catch(()=>{});  // ok
```

### Section 9 — Promise.all union reject effects

**Goal:** `Promise.all` produces a promise whose reject effect is the union of the inputs.

#### 9.1 Minimal special-case

When checking a call expression that resolves to `Promise.all`:

- Inspect the first argument:
  - If it’s an array literal: compute union of `rejectEffect` of each element expression.
  - If it’s not an array literal: PoC can return `unknown` or `never` (documented limitation).
- Then set: `rejectEffect(Promise.all([...])) = union(E_i)`

**Deliverable:**

```ts
await Promise.all([a(), b()]); // must handle union
```

(You can expand later to Promise.allSettled, etc.)

### Section 10 — Stdlib / .d.ts mapping (lean on eslint-plugin-exception-handling)

**Goal:** for declarations without bodies, attach throws/reject effects.

#### 10.1 Decide mapping format

Create a file in your fork, e.g.:

- `src/compiler/throwMap.json` (or similar)

containing entries like:

- symbol identifier → thrown type name(s)
- optionally: sync throws vs promise rejects (depending on API)

Example conceptually (format up to you):

```json
{
  "JSON.parse": { "throws": ["SyntaxError"] },
  "fetch": { "rejects": ["TypeError"] }
}
```

#### 10.2 Attach mapping at signature resolution time

When you resolve a call signature and it has no body:

- Look up the fully qualified name / symbol id
- **If found:** set thrown effect (for sync functions), set reject effect (for async-returning promise functions)
- **If not found:** keep Milestone 1 behavior (likely `never` to avoid noise)

#### 10.3 Bootstrapping from eslint-plugin-exception-handling

Use it as a source of truth for:

- which stdlib APIs can throw
- what error types are associated (where known)

For PoC, it’s ok to map only a handful of high-signal APIs:

- `JSON.parse`
- `decodeURIComponent` / `encodeURIComponent`
- `atob` / `btoa` (env dependent)
- DOM APIs you care about
- fetch rejection

**Deliverable:** stdlib calls now participate even without bodies.

## Testing locally (Milestone 2)

You should keep both tracks: TS baselines + “second project”.

### Track A — TS baseline tests (recommended once stable)

Add a new set of compiler tests (e.g. `tests/cases/compiler/checkedThrowsAsync.ts`) gated behind `--checkedThrows`.

**Test cases to include:**

**await requires handling**

```ts
async function boom() { throw new Error("x"); }
async function test() {
  await boom(); // error
}
```

**try handles awaited rejection + catch var typed**

```ts
async function boom() { throw new Error("x"); }
async function test() {
  try { await boom(); } catch (e) {
    e.message; // ok, e: Error
  }
}
```

**fire-and-forget dropped promise**

```ts
async function boom() { throw new Error("x"); }
function test() {
  boom(); // error
  void boom(); // ok
  boom().catch(()=>{}); // ok
}
```

**wrapper propagation**

```ts
async function boom() { throw new Error("x"); }
function wrap() { return boom(); }
async function test() { await wrap(); } // error unless handled
```

**Promise.all union**

```ts
async function a() { throw "a"; }
async function b() { throw 123; }
async function test() {
  await Promise.all([a(), b()]); // error: string | number
}
```

**stdlib mapping**

```ts
JSON.parse("{"); // error if mapped as throws SyntaxError (sync case)
```

Run your test suite and update baselines as needed.

### Track B — Second project (fastest iteration)

Create a scratch TS project with a single file like `poc.ts` containing the matrix above.

Run your forked compiler against it:

```bash
node /path/to/ts-fork/built/local/tsc.js --project /path/to/poc/tsconfig.json --checkedThrows
```

This is the quickest loop while you’re still changing diagnostics frequently.

## Suggested order + realistic scope

If you want “minimum wow” with minimal complexity, implement in this order:

1. await enforcement + catch typing for awaited rejects (Sections 5–6)
2. dropped promise rule + void / .catch escape hatch (Section 8)
3. Promise.all for array literal (Section 9)
4. stdlib mapping for 2–5 APIs only (Section 10)

That yields a strong demo without drowning in edge cases.

## Practical limitations you should document (PoC-acceptable)

To avoid getting stuck, explicitly accept these limits in Milestone 2:

- Reject effects propagate reliably only through:
  - direct call results
  - `await`
  - `return expr`
  - `Promise.all([literal])`
- No deep alias tracking: `const p = boom(); p.then(...)` might not carry effect unless you implement variable flow.
- `.catch` “absorbs everything” (no type filtering).
- Unmapped .d.ts calls default to `never` (or `unknown` if you choose), but keep consistent.

## Done criteria for Milestone 2

You can consider Milestone 2 done when:

- `await` requires try/catch for rejecting promises
- `catch (e)` is typed as union of awaited rejection types
- dropping rejecting promises produces an error unless `void` or `.catch`
- `Promise.all([a(), b()])` unions rejection types
- at least one stdlib mapping works (e.g. `JSON.parse`)
- all of the above is gated behind `--checkedThrows`

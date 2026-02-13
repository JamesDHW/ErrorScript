# Practical implementation plan (Milestone 1) + local testing

Milestone 1 target: sync-only inferred throws + try/catch absorption + typed `catch (e)` + call propagation + recursion → `unknown`. No async / Promise rejection semantics yet.

## Milestone 1 outcomes you must hit

- Infer thrown types from `throw expr` in function bodies.
- Infer thrown types through calls (interprocedural), with caching.
- If recursion/cycle detected, thrown type becomes `unknown`.
- `try { ... } catch (e) { ... }` absorbs throws from try block.
- Throws from catch and finally escape.
- `catch (e)` variable type = union of throws from try block.
- Enforce unhandled throws at call sites unless inside a try with a catch.
- No new syntax.

## Sectioned plan (reliable “small steps”)

### Section 0 — Add a feature flag + fast local loop (1–2 hours)

You want the feature opt-in so you can keep running the rest of TS tests without exploding baselines.

#### 0.1 Add a compiler option

Add something like `--checkedThrows` to compiler options. Default: `false`.

Where to wire (high level):

- Option parsing / CompilerOptions
- Command line parsing / help text
- Pass flag into checker (so the feature is gated)

#### 0.2 Build once and run tsc locally

From repo root (typical):

```bash
npm ci
npm run build
node ./built/local/tsc.js -v
```

If TS’s scripts differ in your fork, adapt to whatever `npm run build` produces; the goal is: you can run the built `tsc.js` directly.

**Deliverable:** you can do:

```bash
node ./built/local/tsc.js --checkedThrows path/to/file.ts
```

and it parses the flag (even if no behavior yet).

### Section 1 — Compute thrown type for direct throw only (no calls yet)

**Goal:** implement a `thrownTypeOfFunctionLike(node)` that unions `TypeOf(expr)` for all `throw expr` inside the function.

**Requirements (PoC)**

- Only scan within the same function-like body.
- Ignore calls for now.
- `throw;` returns `unknown` for now.

**Implementation sketch**

- Add a cache: `Map<NodeId, ThrowInfo>` or `Map<FunctionLikeDeclaration, Type>`.
- Traverse the function body AST:
  - Find `ThrowStatement`s
  - If has expression: `getTypeAtLocation(expr)` and union
  - If no expression: `unknown`

**Deliverable:** you can inspect the computed type (temporarily via debug logging or a hidden diagnostic).

**Tip:** Keep this purely internal; don’t emit user-facing errors yet.

### Section 2 — Add try/catch rules + type catch (e)

**Goal:** compute throws for blocks/statements and type the catch variable.

#### 2.1 Implement statement-level thrownTypeOfStatement(stmt)

You need this for:

- try statement composition
- later, function body composition
- later, call propagation

Start with a conservative set:

- `Block` → union of contained statements
- `ThrowStatement` → as above
- `TryStatement` → special logic (below)
- Everything else → `never` (initially) or recurse where obvious

#### 2.2 Implement TryStatement thrown type

For:

```ts
try { TRY } catch (e) { CATCH } finally { FINALLY }
```

Compute:

- `T_try` = thrownTypeOfBlock(TRY)
- `T_catch` = thrownTypeOfBlock(CATCH) if present else `never`
- `T_finally` = thrownTypeOfBlock(FINALLY) if present else `never`

Then:

- **If catch exists:** `Thrown(tryStmt) = T_catch | T_finally`
- **Else:** `Thrown(tryStmt) = T_try | T_finally`

#### 2.3 Type the catch variable

When checking `catch (e)`:

- Bind `e`’s type to `T_try`.
- If `T_try` is `never`, type can be `never` (or `unknown` if you prefer “catch always unknown”; but your spec wants it based on try).

Also implement `throw;`: inside catch clause, `throw;` contributes `TypeOf(e)`.

**Deliverable:** in editor/tsserver (or by emitting .d.ts? not needed), `e` behaves as union type for narrowing.

### Section 3 — Enforce “unhandled throws” for call sites (still no call propagation)

**Goal:** first visible diagnostic.

#### 3.1 Define “handled by try”

For an expression location, determine whether it is within:

1. A `TryStatement`’s tryBlock, and
2. That `TryStatement` has a catchClause.

Implementation: walk parent pointers up from the call node, but be careful to stop at function boundaries. If you enter a nested function, that’s a new scope; outer try doesn’t handle inner call.

#### 3.2 Implement enforcement for known-throwing calls

At a call expression:

- Resolve callee signature as TS normally does.
- If you can get the declaration body and compute direct-throw type for that callee (Section 1), then:
  - If thrown type is not `never` and call is not handled → report diagnostic

**Deliverable:** these examples work:

```ts
function boom() { throw new Error("x"); }
boom();             // error
try { boom(); } catch (e) {}  // ok
```

**Note:** this enforcement will be “incomplete” until propagation exists; that’s fine.

### Section 4 — Call propagation + recursion → unknown

**Goal:** thrown types flow through calls: `a()` calls `b()` which throws → `a()` inferred throws.

#### 4.1 Cache + cycle detection

Represent computation state per function:

- NotStarted
- Computing (in-progress)
- Done(type)

If during computation you re-enter a Computing function → return `unknown` (PoC recursion behavior).

#### 4.2 Add call contributions

When computing thrown type of a function body:

- For each `CallExpression` (and `NewExpression` if you want constructors), resolve callee signature.
- If callee has an analyzable body: union in its thrown type.
- If callee is not analyzable (no body): for Milestone 1, treat as `never` (or `unknown`, but that will make everything explode). This is consistent with “Milestone 2 adds stdlib mapping”.

#### 4.3 Update enforcement

Now the call-site diagnostic is meaningful across multiple function layers.

**Deliverable:**

```ts
function b() { throw new Error("x"); }
function a() { b(); }
a(); // error (a inferred throws Error)
```

## Testing locally

You have two solid testing tracks: TS baseline tests (best long-term) and installing your fork into a second project (fast feedback).

### Track A — TypeScript repo tests (recommended)

#### A.1 Add compiler tests (baseline style)

Add a new test file under the compiler test suite (the exact path varies by repo version, but commonly under something like `tests/cases/compiler/`).

Create a test file, e.g.:

- `tests/cases/compiler/checkedThrowsBasic.ts`

Include explicit `// @errors:` or baseline expectations in the repo’s style.

Example test content ideas:

```ts
function boom() { throw new Error("x"); }
boom(); // should error: unhandled Error

try { boom(); } catch (e) {
  e; // should be Error
}
```

You’ll likely need multiple files:

- basic unhandled
- try absorbs
- catch throws escapes
- rethrow
- call propagation
- recursion yields unknown (ensure catch var becomes unknown, or that it errors as unknown, depending on your rules)

#### A.2 Run just your tests

TypeScript has ways to run subsets of tests, but the commands differ by branch. Common patterns:

```bash
npm test -- --filter checkedThrows
```

or running the compiler tests via the repo’s runner. If you can’t easily filter, start by running just the compiler test suite, then narrow once it works.

#### A.3 Update baselines

Once diagnostics stabilize, update baselines (repo usually has a script for it). This is normal.

**Tip:** While iterating, keep the feature behind `--checkedThrows` and make your tests compile with that flag enabled (often via header directives or harness config). This prevents unrelated tests from failing.

### Track B — Test by running your forked tsc in a second project (fastest)

This is the quickest way to validate behavior without fighting the test harness.

#### B.1 Build your fork

```bash
npm run build
```

#### B.2 Run your fork’s tsc directly against the other project

From your TS fork root:

```bash
node ./built/local/tsc.js --project /path/to/other-project/tsconfig.json --checkedThrows
```

This avoids packaging/npm entirely.

#### B.3 Optional: “install” your fork in another project (if you really want)

You can also pack and install.

From fork root:

```bash
npm pack
```

In the other project:

```bash
npm install /path/to/typescript-<version>.tgz
```

Then in that project:

```bash
npx tsc --checkedThrows
```

This helps you validate that the CLI + package usage works.

## Suggested minimal test matrix for Milestone 1

Create a single `checkedThrowsPoC.ts` in your second project with these cases:

**Direct unhandled**

```ts
function boom() { throw new Error("x"); }
boom(); // error
```

**Handled by try/catch**

```ts
try { boom(); } catch (e) {
  e.message; // e should be Error
}
```

**Absorption rule**

```ts
function a() {
  try { boom(); } catch (e) {}
}
// calling a should be ok (a throws never)
a();
```

**Catch throws escape**

```ts
function b() {
  try { boom(); } catch (e) { throw "oops"; }
}
b(); // error (throws string)
```

**Call propagation**

```ts
function inner() { throw 123; }
function outer() { inner(); }
outer(); // error (number)
```

**Rethrow**

```ts
function c() {
  try { boom(); } catch (e) { throw; }
}
c(); // error (Error)
```

**Recursion → unknown**

```ts
function r1() { r2(); }
function r2() { r1(); throw new Error("x"); } // even without this, cycle exists
r1(); // error (unknown) depending on how you report
```

## How to keep this “day-ish” instead of “week-ish”

Do these constraints for Milestone 1:

- Only analyze function declarations / function expressions / arrow functions with bodies.
- Ignore .d.ts throws (treat as `never`) until Milestone 2 mapping.
- Treat “handled” as any catch (no catch filtering by type).
- Don’t attempt perfect statement coverage—start with:
  - Block, ThrowStatement, ExpressionStatement, ReturnStatement (optional), TryStatement, IfStatement (optional)
- Gate everything behind `--checkedThrows`.

This gets you a coherent, demo-able PoC quickly.

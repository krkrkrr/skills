# Templates

Read this when you are about to write one of these shapes. **The workflow itself
is in `SKILL.md`; this file is only the shapes.**

- [Architecture Decision Records](#architecture-decision-records-adr)
- [Root README.md and the doc/README.md timeline](#root-readmemd-and-the-docreadmemd-timeline)
- [Feature file (Phase 3)](#feature-file-phase-3)
- [Property table (Phase 4a)](#property-table-phase-4a)
- [Property-based test (Phase 4b)](#property-based-test-phase-4b)
- [Test list (Phase 5a)](#test-list-phase-5a)

---

## Architecture Decision Records (ADR)

Whenever a significant architectural or design decision is made during any phase, record it as an ADR.
If the `adr-writing-ja` skill is available, follow it instead of this section.

**When to create an ADR:**
- A technology or framework is chosen (e.g., "use PostgreSQL over SQLite")
- A design pattern or architectural style is adopted (e.g., "CQRS for the Order aggregate")
- A trade-off is accepted with known consequences
- A rejected alternative is worth preserving for future readers

**File:** `doc/ADR/NNNN-<kebab-case-title>.md` (zero-padded four-digit number, e.g. `doc/ADR/0001-use-event-sourcing.md`)

**Format (Nygard):**

```markdown
---
type: Architecture Decision Record
title: "ADR-NNNN: <title>"
description: <the decision in one sentence>
status: draft   # Proposed → draft, Accepted → stable, Rejected / Deprecated / Superseded → deprecated
---

# ADR-NNNN: <title>

## Status

Proposed | Accepted | Rejected | Deprecated | Superseded by [ADR-NNNN](NNNN-<title>.md)

## Context

<Describe the situation, forces, and constraints that led to this decision.>

## Decision

<State the decision in active voice: "We will…">

## Consequences

<List positive and negative consequences of this decision.>
```

Create the ADR as `Proposed` immediately when the decision is made — do not batch them at the end of a phase.
Set it to `Accepted` only when the user explicitly approves it.
If the user later changes a decision, write a new `Proposed` ADR that says `Supersedes [ADR-MMMM](MMMM-<title>.md)`.
Change the old ADR's `Status` to `Superseded by ADR-NNNN` only when the new one is accepted, in the same commit, without touching its body.
The frontmatter `status` follows the `Status` line in the same edit: an OKF reader treats a file with no `status` as current, so a superseded ADR left at `stable` reads as a live decision.

---

## Root README.md and the doc/README.md timeline

**Do not add a section to the root `README.md` per feature.** Create it once, when
the repository has none, and keep it under **100 lines**:

```markdown
# <App name>

> <one-line description>

## Run

<how to start the app>

## Test

<how to run all tests>

## Documentation

Design, decisions, and history: [doc/README.md](doc/README.md).
```

Touch it again only when how to run the app or its tests changes.

**Record each increment as one row in the timeline in `doc/README.md`.** Add the row
in Phase 1 and update its Status at every phase boundary:

`doc/README.md` is itself an OKF concept (see `references/layout.md`), so it opens with frontmatter:

```markdown
---
type: Documentation Index
title: <App name> — documentation
description: Where the design, decisions, and history of <App name> live, and the increment timeline.
---
```

```markdown
## Timeline

| Date | Increment | Contexts | Status |
|---|---|---|---|
| 2026-09-23 | [user-authentication](increments/2026-09-23-user-authentication/) | identity, billing | Phase 3 complete — features: [login](context/identity/features/login.feature) |
```

---

## Feature file (Phase 3)

```gherkin
Feature: <Use case name>
  As a <actor>
  I want to <action>
  So that <business value>

  Background:
    Given <common precondition>

  Scenario: Happy path — <name>
    Given <precondition>
    When <actor performs action>
    Then <expected outcome>
    And <additional assertion>

  Scenario: Error — <name>
    Given <invalid state>
    When <actor performs action>
    Then an error "<message>" is returned

  Scenario Outline: Boundary — <name>
    Given a <entity> with "<param>"
    When <action>
    Then the result is "<expected>"
    Examples:
      | param | expected |
      | ...   | ...      |
```

---

## Property table (Phase 4a)

Append to the `## Invariants` section of `doc/context/<bc>/constraints.md`:

```markdown
## <Use case name>

| Property | Type | Expression |
|---|---|---|
| Balance never goes negative | Invariant | `∀ deposit d: balance(after) ≥ 0` |
| Roundtrip serialization | Roundtrip | `decode(encode(x)) == x` |
```

---

## Property-based test (Phase 4b)

```typescript
// fast-check example
import * as fc from "fast-check";

test("balance invariant: never negative after valid deposit", () => {
  fc.assert(
    fc.property(fc.integer({ min: 1, max: 1_000_000 }), (amount) => {
      const account = Account.empty();
      account.deposit(amount);
      expect(account.balance).toBeGreaterThanOrEqual(0);
    })
  );
});
```

---

## Test list (Phase 5a)

```markdown
## Test List

- [ ] <scenario: happy path> — unit
- [ ] <scenario: error case> — unit
- [ ] <edge: boundary value> — unit
- [ ] <edge: invalid input> — unit
...
```

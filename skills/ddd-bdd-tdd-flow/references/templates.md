# Templates — ADR and README.md

Read this when you are about to write an ADR (any phase) or update the root
`README.md` at a phase boundary. **The workflow itself is in `SKILL.md`;
this file is only the shapes.**

---


## Architecture Decision Records (ADR)

Whenever a significant architectural or design decision is made during any phase, record it as an ADR.

**When to create an ADR:**
- A technology or framework is chosen (e.g., "use PostgreSQL over SQLite")
- A design pattern or architectural style is adopted (e.g., "CQRS for the Order aggregate")
- A trade-off is accepted with known consequences
- A rejected alternative is worth preserving for future readers

**File:** `doc/ADR/NNNN-<kebab-case-title>.md` (zero-padded four-digit number, e.g. `doc/ADR/0001-use-event-sourcing.md`)

**Format (Nygard):**

```markdown
# ADR-NNNN: <title>

## Status

Proposed | Accepted | Deprecated | Superseded by [ADR-NNNN](NNNN-<title>.md)

## Context

<Describe the situation, forces, and constraints that led to this decision.>

## Decision

<State the decision in active voice: "We will…">

## Consequences

<List positive and negative consequences of this decision.>
```

Create the ADR immediately when the decision is made — do not batch them at the end of a phase. If the user later changes a decision, update the old ADR's `Status` to `Superseded by ADR-NNNN` and create a new one.

---

---


### README.md Lifecycle

**Do not recreate `README.md` per feature.**
Keep the root `README.md` under **100 lines**: what the app is, how to run it,
and one line pointing at `doc/README.md`.

**Record the increment by adding one row to the timeline in `doc/README.md`.**
Design lives in `doc/context/`; history lives in `doc/increments/`. Use this progressive template — fill in only what the current phase covers; leave the rest as comments until that phase is reached:

````markdown
# <Feature Name>

> <one-line description from Phase 1>

## Status

Phase N complete — <phase name>

## Overview

<Problem statement and acceptance criteria — filled in Phase 1>

## Domain Model

<!-- Added in Phase 2 -->
[Context map](doc/system-context.md) / [Glossary](doc/glossary.md) — one line each

## Features / Behavior

<!-- Added in Phase 3 -->
| Feature file | Description |
|---|---|
| [name.feature](doc/context/<bc>/features/name.feature) | ... |

## Testing

<!-- Added in Phase 4 -->
- **Property tests (integration):** `test/integration/` — uses <PBT library>
- **Property tests (e2e):** `test/e2e/` — full-stack, no mocks

## Usage

<!-- Added in Phase 5 -->
<How to run the application or feature>

## Development

<!-- Added in Phase 5 -->
<How to build and run all tests>
````

Remove placeholder comments as each section is filled in. By Phase 5 the README must have no remaining comment placeholders.

---

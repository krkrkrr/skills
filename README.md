# skills

Personal Claude Code agent skills library. There is no single repository-wide
license: each skill carries its own, listed in the License column of the
[All skills](#all-skills-az) table below (see `skills/<skill-name>/LICENSE`).
Skills marked *derivative* are modified redistributions; the original work,
its license, and what was changed are credited in each skill's own README and LICENSE.

The repository is **flat** — one directory per skill at `skills/<skill-name>/`,
with no category subdirectories. Grouping is not encoded in the tree (it would
have no runtime meaning, since skills install individually into
`~/.claude/skills/<skill-name>/`). Instead, skills are organized here by **use
case**, derived from the skill-collaboration Markov model described below.

## Install

**gh skill** (recommended):

```bash
gh skill add krkrkrr/skills
```

To update:

```bash
gh skill update krkrkrr/skills
```

**apm** (`apm.yml`):

```yaml
dependencies:
  apm:
    - krkrkrr/skills/skills/<skill-name>
```

**skills:**

```bash
npx skills add krkrkrr/skills
```

**Manual (single skill):**

```bash
cp -rT skills/<skill-name>/ ~/.claude/skills/<skill-name>/
```

---

## Use-case map

Skills are grouped by **what you are trying to do**, not by technical domain.
The grouping is derived from a Markov-chain model of skill collaboration: each
skill is a *state*, "which skill you invoke next" is a *transition*, and the
model's connected clusters correspond to end-to-end use cases. Because some
skills sit on the boundary between workflows, this map is a **cover, not a
partition** — a *bridge* skill (tagged `↔ UCx`) appears under more than one use
case. Membership is assigned by the skill's dominant inbound transitions.
Transitions are read from the hand-offs each skill names in its `SKILL.md` and
`references/` (Related sections and inline pointers to other skills).

```mermaid
flowchart LR
  UC1["UC1 · New build<br/>ddd-bdd-tdd-flow (hub)"]
  UC2["UC2 · Writing<br/>japanese-tech-writing (hub)"]
  UC3["UC3 · Review & maintain<br/>frontend-review (hub)"]
  UC4["UC4 · Ship & operate<br/>sustainable-web-dev-loop (hub)"]
  UC5["UC5 · Improve toolkit<br/>skill-ops"]

  UC2 -->|readme-guidelines, okf-open-knowledge-format| UC1
  UC1 -->|adr-writing-ja| UC2
  UC3 -->|sustainable-web-dev-loop| UC4
  UC4 -->|upstream-fix-and-pin| UC3
  UC3 -->|unresolved-questions, adr-writing-ja| UC1
  UC1 -->|retrospective-codify| UC5
  UC3 -->|retrospective-codify| UC5
  UC4 -->|retrospective-codify, skill-creator| UC5
```

### UC1 — Build a new app or feature

Take a feature from requirements through modeling, tests, and implementation.
**Hub:** `ddd-bdd-tdd-flow` · **Deliverable:** passing E2E tests.

- [ddd-bdd-tdd-flow](./skills/ddd-bdd-tdd-flow/) — orient into bounded contexts → DDD SUDO modeling → BDD → property tests → TDD
- [unresolved-questions](./skills/unresolved-questions/) — file what a `ddd-bdd-tdd-flow` increment can't settle, as one question per file
- [external-api-tos-check](./skills/external-api-tos-check/) — clear a third-party API's ToS before integrating
- [adr-writing-ja](./skills/adr-writing-ja/) `↔ UC2` — record a design decision as a Japanese ADR
- [playwright-test](./skills/playwright-test/) `↔ UC3` — write and structure E2E tests
- [playwright-cli](./skills/playwright-cli/) — drive the browser interactively
- [okf-open-knowledge-format](./skills/okf-open-knowledge-format/) `↔ UC3` — the OKF format that `doc/`, questions, and ADRs are written in, so other agents and tools can read them; create and validate bundles

### UC2 — Author & polish technical writing

Draft an article, book manuscript, or design record, and tighten its reasoning before publishing.
**Hub:** `japanese-tech-writing` · **Deliverable:** an argument-checked draft.

- [japanese-tech-writing](./skills/japanese-tech-writing/) — Japanese technical-writing norms
- [argument-gap-edit](./skills/argument-gap-edit/) — fix weak arguments and structural gaps
- [adr-writing-ja](./skills/adr-writing-ja/) `↔ UC1` — Japanese ADRs, argument-checked with `argument-gap-edit`
- [extract-glossary](./skills/extract-glossary/) `↔ UC3` — build a domain glossary / onboarding map from a repo, as an OKF bundle
- [readme-guidelines](./skills/readme-guidelines/) `↔ UC1` — README templates and update policy

### UC3 — Review & maintain an existing codebase

Audit a codebase you inherited or own, triage what matters, and keep its dependencies moving.
**Hub:** `frontend-review` · **Deliverable:** a findings report plus a committed KPI baseline.

- [frontend-review](./skills/frontend-review/) — audit a frontend repo (CI, hygiene, deps, tests, security, state, perf) against a ratcheting KPI baseline
- [sustainable-web-dev-loop](./skills/sustainable-web-dev-loop/) `↔ UC4` — dependency review, CVE triage, and library replacement (`references/dependencies.md`)
- [upstream-fix-and-pin](./skills/upstream-fix-and-pin/) — PR upstream and pin to a git SHA meanwhile
- [extract-glossary](./skills/extract-glossary/) `↔ UC2` — map the terms, repos, and architecture of an inherited codebase before reviewing it
- [playwright-test](./skills/playwright-test/) `↔ UC1` — E2E structure, sharding, retries, and flaky handling in CI, as `frontend-review` recommends
- [okf-open-knowledge-format](./skills/okf-open-knowledge-format/) `↔ UC1` — the format of the `extract-glossary` knowledge base and the committed review reports; validate a bundle

### UC4 — Ship & operate as the service grows

Shape CI gates, deploys, observability, and migrations so quality ratchets up instead of eroding.
**Hub:** `sustainable-web-dev-loop` · **Deliverable:** gates and baselines that fail on regression.

- [sustainable-web-dev-loop](./skills/sustainable-web-dev-loop/) `↔ UC3` — measure → ratchet → promote repeats into mechanisms; deploy/rollback, CI, data-layer, and OpenTelemetry defaults

### UC5 — Operate & improve the toolkit

Build new skills, test them with evals, and feed lessons back as rules.
This is the self-improvement loop the chain folds back into.

- [skill-creator](./skills/skill-creator/) — draft a new skill, then iterate on it with evals and benchmarks
- [retrospective-codify](./skills/retrospective-codify/) — turn trial-and-error into ast-grep rules / skills / CLAUDE.md

---

## All skills (A–Z)

The complete inventory. Every skill here appears under at least one use case above.

| Skill | Description | Reference | License |
|-------|-------------|-----------|---------|
| [adr-writing-ja](./skills/adr-writing-ja/) | Write Japanese ADRs — whether one is needed, placement and naming, eleven templates, and an argument check via `argument-gap-edit`. | [architecture-decision-record](https://github.com/architecture-decision-record/architecture-decision-record#claude-code-skills-for-adrs) | CC BY-NC-SA 4.0 |
| [argument-gap-edit](./skills/argument-gap-edit/) | Detects and fixes weak arguments, structural gaps, and disruptive content in Japanese technical manuscripts. | [k16shikano/SKILL.md](https://gist.github.com/k16shikano/fd287c3133457c4fd8f5601d34aa817d?permalink_comment_id=6201959#gistcomment-6201959) | Unlicense |
| [ddd-bdd-tdd-flow](./skills/ddd-bdd-tdd-flow/) | Structured DDD → BDD → TDD flow for a new feature or app — orient into the repo's bounded contexts (Phase 0), SUDO domain modeling, Gherkin features, property-based tests, and t_wada TDD implementation. | original | Unlicense |
| [external-api-tos-check](./skills/external-api-tos-check/) | Confirms a third-party API/SDK/service's Terms of Service allows the planned behavior before implementation, and records constraints as an ADR. | original | Unlicense |
| [extract-glossary](./skills/extract-glossary/) | Extract domain-specific terminology, tech stacks, and onboarding Mermaid diagrams from a repo or GitHub org, as an OKF knowledge bundle (one concept per term, repository, and architecture topic). | [mizchi/skills](https://github.com/mizchi/skills) | MIT |
| [frontend-review](./skills/frontend-review/) | Audit an existing frontend repo — triage, CI, hygiene, dependencies/CVEs, testing, security, state management, rendering performance — with a KPI baseline that only ratchets tighter. | derivative — see the skill's README | MIT |
| [japanese-tech-writing](./skills/japanese-tech-writing/) | Guidelines for writing and editing Japanese technical documentation with clear structure, rigorous reasoning, consistent formatting, and concise, readable prose. | [k16shikano/SKILL.md](https://gist.github.com/k16shikano/fd287c3133457c4fd8f5601d34aa817d#file-skill-md) | Unlicense |
| [okf-open-knowledge-format](./skills/okf-open-knowledge-format/) | Create, validate, and enrich Open Knowledge Format (OKF) bundles — markdown files with YAML frontmatter that humans and agents can exchange. The format this library's knowledge-producing skills write in. | [fabricioctelles/skills](https://github.com/fabricioctelles/skills/tree/3b8da2cc1d5d13da7142560433b46b7ec3fc6988/skills/okf-open-knowledge-format) | Apache-2.0 |
| [playwright-cli](./skills/playwright-cli/) | Run Playwright CLI commands interactively. | [microsoft/playwright](https://github.com/microsoft/playwright/tree/e125b2ff24ad285b22e595f4e01a14f038b2c800/packages/playwright-core/src/tools/skills/playwright-cli) | Apache-2.0 |
| [playwright-test](./skills/playwright-test/) | Best practices for Playwright Test — avoiding fixed waits, network triggers, DnD, shard/retry on GitHub Actions. | derivative — see the skill's README | MIT |
| [readme-guidelines](./skills/readme-guidelines/) | README.md templates and policies — template selection by project type, README-ja.md sync, and change-to-section update rules. | original | Unlicense |
| [retrospective-codify](./skills/retrospective-codify/) | Codify trial-and-error lessons into ast-grep rules, skills, or CLAUDE.md rules after a fix lands. | derivative — see the skill's README | MIT |
| [skill-creator](./skills/skill-creator/) | Create new skills, iterate on them with evals/benchmarks, and optimize a skill's description for triggering accuracy. | [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/skill-creator) | Apache-2.0 |
| [sustainable-web-dev-loop](./skills/sustainable-web-dev-loop/) | Principles and defaults for shipping and operating a growing web service — measure, ratchet baselines, promote repeated findings into mechanisms; deploy/rollback, CI, data layer, dependencies, OpenTelemetry. | derivative — see the skill's README | MIT |
| [unresolved-questions](./skills/unresolved-questions/) | Files unknowns, provisional decisions, and deliberately-skipped work as one OKF concept per question under `doc/questions/<status>/`, where the directory is the status. | original | Unlicense |
| [upstream-fix-and-pin](./skills/upstream-fix-and-pin/) | Fix an upstream library bug, open a PR, and pin to the git SHA while waiting for it to merge. | derivative — see the skill's README | MIT |

---

## Maintaining this README

The directory tree has no categorization, so this file is the single map of the
library. **Any skill change must update this README in the same commit** — see
the "README Maintenance" section in [CLAUDE.md](./CLAUDE.md) for the exact rules
and a tree ⇄ README consistency check.

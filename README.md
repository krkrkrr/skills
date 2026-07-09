# skills

Personal Claude Code agent skills library.

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
    - krkrkrr/skills/skills/<category>/<skill-name>
```

**skills:**

```bash
npx skills add krkrkrr/skills
```

**Manual (single skill):**

```bash
cp -r skills/<category>/<skill-name>/ ~/.claude/skills/<skill-name>/
```

---

## Frontend Review (`frontend/`)

A suite of skills for systematic frontend code reviews. `frontend-review-weekly` orchestrates the full pipeline; the others can be invoked individually.

| Skill | Description | Reference |
|-------|-------------|-----------|
| [frontend-review-triage](./skills/frontend/frontend-review-triage/) | Initial assessment — scorecard covering lockfiles, TypeScript strictness, testing, CI, and known issues. Start here. | [mizchi/skills](https://github.com/mizchi/skills) |
| [frontend-review-ci](./skills/frontend/frontend-review-ci/) | CI optimization — slow/flaky GitHub Actions, sharding, cache, and concurrency improvements. | [mizchi/skills](https://github.com/mizchi/skills) |
| [frontend-review-deps](./skills/frontend/frontend-review-deps/) | Dependency health — outdated packages, CVE triage with attack-vector weighting, deprecated/declining libraries. | [mizchi/skills](https://github.com/mizchi/skills) |
| [frontend-review-hygiene](./skills/frontend/frontend-review-hygiene/) | Code quality — TypeScript strictness, lint violations, dead code, duplication. | [mizchi/skills](https://github.com/mizchi/skills) |
| [frontend-review-performance](./skills/frontend/frontend-review-performance/) | React rendering performance — memo/useCallback/useMemo, virtual scroll, useTransition/useDeferredValue. | [mizchi/skills](https://github.com/mizchi/skills) |
| [frontend-review-security](./skills/frontend/frontend-review-security/) | Frontend security — risky HTML patterns, env var exposure, auth/logout audit, AI self-penetration testing. | [mizchi/skills](https://github.com/mizchi/skills) |
| [frontend-review-state](./skills/frontend/frontend-review-state/) | State management — server/URL/form/UI classification, Jotai/Zustand/Redux patterns, over-globalization. | [mizchi/skills](https://github.com/mizchi/skills) |
| [frontend-review-testing](./skills/frontend/frontend-review-testing/) | Test infrastructure — vitest coverage, Playwright config, VRT setup, coverage merging. | [mizchi/skills](https://github.com/mizchi/skills) |
| [frontend-review-weekly](./skills/frontend/frontend-review-weekly/) | Weekly orchestrator — dispatches all review skills in parallel, diffs KPIs, produces a weekly report. | [mizchi/skills](https://github.com/mizchi/skills) |

### Expert Perspectives (used by weekly)

| Skill | Description | Reference |
|-------|-------------|-----------|
| [frontend-expert](./skills/frontend/frontend-expert/) | Component design, state management, DOM usage, DX, and build configuration. | [mizchi/skills](https://github.com/mizchi/skills) |
| [frontend-ops-expert](./skills/frontend/frontend-ops-expert/) | CI/CD, Scheduler, KPI ratchet, release process, Renovate/Dependabot health. | [mizchi/skills](https://github.com/mizchi/skills) |
| [react-expert](./skills/frontend/react-expert/) | Hooks discipline, re-rendering, Suspense/RSC, and Context design. | [mizchi/skills](https://github.com/mizchi/skills) |
| [performance-expert](./skills/frontend/performance-expert/) | Bundle size, LCP/CLS/INP, avoidable re-work, image and font optimization. | [mizchi/skills](https://github.com/mizchi/skills) |
| [security-expert](./skills/frontend/security-expert/) | XSS/CSRF, authorization boundaries, input validation, secrets handling, dependency CVEs. | [mizchi/skills](https://github.com/mizchi/skills) |

---

## Dependencies & Releases (`deps/`)

| Skill | Description | Reference |
|-------|-------------|-----------|
| [conventional-changelog](./skills/deps/conventional-changelog/) | Conventional Commits and automatic CHANGELOG generation. Compares release-please / changesets / git-cliff / towncrier. | [mizchi/skills](https://github.com/mizchi/skills) |
| [dep-lib-review](./skills/deps/dep-lib-review/) | Periodic dependency review for Node.js/pnpm — outdated triage, security audit, patch/minor/major batching strategy. | [mizchi/skills](https://github.com/mizchi/skills) |
| [upstream-fix-and-pin](./skills/deps/upstream-fix-and-pin/) | Fix an upstream library bug, open a PR, and pin to the git SHA while waiting for it to merge. | [mizchi/skills](https://github.com/mizchi/skills) |

---

## Testing & Browser (`testing/`)

| Skill | Description | Reference |
|-------|-------------|-----------|
| [playwright-cli](./skills/testing/playwright-cli/) | Run Playwright CLI commands interactively. | [microsoft/playwright-cli](https://github.com/microsoft/playwright-cli) |
| [playwright-test](./skills/testing/playwright-test/) | Best practices for Playwright Test — avoiding fixed waits, network triggers, DnD, shard/retry on GitHub Actions. | [mizchi/skills](https://github.com/mizchi/skills) |

---

## Security & Database (`security/`)

| Skill | Description | Reference |
|-------|-------------|-----------|
| [sql-security](./skills/security/sql-security/) | SQL security review — injection risk, query analysis, schema audit. | [mizchi/skills](https://github.com/mizchi/skills) |

---

## Environment & Observability (`env/`)

| Skill | Description | Reference |
|-------|-------------|-----------|
| [dotenvx](./skills/env/dotenvx/) | dotenvx env-var management — encrypting `.env` files, multi-environment juggling, committing encrypted secrets to git. | [mizchi/skills](https://github.com/mizchi/skills) |
| [otel-node](./skills/env/otel-node/) | Node.js OpenTelemetry setup — SDK init, auto-instrumentation, and the esbuild ESM silent-failure gotcha. | [mizchi/skills](https://github.com/mizchi/skills) |

---

## Language & Migration (`lang/`)

| Skill | Description | Reference |
|-------|-------------|-----------|
| [translate-programming-language](./skills/lang/translate-programming-language/) | Plan and execute language-to-language migrations with behavior parity. Covers runtime differences, oracle fixtures, shadow testing, and cutover. | [mizchi/skills](https://github.com/mizchi/skills) |

---

## Documentation & Research (`docs/`)

| Skill | Description | Reference |
|-------|-------------|-----------|
| [extract-glossary](./skills/docs/extract-glossary/) | Extract domain-specific terminology, tech stacks, and onboarding Mermaid diagrams from a repo or GitHub org. | [mizchi/skills](https://github.com/mizchi/skills) |
| [tech-article-reproducibility](./skills/docs/tech-article-reproducibility/) | Evaluate reproducibility of technical articles — simulate a first-time reader and surface missing steps before publication. | [mizchi/skills](https://github.com/mizchi/skills) |
| [tech-trend-watch](./skills/docs/tech-trend-watch/) | Long-term stack review using State of JS/CSS and Thoughtworks Technology Radar — ADOPT/TRIAL/ASSESS/HOLD mapping. | [mizchi/skills](https://github.com/mizchi/skills) |
| [utels-project-bootstrap](./skills/docs/utels-project-bootstrap/) | Register a utels.dev project and write the ingest token into a Cloudflare Worker wrangler secret. | [mizchi/skills](https://github.com/mizchi/skills) |
| [japanese-tech-writing](./skills/docs/japanese-tech-writing/) | Guidelines for writing and editing Japanese technical documentation with clear structure, rigorous reasoning, consistent formatting, and concise, readable prose. | [k16shikano/SKILL.md](https://gist.github.com/k16shikano/fd287c3133457c4fd8f5601d34aa817d#file-skill-md) |
| [argument-gap-edit](./skills/docs/argument-gap-edit/) | Detects and fixes weak arguments, structural gaps, and disruptive content in Japanese technical manuscripts. | [k16shikano/SKILL.md](https://gist.github.com/k16shikano/fd287c3133457c4fd8f5601d34aa817d?permalink_comment_id=6201959#gistcomment-6201959) |
| [readme-guidelines](./skills/docs/readme-guidelines/) | README.md templates and policies — template selection by project type, README-ja.md sync, and change-to-section update rules. | original |

---

## Meta / Skill Management (`meta/`)

Skills that operate on other skills or on Claude Code itself.

| Skill | Description | Reference |
|-------|-------------|-----------|
| [skill-selector](./skills/meta/skill-selector/) | Pick project skills via APM — two-phase: curated catalog first, broader search only when needed. | [mizchi/skills](https://github.com/mizchi/skills) |
| [skill-finder](./skills/meta/skill-finder/) | Discover and evaluate skills from outside the curated catalog across multiple registries. | [mizchi/skills](https://github.com/mizchi/skills) |
| [optimizing-descriptions](./skills/meta/optimizing-descriptions/) | Audit and rewrite `SKILL.md` description fields per the agentskills.io framework and mizchi's two-track trigger policy. | [mizchi/skills](https://github.com/mizchi/skills) |
| [retrospective-codify](./skills/meta/retrospective-codify/) | Codify trial-and-error lessons into ast-grep rules, skills, or CLAUDE.md rules after a fix lands. | [mizchi/skills](https://github.com/mizchi/skills) |
| [prompt-review](./skills/meta/prompt-review/) | プロンプトレビュー・対話履歴分析・理解度診断。 | [tokoroten/prompt-review](https://github.com/tokoroten/prompt-review) |
| [ddd-bdd-tdd-flow](./skills/meta/ddd-bdd-tdd-flow/) | New application/feature creation flow — DDD SUDO modeling → BDD Gherkin features → property-based tests → t_wada TDD implementation. | original |

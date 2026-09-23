---
name: frontend-review
description: >
  Use when reviewing or auditing an existing frontend codebase (React / TypeScript / Vite / Next.js and similar) —
  a first-look assessment ("what state is this repo in?"), a periodic health check that tracks KPIs against a
  baseline, or a focused review of CI speed, type/lint hygiene, dependencies and CVEs, test posture, frontend
  security (token storage, route guards, env exposure, XSS sinks), state-management architecture, or rendering
  performance. Use it even when the user only says "review the frontend", "why is our CI slow", "is our state
  management sane", or "check this app for security issues". Not for building a new feature (use
  ddd-bdd-tdd-flow), debugging one known bug, or backend-only code.
license: MIT
---

# Frontend Review

Audit a frontend repository, report findings as decisions rather than code comments, and keep the results
comparable over time. Condensed from mizchi's `frontend-review-*` skill family; each area below links to the
upstream skill for full checklists and examples. Read the upstream page only when an area needs more depth than
this file gives.

## Principles

These hold across every area. They are what make a review repeatable instead of a one-off opinion.

- **Measure first.** Reproduce a problem with a number (duration, count, size, profiler trace) and verify the fix
  with the same number. "Felt faster" is not evidence.
- **Ratchet.** Save KPIs as a baseline. Regressions must be fixed; improvements tighten the baseline. Never
  rewrite the baseline to hide a regression — if a regression is intended, update the baseline in the same PR so
  review sees it.
- **Classify before fixing.** A red test is a spec change, an implementation bug, or a wrong test — ask the human
  which. A CVE is weighted by whether user input can reach it at runtime, not by CVSS alone.
- **Promote repeats to rules.** A finding that recurs across three reviews should become a lint rule, ast-grep
  rule, codemod, or CI gate (see `retrospective-codify`). Propose it; do not silently implement it.
- **Report, don't rewrite.** Do not edit application code during a review. Output recommended PRs, one logical
  change each, so regressions stay attributable.
- **Human decides behavior.** The AI may act on auto-fixable lint/type errors, test additions for existing
  patterns, and dependency bumps that pass checks. Library additions/removals, architecture boundaries, and
  anything that changes what the app does are the human's call.

## Output layout

Write everything under `.frontend-review/` in the target repo:

```
.frontend-review/
  kpi/baseline.json        # commit this — the ratchet needs it
  kpi/audit-triage.md      # ignored CVEs with reasons (commit)
  report/latest/raw/*.json # raw command output (gitignore)
  report/latest/md/*.md    # per-area reports (gitignore)
  report/<YYYY-wWW>.md     # periodic report (commit)
```

Keep each area report under ~200 lines. Per-file detail stays in raw JSON; the report is for decisions.

The markdown here is read later by someone who was not in this session: the next periodic review diffs against
the last two reports, and anyone bumping a dependency needs to know why a CVE was ignored. Write every `.md` under
`.frontend-review/` as an [OKF](https://okf.md/spec/) concept (format: `okf-open-knowledge-format`) — YAML
frontmatter with a `type`, a one-sentence `description`, and `generated: { by: <tool>/<model>, at: <ISO 8601> }` —
so an agent or tool can find, date, and filter them without parsing prose:

| File | `type` | Also |
|---|---|---|
| `kpi/audit-triage.md` | `CVE Triage` | Each advisory in `sources` (`id`: the GHSA/CVE id, `resource`: the advisory URL), cited from the reason with a `[^id]` footnote. `stale_after`: the next monthly dependency review — an ignored CVE is a decision that expires, and a past `stale_after` makes every OKF reader flag it for re-triage. |
| `report/<YYYY-wWW>.md` | `Frontend Review Report` | `resource`: the repository URL at the commit reviewed, so reports compare like with like. |
| `report/latest/md/*.md` | `Frontend Review Area Report` | — |

`kpi/baseline.json` stays JSON. It is the machine-checked ratchet, and OKF describes data rather than replacing
data formats.

## Modes

1. **Triage (first look).** Classify the app (admin / consumer / B2B SaaS / EC / fintech / healthcare /
   IoT-ops / media) and note regulation (GDPR, PCI DSS, HIPAA). The class decides which checks are P0. Read
   `package.json`, README, `.github/workflows/`, and open issues. Write a scorecard, the **top 3 risks** (one
   sentence each, P0/P1), open questions for the owner, and which areas to review next. Do not propose fixes
   beyond the top 3. If there is no baseline yet, create it from this run.
2. **Area review.** Run only the areas the user asked for, or the ones triage flagged.
3. **Periodic review.** Run all areas, diff against `kpi/baseline.json`, list regressions (must fix) and
   improvements (update baseline), and compare with the last two periodic reports to find findings that
   appear three times in a row (rule-promotion candidates). Optionally dispatch parallel subagents, one per
   perspective — frontend architecture, React, performance, security, ops — each reading the raw JSON and
   writing a short opinionated report ([perspectives][weekly]).

## Areas

Collect with the listed commands (adapt to the repo's package manager and tools; skip what is not installed and
say so), then apply the checks.

### CI — [upstream][ci]

Collect: `gh run list --workflow <file> --limit 20 --json databaseId,createdAt,updatedAt,conclusion`, then
`gh run view <id> --log` for the slowest run.

- Targets: PR CI wall-clock < 5 min (slower CI gets bypassed), typecheck and lint < 30 s, install on cache hit
  < 15 s, one E2E shard < 50 s. A stage over 2× target deserves its own issue.
- Only the longest path in the job DAG matters. Find the slowest job, then its slowest step. One change per PR.
- Common misses: package cache on only some workflows; `corepack enable` without `pnpm/action-setup` (no pnpm
  cache); lint and typecheck serialized in one job; no `concurrency:`; shards with `fail-fast: true` or artifact
  upload without `if: ${{ !cancelled() }}`; Playwright browsers not cached. Details: `playwright-test` skill.

### Hygiene — [upstream][hygiene]

Collect: `tsc --noEmit` error count; counts of `any`, `as any`, `@ts-ignore`, `@ts-expect-error`; linter JSON
output (`eslint -f json` / `biome lint --reporter=json`); `knip --reporter json` for unused files, exports, and
deps; optionally a duplicate-code detector.

- These are the ratcheted KPIs. Report a KPI table with deltas and batch remediation by impact.
- Tool roles must not overlap: TypeScript = types, linter = AST bug patterns, formatter = formatting only,
  ast-grep = project-specific structure. Generated files belong in the formatter's ignore list.
- Flag source files over 500 lines (they usually mix concerns).

### Dependencies — [upstream][deps]

Collect: `pnpm outdated --format json` (or npm/yarn equivalent), `pnpm audit --prod --json`.

- Triage CVEs by where the code runs. For a browser-only SPA, RCE / path traversal / SSRF in a runtime dep are
  usually unreachable; prototype pollution, ReDoS, and XSS-producing libraries are P1–P0 when user input reaches
  them. For SSR / edge, treat all of these as P0. devDependencies matter only for supply-chain (postinstall) risk.
  Record every ignored CVE with a reason in `kpi/audit-triage.md`.
- Prefer web standards before recommending a library: `fetch` + `AbortController`, `URL` / `URLSearchParams`,
  `crypto.randomUUID()`, `structuredClone`, `Intl.*`, `Temporal`.
- Breaking upgrades go in standalone PRs; patch/minor updates can be batched. Update procedure and
  long-horizon replacement decisions: `sustainable-web-dev-loop` (references/dependencies.md).

### Testing — [upstream][testing]

Collect: `vitest` / `playwright` config, test counts, `coverage/coverage-summary.json` if present.

- Component tests query by role/label/text via Testing Library and interact with `user-event`, not internals.
- Mock at the network boundary (MSW), not with module mocks, so broken integration contracts still fail.
- Coverage guide: ~80% for pure lib code, ~60% for UI. Do not inflate coverage with implementation echoes.
- Start E2E with one case per route or controller branch. No fixed waits. Generate VRT snapshots in a Linux
  container matching CI.

### Security — [upstream][security]

Collect: `grep -rnE 'dangerouslySetInnerHTML|v-html|\.innerHTML\s*=' src`,
`grep -rnoE '(import\.meta\.env|process\.env)\.[A-Z0-9_]+' src | sort -u`,
`git log --all --full-history -- '*.env'`.

- Every HTML sink: is the input sanitized?
- `VITE_*` / `NEXT_PUBLIC_*` values ship to the client — never secrets. Read env in one config module that
  throws at startup when a required key is missing.
- Tokens: prefer `httpOnly` cookies; flag `localStorage` / `sessionStorage`. Refresh must be deduplicated
  (share one in-flight promise). Route guards need a loading state and a validated `redirect` target (open
  redirect). Every protected API must also authorize server-side.
- Logout must revoke the server session, clear query caches and auth stores, then navigate.
- Desk review only: never exploit or scan production. Draft a staging header checklist (CSP, HSTS, frame
  options, nosniff, cookie flags, 401/403 checks) for the human to run.

### State management — [upstream][state]

Collect: which of Jotai / Zustand / Redux / Context are used and how much; sample the largest stores.

- Classify state: server → TanStack Query / SWR; URL → search params (`nuqs`); form → React Hook Form;
  UI local → `useState`; UI global → Jotai / Zustand / Context, minimal scope. Server, URL, or form state in a
  global store is a design bug.
- Zustand: select fields (`useShallow` for several), never the whole store. Jotai: small atoms plus derived
  atoms, no monolithic object atom. Context: only for low-frequency values; split by concern.
- Deep-linkable state flows URL → store → UI with one owner.

### Rendering performance — [upstream][perf]

Collect: counts of `memo` / `useMemo` / `useCallback`, virtualization, `useTransition` / `useDeferredValue`;
bundle size and Lighthouse data if the repo produces them.

- Profile before recommending memoization; label unmeasured suggestions "unconfirmed — profile first".
- Memo is defeated by new object/array/function props on every render.
- Lists over ~100 items need virtualization (`@tanstack/react-virtual`). Wrap heavy non-urgent updates in
  `useTransition`.
- High-frequency data (charts, maps, sensors) should bypass React state and draw to canvas/WebGL via refs.
- Web Vitals targets: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1, JS ≤ 200 KB gzip.

## Related

- `playwright-test` — E2E structure, sharding, flaky handling
- `sustainable-web-dev-loop` — the principles behind this skill, plus dependency, deploy, and observability defaults
- `retrospective-codify` — turning repeated findings into lint rules
- `unresolved-questions` — owner questions the review cannot settle
- `adr-writing-ja` — recording an architecture decision the review triggers
- `okf-open-knowledge-format` — the OKF format of the committed review markdown

Upstream source (pinned): [mizchi/skills @ a3f2f1b][root]. Its audit scripts, checklists, and data files are
not published; the commands above replace them.

[root]: https://github.com/mizchi/skills/tree/a3f2f1bac20fc500c2688ffe6ca4ce048d0cfedc
[weekly]: https://github.com/mizchi/skills/blob/a3f2f1bac20fc500c2688ffe6ca4ce048d0cfedc/frontend-review-weekly/SKILL.md
[ci]: https://github.com/mizchi/skills/blob/a3f2f1bac20fc500c2688ffe6ca4ce048d0cfedc/frontend-review-ci/SKILL.md
[hygiene]: https://github.com/mizchi/skills/blob/a3f2f1bac20fc500c2688ffe6ca4ce048d0cfedc/frontend-review-hygiene/SKILL.md
[deps]: https://github.com/mizchi/skills/blob/a3f2f1bac20fc500c2688ffe6ca4ce048d0cfedc/frontend-review-deps/SKILL.md
[testing]: https://github.com/mizchi/skills/blob/a3f2f1bac20fc500c2688ffe6ca4ce048d0cfedc/frontend-review-testing/SKILL.md
[security]: https://github.com/mizchi/skills/blob/a3f2f1bac20fc500c2688ffe6ca4ce048d0cfedc/frontend-review-security/SKILL.md
[state]: https://github.com/mizchi/skills/blob/a3f2f1bac20fc500c2688ffe6ca4ce048d0cfedc/frontend-review-state/SKILL.md
[perf]: https://github.com/mizchi/skills/blob/a3f2f1bac20fc500c2688ffe6ca4ce048d0cfedc/frontend-review-performance/SKILL.md

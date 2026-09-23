---
name: sustainable-web-dev-loop
description: >
  Use when designing or changing how a web service is built, shipped, and kept healthy as it grows — CI/CD
  pipelines and quality gates, KPI or performance baselines, deploy and rollback, observability
  (OpenTelemetry, error tracking, slow queries), dependency upgrades and library replacement, language or
  runtime migrations, or query-plan / schema checks. Also use when the same review finding, incident, or
  CI failure keeps coming back and the user wants it to stop, or when deciding what an AI agent may change
  on its own. Not for a single code change with no process or pipeline implication.
license: MIT
---

# Sustainable Web Dev Loop

The principles below are induced from mizchi's skill collection, where the same loop recurs across frontend
review, CI tuning, deployment, SQL auditing, formal methods, and prompt tuning: **measure, ratchet, promote
repeats into mechanisms, and keep generation separate from judgment.** Tool-specific skills are just this loop
applied to one stack. Use the principles to shape any process decision; use the sections after them for the
concrete defaults. For a frontend codebase audit, use `frontend-review`, which applies this loop.

## Principles

1. **Reproduce with a number, verify with the same number.** Durations, counts, sizes, traces, query plans.
   An impression is not evidence, and a fix without a before/after number cannot be defended later.
2. **Ratchet.** Store the baseline in the repo. Regressions fail the gate; improvements tighten the baseline.
   Never loosen a baseline to get green — an intended regression updates the baseline in the same PR so the
   reviewer sees it. The same rule applies to specs and models: do not weaken a property to pass.
3. **Promote repeats into mechanisms.** A finding seen three times becomes a lint rule, ast-grep rule, codemod,
   CI gate, or script. Prefer, in order: machine-checkable rule → one-line always-on rule (CLAUDE.md) → skill.
   Prose rules are the least reliably followed. See `retrospective-codify`.
4. **Separate generation from judgment.** The author cannot grade their own output. Let a solver, test, oracle,
   fresh agent, or different model decide; generate expected values from a trusted source (the old runtime, a
   standard) instead of writing them by hand. See `skill-creator` for the same idea applied to prompts.
5. **Classify a failure before fixing it.** Red test → spec changed, implementation bug, or wrong test (a human
   decides). CVE → reachable at runtime or not. Drift → spec, code, model, harness, or unresolved decision.
   Unresolved domain questions are deliverables, not failures (`unresolved-questions`).
6. **Split AI and human responsibility.** The agent may act on mechanical fixes, test additions for existing
   patterns, and dependency bumps that pass all checks. Behavior changes, library additions/removals,
   architecture boundaries, and baseline policy need an explicit human decision (record lasting ones with
   `adr-writing-ja`). Propose → approve → apply.
7. **Keep the loop fast, cheap checks first.** PR CI over ~5 minutes gets bypassed. Order gates so the cheapest
   fail first, and make the first signal available on day one (a slow-query log line beats a dashboard that
   never gets configured).
8. **One change per PR, one theme per iteration.** Bundled changes make regressions and wins unattributable.

## Shipping safely

- **Deploy with a way back.** Capture the currently deployed version, deploy, run a smoke check, and roll back
  automatically if it fails; fail the job only after the rollback. Staging deploys from `main`, production from
  a `release` branch or tag. For traffic shifting prefer native weighted routing (e.g. ALB weighted target
  groups) before adding a deploy controller; set alarm thresholds for production load (a single 5xx should not
  roll back a canary). Keep the previous runtime deployable for one rollback window.
- **Reproducible builds.** Frozen lockfile installs (`--frozen-lockfile`, `npm ci`), third-party Actions pinned
  to full commit SHAs, git dependencies pinned to full 40-char SHAs (`upstream-fix-and-pin`), tool versions
  pinned, VRT snapshots generated in the same Linux image as CI.
- **CI traps worth remembering.** Package cache on every workflow, not just one; `concurrency:` that cancels
  PR runs but never `main` deploys; `fail-fast: false` plus `if: ${{ !cancelled() }}` on shard artifact
  uploads; scheduled workflows also get `workflow_dispatch:`; quote step names containing `: `; `set +e` before
  capturing an exit code; never interpolate `github.event.head_commit.message` into shell — use `github.sha`.
- **Least privilege for automation.** Scope cloud OIDC roles to one workflow file (`job_workflow_ref`), not just
  the repo. Give AI agents read-only roles with explicit denies. Keep one encrypted source for secrets so one
  rotation rotates everything. Anything bundled for the client (`VITE_*`, `NEXT_PUBLIC_*`) is public.

## Data layer

- Commit the query plans of a named-query catalog (`EXPLAIN QUERY PLAN` or the engine's equivalent) and fail CI
  when a query regresses from index search to full scan. A scan on a small table is a flag, not a verdict.
- Indexes that no SELECT uses may still be load-bearing for `ON DELETE CASCADE` (SQLite does not index FK
  columns automatically). Check before dropping.
- Treat N+1 detection (queries inside loops) as a review aid, not a gate — batch inserts are legitimate.
- Cheap lints catch the rest: duplicate query names, `SELECT *`, `LIKE '%…%'`, mixed placeholder styles.

## Dependencies and migrations

- Dependency review, CVE triage, update batching, and long-term replacement: [references/dependencies.md](references/dependencies.md).
- Moving code between languages or runtimes: freeze a narrow contract, generate fixtures from the pinned source
  runtime, route runtime quirks through a compatibility layer that has a deletion plan, and verify with
  replay/shadow traffic and a canary before switching. Refactor only after parity is proven.

## Observability

Signal choice, span design, sampling, and the Node.js bundling pitfall: [references/observability.md](references/observability.md).

## Agents in the loop

Default to one agent. Add agents only for independent work or genuinely different information/tools, and only
when the gain beats the cost. Give each worker a disjoint write scope, return patches plus evidence (not
transcripts), let one integrator write the trunk, and verify in a separate context.

## Source

Induced from [mizchi/skills @ a3f2f1b][root], chiefly `frontend-review-*`, `actions-ci-tuning`,
`cloudflare-workers-cd-rollback` (and its `references/cd-traps.md`), `aws-ecs-codedeploy-blue-green`,
`aws-github-oidc-scoped-role`, `sql-plan-audit`, `sql-schema-audit`, `sql-lint`, `opentelemetry`,
`translate-programming-language`, `formal-methods-reconciler`, `formal-methods-drift-guard`,
`empirical-prompt-tuning`, `multi-agent-orchestration`, and `retrospective-codify`. Read those for
stack-specific templates.

[root]: https://github.com/mizchi/skills/tree/a3f2f1bac20fc500c2688ffe6ca4ce048d0cfedc

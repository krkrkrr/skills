# Dependencies: review, update, replace

Absorbed from mizchi's `dep-lib-review` and `tech-trend-watch`.

## When to run

Monthly; before a major release or freeze; when CI's audit reports a vulnerability; when a core library
(React, Vite, TypeScript, …) ships a new major. If Renovate or Dependabot is configured, start from its open PRs.

## Collect

```bash
pnpm outdated --format json          # current / wanted / latest per package
pnpm audit --prod --json             # runtime CVEs only
ls .github/renovate.json renovate.json .github/dependabot.yml 2>/dev/null
```

## Triage CVEs by reachability, not CVSS

| CVE type | devDep only | Browser SPA | SSR / Edge |
|---|---|---|---|
| RCE, path traversal, SSRF | ignore | usually unreachable | P0 |
| Prototype pollution, ReDoS | ignore | P1 if user input reaches it | P0 |
| XSS via an HTML-producing library | ignore | P0 | P0 |
| Supply chain (install scripts) | P0 | P0 | P0 |

Record every ignored CVE with its reason. Do not run a forced audit fix: it can jump majors silently.

## Update in batches

| Update | Strategy |
|---|---|
| Patch | Batch all in one PR. |
| Minor | Read changelogs for deprecations; batch the non-breaking ones. |
| Major | One package per PR, never mixed with other work. Run the official codemod first if one exists, then grep / ast-grep for removed APIs. |

Update `@types/*` together with its runtime package; drop `@types/<pkg>` once the package ships its own types.
If pnpm install fails after a major bump with stale-metadata errors, `pnpm store prune`, or regenerate the
lockfile and commit it in the same PR.

Before merging: typecheck, lint, unit tests, build (no bundle-size jump over ~5%), E2E smoke, audit clean or
triaged, VRT regenerated in the CI image if UI changed.

## Choosing and replacing libraries

Prefer the platform first: `fetch` + `AbortController`, `URL` / `URLSearchParams`, `crypto.randomUUID()`,
`structuredClone`, `Intl.*`, `Temporal`, modern `Array` / `Object` methods. Then require tree-shaking, a release
in the last six months, and a small bundle cost.

Evaluate replacement with external data, not taste:

- **State of JS / State of CSS** (annual; JSON at `assets.devographics.com/surveys/js<YYYY>/en-US/results.json`):
  high satisfaction ≥ 70%, low ≤ 55%. High usage + low satisfaction = legacy, plan exit. Low usage + high
  satisfaction = emerging, adopt only if the incumbent is failing. A "would not use again" spike is the
  strongest exit signal.
- **Thoughtworks Tech Radar** (quarterly): ADOPT / TRIAL / ASSESS / HOLD. It lags the JS ecosystem, so never use
  it alone.

Investigate a switch when any two hold: satisfaction fell two years running; no major release in six months
while issues pile up; maintainer departure or deprecation notice; a clearly better alternative with a realistic
migration path. For each candidate estimate usage count, target, whether old and new can coexist, and whether
the risk is runtime or build-only. Emerging tools do not justify switching away from a healthy incumbent.

## When the fix has to come from upstream

Open the upstream PR and pin downstream to the branch's full commit SHA meanwhile: `upstream-fix-and-pin`.

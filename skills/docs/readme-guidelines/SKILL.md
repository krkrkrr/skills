---
name: readme-guidelines
description: Templates and policies for README.md files. Use when creating a new README.md, updating an existing one after code changes, or creating/syncing the Japanese version README-ja.md. Covers template selection by project type, section-level writing rules, and which sections to update for which kind of change.
---

# README Guidelines

Rules for creating and maintaining README.md files. A README is the front door of a project: within 30 seconds of opening it, a reader should know what the project is and how to use it. This skill defines which template to start from, what every README must satisfy, and how to keep an existing README in sync with the code.

## When to use

- Creating a README.md for a new project or a project that lacks one
- Updating a README.md after a code change (new feature, setup change, API change)
- Creating or syncing the Japanese version, README-ja.md
- Reviewing an existing README against these policies

When not to use:
- Writing `SKILL.md` files for this skills repository (follow `skills/CLAUDE.md` instead)
- CHANGELOG, CONTRIBUTING, or other non-README documents
- Progressive READMEs of projects generated via `ddd-bdd-tdd-flow` — that skill's README lifecycle takes precedence during its phases

## Template selection

Pick the template by project type. Each reference file contains a copy-pasteable skeleton plus per-section writing guidance.

| Project type | Signals | Template |
|---|---|---|
| CLI / small tool | Single purpose, few commands, personal or niche use | [references/minimal.md](references/minimal.md) |
| Published library | Distributed via npm / PyPI / crates.io etc., has a public API | [references/oss-library.md](references/oss-library.md) |
| Application / service | Deployed and operated (including internal tools); has environments, setup, and a team | [references/application.md](references/application.md) |

When in doubt, start from the minimal template and promote later: a small README that is accurate beats a large one that is padded. Promote to `oss-library.md` when the project gains a public API surface; promote to `application.md` when it gains deployment and operational concerns.

## Common policy (all templates)

- The first line is the project name; the second is a one-line description of what it does. No prose before these.
- Every command and code example must be verified to work before it is written down. Do not invent plausible-looking commands.
- Do not duplicate information that is obvious from the code or generated files (full option lists, directory trees, dependency lists). Duplicated detail drifts out of date and becomes misinformation.
- Add sections only when there is content for them. Never leave empty placeholder sections ("TBD", "Coming soon").
- Keep the skeleton's section order. Readers scan READMEs by convention: identity → install → usage → detail.
- License section comes last, when the project is published.

## Language policy

- **README.md is the source of truth and is written in English.**
- **README-ja.md is the Japanese version**, kept in sync with README.md.
- Both files link to each other at the top, immediately after the one-line description:
  - README.md: `[日本語版 (Japanese)](README-ja.md)`
  - README-ja.md: `[English](README.md)`
- When README.md changes, update README-ja.md in the same change. A stale README-ja.md is worse than none; if it cannot be kept in sync, delete it.
- README-ja.md is a translation, not a separate document: same section structure, same code blocks (code and commands stay in English/as-is; only prose is translated).
- For Japanese prose quality, follow [../japanese-tech-writing/SKILL.md](../japanese-tech-writing/SKILL.md).

## Update policy

When code changes, update the README in the same commit or PR. Map the change to sections:

| Change | Sections to update |
|---|---|
| New feature / new CLI flag | Usage, Features, Quick Start |
| Dependency or setup procedure change | Install, Prerequisites, Setup |
| Public API change | API |
| Architecture change | Architecture, Overview |
| Breaking change | The affected section, plus a migration note near the top |
| Feature removal / deprecation | Delete or mark the affected section — removal is part of updating |
| Project renamed / repurposed | Title, one-line description, Why/Overview |

Rules when updating:

1. Re-run the commands already written in the sections you touch; fix any that no longer work.
2. Sync README-ja.md in the same change.
3. Deleting outdated content counts as an update. Prefer deletion over hedging language ("may not work on newer versions").
4. If the project has outgrown its template (e.g. a tool grew a public API), migrate to the next template rather than bolting sections onto the old structure.

## Pitfalls

- **Screenshot-driven READMEs**: screenshots rot faster than text and are invisible to grep. Use them only for genuinely visual output, and keep the textual usage example authoritative.
- **Badges before content**: badges are decoration. Never let them push the one-line description below the fold; the oss-library template caps them at one row.
- **Writing for yourself**: the reader has not seen the code. Expand project-internal jargon on first use, or link to where it is defined.
- **README as a design doc**: rationale, alternatives considered, and roadmaps belong in docs/ or ADRs. The README states what *is*, not what was considered.

## Related

- `japanese-tech-writing` — prose norms for README-ja.md
- `ddd-bdd-tdd-flow` — owns the progressive README lifecycle for projects it generates; this skill applies after that flow completes

# Skills Repository

Personal Claude Code agent skills library.

## Overview

Every skill lives at the top level of `skills/` — one directory per skill,
`skills/<skill-name>/` — and is installed individually into
`~/.claude/skills/<skill-name>/`.

There are **no category subdirectories**. The directory tree is flat and mirrors
the install layout, and carries **no categorization of its own**. Category
grouping has no runtime meaning (skills install flat), so the only human-facing
map of the library is [README.md](./README.md), which groups skills by **use
case** derived from the skill-collaboration Markov model — not by directory.

## Repository Structure

```
skills/
  <skill-name>/
    SKILL.md          # Required. Frontmatter + body.
    references/       # Optional. Static reference files loaded on demand.
```

## Naming Convention

**The directory name must exactly match the `name:` field in `SKILL.md` frontmatter.**

Verify with:

```bash
for d in skills/*/; do
  name=$(basename "$d")
  fm=$(grep '^name:' "$d/SKILL.md" 2>/dev/null | head -1 | sed 's/name: //')
  [ "$name" != "$fm" ] && echo "MISMATCH: $name -> $fm"
done
```

## SKILL.md Frontmatter

Required fields:

```yaml
---
name: skill-name         # Must match directory name
description: >           # Triggering contract seen by the agent at startup.
  One-paragraph description shaped as a triggering condition:
  "Use when...", explicit "When NOT to use" cue if meta-skill.
license: MIT             # Per-skill license (this repo has no single license)
---
```

Optional fields:

```yaml
allowed-tools: Read, Write, Bash   # Restrict tool access
context: fork                       # Isolate context
disable-model-invocation: true      # Prevent sub-model calls
```

## README Maintenance (REQUIRED — update in the same change as any skill change)

Because the directory tree carries no categorization, [README.md](./README.md)
is the **single source of truth** for how the library is organized. It has two
views that must stay in sync:

1. **Use-case map** — skills grouped by the Markov-cluster use cases (UC1–UC5).
   This is a *cover*, not a partition: a bridge skill may appear under more than
   one use case.
2. **All skills (A–Z)** — the complete inventory table (description, reference,
   license).

**Whenever you add, remove, rename, or re-scope a skill, you MUST update
README.md as part of the same commit:**

- **Add** → add a row to the A–Z table (description / reference / license) **and**
  place the skill under its primary use case in the use-case map. If it serves
  more than one use case, tag the secondary one(s).
- **Remove** → delete its A–Z row and every use-case entry.
- **Rename** → update the directory name, the `name:` frontmatter, **and** every
  link/label in both README views.
- **Re-scope** (the skill's job changes) → re-evaluate its use-case placement and
  move it if the primary use case changed.

[README-ja.md](./README-ja.md) is a full Japanese mirror of README.md (same
sections, same code blocks, prose translated per `japanese-tech-writing`).
**Apply every README.md change to README-ja.md in the same commit.** README.md
stays English-only, and neither file links to the other.

Invariant: every skill in the A–Z table appears under at least one use case, and
every use-case entry exists in the A–Z table. Verify tree ⇄ README agreement:

```bash
ls -d skills/*/ | sed 's#skills/##;s#/##' | sort > /tmp/tree.txt
for f in README.md README-ja.md; do
  grep -oE '\./skills/[a-z0-9-]+/' "$f" | sed 's#\./skills/##;s#/##' | sort -u > /tmp/readme.txt
  diff /tmp/tree.txt /tmp/readme.txt && echo "OK: $f matches tree"
done
```

When the use-case model itself needs rethinking (new workflow clusters emerge),
re-derive the grouping from the skill-collaboration Markov chain rather than
inventing ad-hoc buckets. Transitions are the hand-offs each skill names in its
`SKILL.md` and `references/`; a skill's primary use case is where most of its
inbound transitions come from, and the mermaid edges are the transitions that
cross use-case boundaries.

## Local Sync

When editing a skill in this repo, mirror the change immediately so the current session picks it up. Use `cp -rT` (not `cp -r`): when the target directory already exists, `cp -r` nests the source inside it instead of overwriting.

```bash
cp -rT skills/<skill-name>/ ~/.claude/skills/<skill-name>/
```

Or sync all skills at once:

```bash
for d in skills/*/; do
  name=$(basename "$d")
  cp -rT "$d" ~/.claude/skills/"$name"/
done
```

## Language

- `SKILL.md` files are written in **English** as the primary source.
- Japanese is acceptable in `description` and body when the skill is specifically designed for Japanese-language tasks (e.g., `japanese-tech-writing`).

## Install

```bash
cp -rT skills/<skill-name>/ ~/.claude/skills/<skill-name>/
```

全スキルを一括同期:

```bash
for d in skills/*/; do
  name=$(basename "$d")
  cp -rT "$d" ~/.claude/skills/"$name"/
done
```

## What NOT to Commit

- `node_modules/`, build output, lock files generated by local tooling
- Anything under `~/.claude/` (local install targets, not source)

# The rest of the tree

**The design documents are in "Where everything lives" in `SKILL.md`; they are not
repeated here.** What follows is everything that is *not* a model.

```
doc/
  README.md               index. one screen. everything reachable from here
  testing-strategy.md     which layer is guarded by what. **repo-wide, not per context**
  questions/              unresolved items that outlive a session.
                          **see the `unresolved-questions` skill**
  ADR/NNNN-<decision>.md  decisions and why. **superseded ones stay, with a pointer**
  reference/              material you were given. **do not edit**
  evidence/               what you measured. **append only; corrections on a new line**
  increments/<date>-<name>/   requirements.md and the like. **frozen once the work lands**
  environment/            **not the domain.** how it is run and checked (`ENV-`)
    deployment.md   features/*.feature

test/  unit/ integration/ e2e/
src/   <module>.<ext>
```

**`evidence/` and `reference/` are separate on purpose.** One says "we saw this",
the other says "we were told this". Merged, a reader cannot tell how strong a claim
is — and the two disagree often enough that it matters.

**`increments/` is frozen, and that is the point.** It holds how the work went
wrong and got fixed. `context/` says how things are *now*. Keeping them apart is
what lets a reader trust that `context/` is current.

## Every markdown file is an OKF concept

`doc/` is an [OKF](https://okf.md/spec/) bundle. Every `.md` in it opens with YAML
frontmatter carrying at least `type`, `title`, and a one-sentence `description`.
The type is fixed by the file's place in the tree — one role, one type, so a reader
filtering by type gets exactly one kind of document:

| File | `type` |
|---|---|
| `README.md` | `Documentation Index` |
| `system-context.md` | `System Context` |
| `use-cases.md` | `Use Case Catalog` |
| `glossary.md` | `Glossary` |
| `context/<bc>/domain-model.md` | `Domain Model` |
| `context/<bc>/object-model.md` | `Object Model` |
| `context/<bc>/constraints.md` | `Constraints` |
| `testing-strategy.md` | `Testing Strategy` |
| `ADR/NNNN-*.md` | `Architecture Decision Record` — the rest of its frontmatter per `adr-writing-ja` |
| `questions/<status>/<subject>/NNNN-*.md` | `Question` — per `unresolved-questions`, whose index is `questions/index.md` |
| `reference/*.md` | `Reference` |
| `evidence/*.md` | `Evidence` |
| `increments/<date>-<name>/requirements.md` | `Requirements` |
| `increments/<date>-<name>/test-list.md` | `Test List` |
| `environment/*.md` | `Environment` |

```markdown
---
type: Domain Model
title: Billing — domain model
description: Language, aggregates, and matching src of the billing context.
---
```

**`doc/README.md` keeps its name.** GitHub shows it when someone opens `doc/`, and
every phase above names it. OKF reserves only `index.md` and `log.md`, so a
`README.md` with a `type` is an ordinary conformant concept. Do not add a
`doc/index.md` beside it — two indexes is one fact with two homes.

**The type is what keeps `evidence/` and `reference/` apart for a machine reader,**
the same way the directories do for a person. Give a `Reference` file `sources`
naming where it came from (`resource`, `title`, and `last_modified` if the material
shows a date); give an `Evidence` file `generated: { by: <who measured>, at: … }`.
Prepending frontmatter is not editing the material — the body stays byte-for-byte —
so it does not break "do not edit", "append only", or "frozen". Non-markdown
material (PDFs, `.feature` files, test code) stays as it is; OKF references
domain-specific formats rather than replacing them.

**Link between documents with relative paths** (`../system-context.md`). OKF prefers
bundle-absolute links (`/system-context.md`), but GitHub resolves a leading `/` from
the repository root, not from `doc/`, so those links break for a human reader.

**Check it mechanically.** The documentation check should fail on any `doc/**/*.md`
other than `index.md` / `log.md` whose frontmatter has no non-empty `type`. For a
fuller report (reserved-file structure, missing descriptions, broken links), run
`bash <okf-open-knowledge-format skill dir>/scripts/validate.sh doc`.

**Adopting this in an existing repository:** add frontmatter to every existing
`doc/` markdown file in one dedicated commit, including frozen increments and
append-only evidence (see above for why that is allowed). A bundle that is half
converted is not conformant, and a reader cannot tell which half to trust.

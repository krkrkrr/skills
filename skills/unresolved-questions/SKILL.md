---
name: unresolved-questions
description: >
  Record and manage things that could not be resolved now — unknowns, provisional
  decisions with weak evidence, and work deliberately left alone — as one file per
  question under `doc/questions/<status>/<subject>/NNNN-slug.md`, where the
  directory *is* the status. Use this whenever you hit something you cannot settle
  in this session and are tempted to leave a TODO, write "provisional" in a code
  comment, or drop a row in a table; whenever a previously open question gets
  answered and needs closing out; whenever the user asks what is still outstanding,
  what is blocked, or what was deliberately skipped; and whenever you are deciding
  whether it is safe to touch something that was previously ruled out of bounds.
  Also use it when scattered TODO / FIXME / "暫定" / "未実測" markers need to be
  consolidated. Not for tracking planned feature work with a known solution — that
  is a backlog, and a question is something nobody yet knows the answer to.
license: Unlicense
---

# Unresolved questions

Some things cannot be settled in the session that discovers them. A measurement
needs hardware you do not have. A number was picked because something had to be
picked. A parameter looks writable but might silence an output, so nobody tried.

These need a home. Without one they become `TODO` comments that nobody greps for,
or rows in a table that get deleted the moment they stop feeling urgent — taking
the reasoning with them.

## The shape

```
doc/questions/
  index.md                      the index — every question listed once
  open/<subject>/NNNN-slug.md       not known
  deferred/<subject>/NNNN-slug.md   deliberately not touched
  answered/<subject>/NNNN-slug.md   settled
  abandoned/<subject>/NNNN-slug.md  given up on
```

`<subject>` groups questions by what they are about (`meters/`, `routing/`,
`protocol/`). It is a filing aid, not an identifier — a question keeps its number
when its subject or status changes.

Numbers are unique across the whole of `doc/questions/`, never per subject or per
status, because code comments cite them as `Q-<N>` and a citation must point at
exactly one file. The next number is the highest one anywhere, plus one (the
command prints nothing before the first question; start at `0001`):

```bash
find doc/questions -name '[0-9][0-9][0-9][0-9]-*.md' \
  | sed -E 's#.*/([0-9]{4})-[^/]*$#\1#' | sort -n | tail -1 \
  | awk '{printf "%04d\n", $1 + 1}'
```

## The status is the directory

**Write the status in exactly one place: the path.** When it changes, `git mv`
the file. The move lands in history, which is more than a table row ever gave you.

There is one exception, and it exists only so a reader who opens the file directly
is not lost: a single line near the top naming the current directory. Keep it in
step with the path — if you move the file, fix the line in the same commit.

```markdown
---
type: Question
title: "Q-<N>: <the question, phrased as a question>"
description: <one sentence: what is unknown and what it blocks>
generated: { by: <actor>, at: <ISO 8601 UTC> }
---

# Q-<N>: <the question, phrased as a question>

**Status: `open`** — the directory this file sits in is the status.
**`git mv` it when that changes.** Do not write the status anywhere else.

## The question
## What it would take
## What is known          <- including every candidate already ruled out
```

## Each question is an OKF concept

Questions are read by people and agents who were not there when they were filed —
the next session, another skill (`ddd-bdd-tdd-flow` reads `open/` and `deferred/`
before it starts), a reviewer deciding whether something is safe to touch. So
`doc/questions/` is written as an [OKF](https://okf.md/spec/) bundle: a directory
of markdown files, each opening with YAML frontmatter whose `type` says what it
is. Any OKF-aware agent or tool can then list, filter, and link the questions
without learning this skill's conventions first. The format itself is in
`../okf-open-knowledge-format/SKILL.md`.

- **`type: Question`** — always, in every directory. The type says what the
  document is, not how far along it is.
- **`title`** — the same text as the `#` heading, `Q-<N>:` included, so the number
  a code comment cites is what every listing shows. Quote it: `Q-12: …` contains
  `: `, which YAML would otherwise read as a nested key. The question as posed
  never changes, so the heading and the title never drift apart.
- **`description`** — one sentence. The index shows it next to the title, which
  is what makes a review of fifty questions possible without opening fifty files.
- **`generated`** — who filed it: `human:<id>` for a person, `<tool>/<model>`
  (e.g. `claude-code/claude-opus-5-5`) for an agent. `at` is when it was filed.

**Do not add OKF's `status` or `stale_after` keys.** OKF's `status` describes the
document (`draft`, `stable`, `deprecated`), not the question; a question file is a
stable, accurate record whether it sits in `open/` or `answered/`, so the default
is already right. The question's state is the path — which OKF also exposes, since
a concept's ID *is* its path (`open/routing/0012-retry-count`). Writing the state
into frontmatter as well would be the second source of truth the rule above
forbids.

## The four states

| | Means | Leaves when |
|---|---|---|
| `open/` | Nobody knows the answer | It is answered → `answered/` |
| `deferred/` | **We know how to find out and chose not to** | The unblocking condition is met → `open/` |
| `answered/` | Settled | Never |
| `abandoned/` | Out of ideas, or no mechanism exists | A new lead appears → `open/` |

`open/` and `deferred/` look similar and are not. **"Not done yet" is work waiting
to be picked up; "deliberately left alone" is a decision someone made.** If you
file something as deferred, say why, and say what would let you undo that — a
deferral with no unblocking condition is just an unknown that has been hidden.

## The answer does not live here

When a question gets answered, the answer goes where answers go: a measurement to
wherever the project keeps evidence, a judgement call to an ADR or equivalent (`adr-writing-ja` for Japanese ADRs).
Then `git mv` the question file to `answered/`, fix its status line, and link to
where the answer landed.

Keeping the answer in two places guarantees one of them goes stale, and the copy
people trust is rarely the one that got updated.

**So what is left in the file is worth being clear about, because it is the whole
reason for keeping it:** the question as it was originally posed, and everything
that was tried and missed.

> A question deleted from a table takes with it "we tried these five things and
> all of them missed." The next person tries the same five. Recording a dead end
> is cheap; rediscovering one is not.

**A question that stays in `open/` after it has been answered is worse than having
no list at all** — the next reader trusts it and re-investigates something settled.
Close questions out in the same commit that answers them.

## Point at it from where the work is blocked

A question that only exists in `doc/questions/` is half-filed. If a code comment
says the retry count is provisional, or a rule says a parameter is untested, name
the question there:

```ts
/** Retry only on transport failure. **5 has no justification. Provisional** (Q-12). */
```

Now a reader of the code can find the question, and a reader of the question can
find what is blocked on it. Without the link both sides know, and neither can act.

## Reviewing what is outstanding

`doc/questions/index.md` lists every question once, one section per status. It
is OKF's reserved index file, so an agent reads it first to see what exists
before opening anything. Regenerate it whenever a file is added or moved — a
stale index is the same defect as a stale answer. Generate it from the paths and
frontmatter rather than editing it by hand, so the index cannot disagree with the
directories:

```bash
fm() { sed -n "2,/^---\$/{s/^$1: *//p}" "$2" | head -1 | sed 's/^"\(.*\)"$/\1/'; }
for status in open deferred answered abandoned; do
  files=$(find "doc/questions/$status" -name '[0-9][0-9][0-9][0-9]-*.md' 2>/dev/null | sort -t/ -k5)
  [ -n "$files" ] || continue
  printf '# %s\n\n' "$status"
  for f in $files; do
    rel=${f#doc/questions/}; subject=${rel#*/}; subject=${subject%%/*}
    echo "* [$(fm title "$f")]($rel) - $subject: $(fm description "$f")"
  done
  echo
done > doc/questions/index.md
```

A repository that still has the older `doc/questions/README.md` table: `git rm` it
in the same commit that first generates `index.md`, and add frontmatter to the
existing question files then too. Under OKF every non-index markdown file in the
bundle needs a `type`, so a `README.md` left behind would make the bundle
non-conformant — and two indexes is one too many anyway.

Commit the regenerated index in the same commit as the move or addition.

When reviewing, look past the individual rows for **questions stuck on the same
thing**. Three questions all waiting on one enum table is not three problems; it
is one, and finding that table clears all three. That grouping is usually invisible
until the questions sit next to each other, which is one of the reasons to keep
the index.

## Common failures

| Failure | Consequence | Instead |
|---|---|---|
| Leaving it as a `TODO` in code | Nobody greps for it; it survives years | File it, then point at the file from the code |
| Deleting the row when you give up | The dead ends go too; the next person repeats them | Move to `abandoned/` with what was ruled out |
| Writing the status in the body only | Two sources of truth; the body wins by accident | Path is the status; the body line mirrors it |
| Copying the answer into the question | One copy goes stale | Link to where the answer lives |
| `deferred/` with no unblocking condition | An unknown wearing a decision's clothes | State what would let you touch it |
| One file per *topic* instead of per question | Two questions close at different times; the file can only have one status | One question, one file |
| Writing `status:` into the frontmatter | A second source of truth that goes stale on the next `git mv` | The path is the status; OKF readers get it from the concept ID |

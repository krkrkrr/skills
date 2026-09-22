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
  README.md                     the index — every question listed once
  open/<subject>/NNNN-slug.md       not known
  deferred/<subject>/NNNN-slug.md   deliberately not touched
  answered/<subject>/NNNN-slug.md   settled
  abandoned/<subject>/NNNN-slug.md  given up on
```

`<subject>` groups questions by what they are about (`meters/`, `routing/`,
`protocol/`). It is a filing aid, not an identifier — a question keeps its number
when its subject or status changes.

## The status is the directory

**Write the status in exactly one place: the path.** When it changes, `git mv`
the file. The move lands in history, which is more than a table row ever gave you.

There is one exception, and it exists only so a reader who opens the file directly
is not lost: a single line near the top naming the current directory. Keep it in
step with the path — if you move the file, fix the line in the same commit.

```markdown
# Q-<N>: <the question, phrased as a question>

**Status: `open`** — the directory this file sits in is the status.
**`git mv` it when that changes.** Do not write the status anywhere else.

## The question
## What it would take
## What is known          <- including every candidate already ruled out
```

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
wherever the project keeps evidence, a judgement call to an ADR or equivalent.
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

`doc/questions/README.md` lists every question once, with its status and subject.
Regenerate it whenever a file is added or moved — a stale index is the same defect
as a stale answer.

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

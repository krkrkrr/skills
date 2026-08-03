# Minimal Template (CLI / small tool)

For single-purpose tools and small repositories. Optimized so a reader knows *what it is* and *how to run it* within 30 seconds. Total length target: under one screen (~60 lines).

## Skeleton

````markdown
# project-name

One-line description of what this does.

## Why

What problem this solves and when you would reach for it (2-3 sentences).

## Install

```bash
npm install -g project-name
```

## Quick Start

```bash
project-name --input file.txt
```

```
<expected output>
```

## License

MIT
````

## Section guide

### Title + one-line description

- The one-liner states what the tool *does*, not what it *is built with*. "Converts Markdown tables to CSV" beats "A Node.js utility for table processing".
- If the repo name is cryptic, the one-liner must compensate.

### Why

- 2-3 sentences: the concrete problem, and when a reader would reach for this tool instead of an obvious alternative.
- Skip this section entirely if the one-line description already makes it obvious. Do not write filler.

### Install

- One installation method, the recommended one. Alternatives go in a single trailing line, not parallel subsections.
- State runtime prerequisites inline only if unusual (e.g. "Requires Node.js >= 22").

### Quick Start

- One real invocation that a reader can copy-paste, followed by its actual output (run it, paste the result).
- Cover the single most common use case only. Do not enumerate all flags — point to `--help` for that.
- 2-3 examples maximum, only if the tool has genuinely distinct modes.

### License

- One word (the SPDX identifier). Only include when the project is published.

## What NOT to include

- Features list — at this size, Quick Start *is* the features list
- Architecture, directory structure, contribution guide
- Badges

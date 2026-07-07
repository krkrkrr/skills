# OSS Library Template (published library)

For libraries distributed via a package registry (npm, PyPI, crates.io, …) with a public API. The reader is a developer deciding in ~2 minutes whether to adopt the library; the README must answer "does it do what I need?" and "how hard is it to start?".

## Skeleton

````markdown
# project-name

[![CI](https://github.com/user/project-name/actions/workflows/ci.yml/badge.svg)](https://github.com/user/project-name/actions) [![npm](https://img.shields.io/npm/v/project-name)](https://www.npmjs.com/package/project-name)

One-line description of what this library does.

[日本語版 (Japanese)](README-ja.md)

## Features

- Feature 1 — one line each, benefit-oriented
- Feature 2
- Feature 3

## Install

```bash
npm install project-name
```

## Quick Start

```js
import { thing } from 'project-name'

const result = thing({ input: 'example' })
console.log(result) // => 'expected output'
```

## API

### `thing(options)`

What it does, in one sentence. Returns X.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `input` | `string` | — | Required. The input to process. |
| `strict` | `boolean` | `false` | Fail on malformed input instead of skipping. |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
````

## Section guide

### Badges

- One row maximum, placed between the title and the one-line description. CI status and registry version are the useful ones; add coverage or license badges only if they answer a real adoption question.
- Every badge must link somewhere meaningful (the workflow run, the registry page).

### Features

- 3-6 bullets, each one line, each stating a *benefit* ("Zero dependencies", "Streaming — constant memory on large files"), not an implementation detail.
- If you cannot write 3 distinct bullets, the project belongs on the minimal template.

### Install

- The registry command for the primary ecosystem. Peer dependencies and minimum runtime versions go here, not in a footnote.

### Quick Start

- The smallest *complete* program: imports included, runnable as pasted, with the expected output in a comment.
- One scenario only. Additional scenarios belong under API or in `docs/` / `examples/`.

### API

- Document the exported surface a user is expected to call. Internal or unstable exports are omitted, not marked "private".
- One `###` heading per export; options as a table (Option / Type / Default / Description). Mark required options in the Description column.
- If the API is large (> ~10 exports), document the 3-5 core entry points here and link to generated or dedicated API docs for the rest. Do not paste generated docs into the README.

### Contributing

- A single link to CONTRIBUTING.md. If that file does not exist, state the minimal expectation in 1-2 lines (e.g. "PRs welcome — run `npm test` first") instead of creating an empty ceremony section.

### License

- SPDX identifier, last section.

## What NOT to include

- Full changelog or version history — that is CHANGELOG.md
- Benchmarks without a reproducible script in the repo
- Comparison tables that trash-talk alternatives; a factual "differences from X" paragraph is fine if adopters routinely ask

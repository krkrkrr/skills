# Application / Service Template

For deployed applications and services, including internal tools: anything with environments, operational concerns, and a team. The primary reader is a developer joining the project or returning after months away; the README must get them from clone to running dev environment without asking a teammate.

## Skeleton

````markdown
# project-name

One-line description of what this service does.

## Overview

What this service does, who uses it, and how it fits among neighboring
systems (2-5 sentences). Link to the design doc for anything deeper.

## Install

Requires Node.js >= 22 and Docker (for local Postgres).

```bash
cp .env.example .env   # then fill in the values marked REQUIRED
npm install
docker compose up -d
npm run db:migrate
```

## Quick Start

```bash
npm run dev
```

Open http://localhost:3000.

## Testing

```bash
npm test           # unit
npm run test:e2e   # end-to-end (requires docker compose up)
```

## Deployment

How releases happen: what triggers a deploy, to which environments,
and where to watch it (2-4 sentences + links to CI/CD and dashboards).
````

## Section guide

### Overview

- Answers "what is this and who depends on it" for someone who has never seen the system. Name the neighboring systems it talks to.
- If the service is reachable at stable URLs per environment, list them here (or link to where they're listed).
- Rationale and history belong in design docs/ADRs — link, don't inline.

### Install

- Exact runtime versions where they matter (`>= 22`, not "recent Node"), plus required access (VPN, cloud credentials) for internal services — this is the #1 silent blocker for new members.
- Then a complete, ordered command sequence from fresh clone to working environment. Every command verified end-to-end on a clean checkout.
- Secrets: never write values; state *where to get them* (e.g. "ask in #project-channel", "see the team vault").

### Quick Start

- The one command that starts the dev loop, and the URL/port it serves. Frequently used auxiliary commands (lint, format, codegen) get one line each — the full list lives in `package.json`/Makefile, don't duplicate it.

### Testing

- How to run each test tier, and any environmental requirements per tier (e.g. e2e needs docker compose). If CI runs something locally unreproducible, say so explicitly.

### Deployment

- What triggers a deploy (merge to main? tag? manual?), the environment chain, and links to the pipeline and dashboards. Runbooks for incidents belong elsewhere — link them.

## What NOT to include

- Environment-specific secrets or hostnames of production systems (link to the config source instead)
- API endpoint documentation — that belongs in an OpenAPI spec or dedicated docs
- Team processes (review rules, on-call rotation) — link to the team handbook
- Internal architecture / repository-structure diagrams — the reader needs to run and use the service, not learn its internal code layout. That belongs in the code itself or a design doc; link to it from Overview if truly needed
- Troubleshooting / FAQ entries — this content only grows as issues are found and never shrinks, eventually crowding out what a new reader needs. Keep it in a dedicated doc (e.g. `docs/troubleshooting.md`) or the team wiki, linked from here only if genuinely load-bearing

# Application / Service Template

For deployed applications and services, including internal tools: anything with environments, operational concerns, and a team. The primary reader is a developer joining the project or returning after months away; the README must get them from clone to running dev environment without asking a teammate.

## Skeleton

````markdown
# project-name

One-line description of what this service does.

## Overview

What this service does, who uses it, and how it fits among neighboring
systems (2-5 sentences). Link to the design doc for anything deeper.

## Architecture

Key components and the main data flow — a short bullet list or one
Mermaid diagram.

- `api/` — HTTP API (Hono)
- `worker/` — async jobs consumed from the queue
- `web/` — frontend (React)

## Prerequisites

- Node.js >= 22
- Docker (for local Postgres)

## Setup

```bash
cp .env.example .env   # then fill in the values marked REQUIRED
npm install
docker compose up -d
npm run db:migrate
```

## Development

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

## Troubleshooting

### <symptom as the heading>

Cause in one line. Fix as a command or short steps.
````

## Section guide

### Overview

- Answers "what is this and who depends on it" for someone who has never seen the system. Name the neighboring systems it talks to.
- Rationale and history belong in design docs/ADRs — link, don't inline.

### Architecture

- Just enough structure to navigate the repo: top-level components, what each does, and the main data flow between them.
- One Mermaid diagram is worth including *if* the flow is non-linear; otherwise bullets suffice. Do not paste a full directory tree — it drifts.

### Prerequisites

- Exact versions where they matter (`>= 22`, not "recent Node"). Include required access (VPN, cloud credentials) for internal services — this is the #1 silent blocker for new members.

### Setup

- A complete, ordered command sequence from fresh clone to working environment. Every command verified end-to-end on a clean checkout.
- Secrets: never write values; state *where to get them* (e.g. "ask in #project-channel", "see the team vault").

### Development

- The one command that starts the dev loop, and the URL/port it serves. Frequently used auxiliary commands (lint, format, codegen) get one line each — the full list lives in `package.json`/Makefile, don't duplicate it.

### Testing

- How to run each test tier, and any environmental requirements per tier (e.g. e2e needs docker compose). If CI runs something locally unreproducible, say so explicitly.

### Deployment

- What triggers a deploy (merge to main? tag? manual?), the environment chain, and links to the pipeline and dashboards. Runbooks for incidents belong elsewhere — link them.

### Troubleshooting

- One `###` per issue, the *symptom* as the heading (what the developer actually sees), so it is findable by search. Add entries when a second person hits the same issue; prune entries when the root cause is fixed.

## What NOT to include

- Environment-specific secrets or hostnames of production systems (link to the config source instead)
- API endpoint documentation — that belongs in an OpenAPI spec or dedicated docs
- Team processes (review rules, on-call rotation) — link to the team handbook

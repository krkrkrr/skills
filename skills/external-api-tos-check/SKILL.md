---
name: external-api-tos-check
description: Use before writing or modifying code that integrates, embeds, or calls any third-party API/SDK/service (video/stream embeds like YouTube or Twitch, payment providers, LLM APIs, maps, ads SDKs, auth providers, etc.). Trigger whenever a task adds a new external provider, changes embed/autoplay/player behavior, upgrades an SDK across a major version, or touches code under a provider-named directory (e.g. src/youtube/, src/twitch/) — even if the user does not say "terms of service" or "ToS". Confirms the provider's official Terms of Service / Developer Policy / Developer Agreement allows the planned behavior before implementation, and records material constraints as an ADR.
license: Unlicense
---

# External API / Service ToS Check

Implementations sometimes proceed without checking a third-party API's terms of service, only to have a violation risk surface later (e.g., an implementation that unknowingly conflicted with a rule banning simultaneous autoplay across multiple embedded players). This skill builds a terms check into every new or changed external integration, before implementation, to prevent that kind of recurrence.

## When to use

Run this skill before writing any implementation code whenever a task matches one of the following:

- Integrating a new external provider for the first time (video/stream embeds, payments, maps, ads SDKs, auth, LLM APIs, etc.)
- Changing how an existing provider is used (adding autoplay, changing how many instances are shown at once, hiding/altering UI elements, using a new API endpoint, etc.)
- Bumping a provider's official SDK/embed API across a major version
- The user explicitly asks for a terms check

Trigger on these situations even if the words "ToS" or "terms of service" never come up in conversation.

Out of scope:
- Internal APIs/services within your own domain
- Changes already covered by an existing ADR, where the current change doesn't exceed that ADR's scope (citing the relevant ADR and stopping there is fine)

## Steps

1. **Enumerate the providers involved**: List every external API/SDK/service this task newly uses or changes. Be specific — name the exact API (e.g., "YouTube IFrame Player API"), not just the vendor.

2. **Find the official terms documents**: Look for the provider's own primary-source documents, not search results or blog posts.
   - Pages formally titled Developer Policy / Terms of Service / Developer Agreement / Acceptable Use Policy
   - Constraint sections inside API references, such as "Required Minimum Functionality"
   - If you can't find or can't judge the terms, ask the user — don't proceed as if no terms exist.

3. **Cross-check against the implementation plan**: Compare the concrete behavior the code is about to implement (simultaneous autoplay, hiding UI elements, storing/redistributing data, rendering in a custom player, caching, scraping, etc.) against the relevant clauses. Pay particular attention to:
   - Concurrency limits, rate limits, quota caps
   - Whether hiding/altering embedded UI elements (logo, ads, controls) is allowed
   - Whether a custom implementation outside the official client/player is allowed
   - High-level clauses like bans on "replicating the experience without substantial added value"
   - Whether storing, caching, redistributing, or training on the data is allowed
   - Domain declaration/allowlist requirements for embedding

4. **Judge the conflict risk**:
   - **No conflict** — proceed with implementation. Leave a brief note of what was checked and why it's fine (a commit message, PR description, or a nearby code comment is enough; no ADR needed).
   - **Possible conflict / ambiguous clause** — surface it to the user before implementing and get a decision. Don't guess "probably fine" and move on.
   - **Clear conflict** — stop implementation and work out a compliant alternative design with the user.

5. **Record constraints that affect the architecture as an ADR**: If a constraint forces a change to the domain model or UI design (e.g., adding the invariant "only one provider slot can be active at a time"), cite the relevant clause, write the decision and consequences, and record it as a project ADR. If the project has a dedicated ADR-writing skill (or the `ddd-bdd-tdd-flow` skill's ADR phase), follow that; otherwise use the Nygard format at `doc/ADR/NNNN-<title>.md`. A plain confirmation with no design change doesn't need an ADR.

## Not in scope

- Final legal interpretation of terms text (for ambiguous cases needing a lawyer's judgment, surface the risk to the user and defer to them; this skill's job ends at discovering and surfacing the risk)
- OSS license checks (MIT/Apache-style code-reuse conditions) — a separate axis, out of scope here. This skill covers the terms of use for a provider's "runtime API service," not license terms for reusing their code.

## Related

- ADR-writing (if the project has a dedicated ADR-writing skill) — defer to it for the format and workflow of the ADR recorded in Step 5.
- `ddd-bdd-tdd-flow` — defines ADR creation/workflow (Nygard format, `doc/ADR/NNNN-<title>.md`) as part of its new app/feature flow. Projects without a dedicated ADR-writing skill should follow this convention.

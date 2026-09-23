# adr-writing-ja

Write Japanese Architecture Decision Records (ADRs) — decide whether a decision needs one, place and name the file, pick one of eleven templates, check the argument from Context through Decision to Consequences with `argument-gap-edit`, and add [OKF](https://okf.md/spec/) frontmatter so other agents and tools can read the decision record.

Part of the [skills](https://github.com/krkrkrr/skills) library — see the repository's [README](../../README.md) for installation.

Pairs with [argument-gap-edit](../argument-gap-edit/) (and, through it, [japanese-tech-writing](../japanese-tech-writing/)) for the prose check. Defaults to `doc/ADR/NNNN-<slug>.md`, the same location [ddd-bdd-tdd-flow](../ddd-bdd-tdd-flow/) and [external-api-tos-check](../external-api-tos-check/) assume.

## Source

Japanese adaptation of `architecture-decision-record-skill` from [architecture-decision-record/architecture-decision-record](https://github.com/architecture-decision-record/architecture-decision-record#claude-code-skills-for-adrs) by Joel Parker Henderson. Template terminology follows that repository's `locales/ja/` translation.

Changes from the original: translated into Japanese; added an argument-check step that applies `argument-gap-edit` to ADR sections; fixed status values as English keywords; defaulted the directory to `doc/ADR/`; added a rule against filling unknown context with plausible guesses; added OKF frontmatter (used when the repository has no ADR convention yet), whose `status` is derived from the ADR status and which records human approval in `verified`.

## License

[CC BY-NC-SA 4.0](./LICENSE), inherited from the upstream repository. Individual templates remain under their original authors' terms.

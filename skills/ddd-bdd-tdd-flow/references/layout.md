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

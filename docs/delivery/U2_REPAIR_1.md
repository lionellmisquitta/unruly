# U2 source repair 1 and final CI candidate

CI2 run `37473235195` on `01dee6962e7a2e9211c61142bf9c6d8ee020694f` narrowed the remaining failures to one application root cause plus two QA harness issues.

Application defect:
- U2 replacement accidentally removed the shared size/opacity event handlers.
- Visual inputs changed, but `settings.size` / `settings.opacity` did not change.
- This caused per-preset memory to restore defaults and caused the inherited eraser size-20 test to execute with the prior preset size (observed partial endpoint 247.999967 instead of 239.5).
- Repair restores the U1 validation/synchronization contract and additionally persists current U2 preset settings after a valid change.

QA-only corrections:
- UM11 now imports the real ESM renderer so its new `./brushes.js` dependency resolves; unsupported-blend behavioral assertions remain unchanged.
- In inherited W02, the Brush Library category button is located within `#brush-categories` to avoid the deliberate legacy compatibility alias for toolbar “Pen”. Assertions are unchanged.

Budget after this candidate:
- U2 application source repair: 1/2 consumed.
- U2 CI runs: CI3 will be 3/3 and therefore final. Any material failure after CI3 returns U2 UNSTABLE for replanning rather than weakening tests.

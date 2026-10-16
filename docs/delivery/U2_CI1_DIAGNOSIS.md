# U2 CI1 QA diagnosis

Run: `37472176269` on `c4b766f706cf326acace7085629a5c0ebdaf4046`.

Observed:
- U2 model: 6/6 PASS.
- U1 browser: 16/16 PASS.
- U2 mobile/offline: PASS.
- CI failed due QA harness drift plus one inherited eraser assertion requiring exact-value diagnosis.

QA-only corrections in this commit:
1. Restored `readFile` import used by the inherited U1 unsupported-blend oracle after converting model loading to native ESM for U2's shared brush module.
2. Updated inherited W01/W02 browser journeys to exercise the intentionally superseding U2 Brush Library and Hex control rather than the removed brush `select`. Assertions remain behavioral: four families, size/opacity/color, persistence, zero-opacity non-commit, five-canvas limit.
3. Fixed U2 browser storage helper: `meta.lastBoard` stores the raw board ID string, not `{value:...}`.
4. Added exact-value messages to the unchanged W10 eraser tolerances; no threshold or requirement was weakened.

No application source changed. U2 source repair budget remains 0/2 consumed. CI run budget is 1/3 consumed.

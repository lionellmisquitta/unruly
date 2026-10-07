# PEN1 closed — cumulative browser preview

Accepted source `93af0a256b57932288f57239612bd4cc5516b7fc` is hosted at https://lionellmisquitta.github.io/unruly/. Checkpoint branch `checkpoint/pen1-v0.7.0` preserves that exact tested source; accepted U3 source41019aa0b7991bbe5bd56b71b9516da9bb454cd0 remains the rollback.

CI2 run37633247724 passed57model +108browser checks (18PEN and90inherited), with36/36source identities independently verified. Original12brushes passed48exactRGBA comparisons. One application repair batch and two CI runs were used. Independent QA and Gatekeeper accepted this exact source.

Pages deployment37634720112, deployment workflow commit `87551668949770beaf2b346a3227dab83f00f4d5`, pinned and asserted the accepted source. Deployment and post-deploy curl/cmp verification succeeded; all16hosted application hashes matched local/CI source. Receipts: evidence/pen1/hosted-sha256.txt.

Remote Chrome observed safe Reload to update, retained pre-update ink, visible20brush controls and enabled pressure dynamics, default barrel Lasso / eraser Eraser mappings, scoped canvas right-click suppression and new ink saved/reloaded beside old ink. Reload verification waited for Saved on this device; premature refresh before autosave is not counted as a passing save test. Screenshot: unruly-pen-controls-1791382478656.jpg.

Physical Surface/Lenovo/Xiaomi pressure and pen buttons remain NOT_VERIFIED. CI variable pressure rendered6px low vs36px high; mouse40px. Trusted CDP eraser-mask32 transport remains NOT_VERIFIED; synthetic browser handler contract passed. No main merge or full production release is authorized. Export new-brush/dynamics boards before rollback to older software.

Next: human device review using PEN1_REVIEW_CARD.md; further work requires one bounded increment.

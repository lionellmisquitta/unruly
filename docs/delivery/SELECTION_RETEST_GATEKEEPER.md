# C06-S1 retest and preview workflow preinspection

Independent Gatekeeper disposition: **RETEST REQUIRED; PREVIEW ACTIVATION BLOCKED pending actual CI2 and independent QA acceptance.** This is a scoped continuation, not a production gate decision.

Initial CI 37363203471 tested candidate 78a04d6b221b4a0fce9637aa70e201ba430f8ea5: 24 model cases and 15 inherited browser cases passed; five of six selection journeys passed. U02 stopped at its paste-coordinate assertion; its later assertions were not verified. Preserve that failed run and its trace.

The independent diagnosis in SELECTION_QA_FIXTURE_DIAGNOSIS.md supports a fixture defect: Chromium delivered the integer wheel anchor at screen Y=490, while the expected-coordinate calculation assumed Y=490.5. The actual saved paste coordinates match inverse-view coordinates using the delivered anchor. The bounded correction specifies an integer wheel anchor and retains the 0.01 coordinate tolerance and all downstream assertions. It neither changes application source nor consumes a second application repair batch. Actual retest remains necessary.

CI2 37364993048, job 111947905428, candidate e30e861745c48c5029c7f9f0d23a974ae8190c54 is queued according to the supplied receipt. A queue is not an application defect or a test pass. Budget remains one of two source repair batches used and two of three CI attempts used. Do not cancel or repeat the queued run merely for queue delay.

I read the actual proposed .github/workflows/browser-workspace-pages.yml. Its mechanics are acceptable for a reviewed quarantined preview: only the already authorized preview/browser-foundation-2026-10-04 branch and workflow path trigger it; checkout and explicit HEAD assertion lock e30e861745c48c5029c7f9f0d23a974ae8190c54; credential persistence is disabled; official actions are pinned; timeout is ten minutes; Pages enablement is false; artifact upload contains only prototypes/browser-workspace. Pages write and OIDC permissions are scoped to the deployment job. It does not publish from QA automatically or update main.

This preinspection does **not** authorize pushing the deployment-triggering workflow. Before activation, supply actual CI2 results, independent QA final disposition, source/artifact identity evidence and a final Gatekeeper review of the passing immutable candidate. Any subsequent metadata publication must use an ancestor-verified, non-force fast-forward of the authorized preview branch. Keep the existing live preview unchanged until that review.

C06 as a whole, hardware feel, hosted and merged regression remain unverified. Formal release checkpoints closed remain 0/14; G14, production authorization, main merge and release remain false. Earlier Windows and workspace evidence and their consumed budgets remain historical and unchanged.

# P01 preliminary Code and Security Review

Candidate identified by Builder: a3cda6ca13ce711b77a2eed24233aa3ae6958406. Actual CI 37396036080 is in progress; this static review does not claim results or authorize publication. Readiness preceded implementation in plan commit be7a7c71cee9840c0c70e3775cab3b88ec3e1dfa.

## Material finding — P01-A4 transient backing allocation

**BLOCKER:** render.js geometry resizes each existing surface by assigning width, then height. It bounds final dimensions but can exceed the locked total nominal RGBA backing cap during the assignments. With five 1024×4096 surfaces (80 MiB total), resize to 4096×1024: assigning the first width produces a 4096×4096 surface (64 MiB) while the other four still total 64 MiB. Nominal transient allocation reaches 128 MiB despite final metrics reporting 80 MiB. This is a specific rotation/aspect-change case, not an assertion about internal GPU memory.

Release all old backing stores to tiny dimensions before reallocating the common capped dimensions, or use an equivalently bounded two-phase shrinking algorithm. QA must independently track intermediate width/height assignment states, including tall-to-wide and wide-to-tall capped rotations; final backingBytes alone cannot prove this contract. Aggregate this application correction with actual CI findings into the bounded repair batch. Do not weaken the cap or mask the failure as a fixture defect.

## Architecture and compatibility observations

The retained design is proportionate: five shared surfaces, no per-layer canvases, topmost-visible-only eligibility, automatic reference fallback, explicit full reference function and unchanged brush drawing/paper primitives. The active-layer preview is combined before layer opacity, preserving the stated overlap/order design. Cache board identity and revision/view/active-layer/dimensions/DPR keys are explicit; full render, cache error and sample invalidate. Exact numerical behavior still requires actual pixel evidence.

A7 app.js changes remain within scope: only surviving active.stroke moves schedule painting; other gestures and completion/cancellation refresh; pressure/coalesced collection and point-limit cancellation remain. Empty selections skip selectionBounds. Scheduling preserves the single requestAnimationFrame guard. Actual inherited/controller QA is required.

Read-only SHA verification confirms model.js 2ebe976486b0057744ce0babac4b074bdd9b34e7cb5f8f7fbf6d4c41c62a4cf0, storage.js 0c946d2d909ca057d7f71be356a2979c185e831012ba4eae956eb88d05bc49bf and selection.js 2b8aff9073f13ecbad5900202d0578388222a19c3d12150e66477f98bd222203 match the accepted baseline. The old reference fixture is byte-bound to previous renderer SHA 04eb9febae92089cd2aaf15174efebc96e4c7d7d6822a0638568ca22e8f1fa8d. No schema/history/provider migration is introduced. Version ledger distinguishes labels/branches from unsupported Git tags.

## Security and CI scope

No new network/provider/package, executable dynamic content, credentials or persistence trust boundary is added by renderer/controller changes. Backing memory and replay workload remain the relevant resource-denial boundary; the transient allocation finding must close. Existing service-worker update remains message-activated and same-origin GET caching; new cache version does not authorize unsaved automatic reload. Actual offline/update regression must pass.

Read actual QA-only workflow: personal performance branch is added to scoped path triggers, read-only token, pinned checkout/upload actions, locked npm tooling and ten-minute deadline retained. Existing unit and browser suites precede new performance suite, with server restart and bounded evidence upload. No Pages deployment or main merge is triggered by QA. Production/main/G14 remain false, full release count 0/14. Await actual CI and independent QA; performance/pixel thresholds must not be widened after failure.

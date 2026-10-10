# UX2 layer transforms and lasso performance

Current verified baseline: UX1 22d43ffe2011870feffbbdfd4ccbeb9b1e7902e0; cumulative QA 38073524003 and Pages 38074115756 succeeded. Native main cb1d52089c5cdd159050dc375b92750eb84d8271 stays untouched.

Trigger: lasso reaches the 200,000-comparison cap on modest layer counts. Nested polygon comparisons and full artwork replay on each lasso pointer event cause avoidable work. Use exact edge Y indexing, bounded 4,096-point memoization, bounding rejection, cached UI selection bounds and overlay-only refresh on unchanged board/view/dimensions/DPR. Preserve board, replay, history, canvas memory and comparison caps; no box-only or sampled geometric decisions.

Explicit ephemeral layer scope defaults to active drawing layer; Ctrl/Cmd-click and 44px checkbox extend it. Shared transforms retain layer and stroke identity, width, pressure, order and blend. Locked/hidden scoped layers reject whole operation. Copy flattens the page clipboard; Paste still targets active layer. Nothing changes document schema.

Two fingers pinch/twist/translate selection preview in Transform mode, with frozen finger pivot and at most one preview per animation frame. Apply creates one document history entry; local undo/redo remain separate. Cancellation, third touch, blur and partial-release cancellation roll back. Whole-canvas rotation stays deferred.

Declared changed regression: U3B11a now expects preview translation, while retaining viewport immobility, persistence guard and Cancel restoration. All other old regressions remain mandatory. New tests include exact-oracle concavity, 100k points/512-edge polygon, group ownership/pivot, locked atomicity, real Chromium touch cancellation/undo/redo and zero artwork replay during lasso. Physical tablet feel is not verified by Chromium.

No source merge into main. Deploy only this exact tested source to existing Pages pin after full CI and artifact verification. No new site or public private-conversation evidence.

QA run 38076397892 caught an instrumentation signature mismatch in P01-A7. Its route injection now matches scoped selectionBounds; all existing refresh, bounds, coalesced pressure, paint and cancellation assertions remain unchanged. All seven new Chromium journeys and 140 models passed in that run, but it was not deployable. Full cumulative CI must rerun on the updated exact commit.

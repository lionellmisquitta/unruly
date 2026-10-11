# PERF2 impact and technical contract

Base 489a1a6b6f9cc58e534604fec72d608c78451789; tested app identity from PERF1 53f8628ba157954d0e5408516125198f4e1b7442, CI 38095617764 successful. Branch refs/native main/current preview verified before mutation. Scope intentionally avoids graph reread/update.

Confirmed direct callers: app paint, layer thumbnails, sample brush preview, picker magnifier and smudge snapshot. Existing render.js export names remain stable. Backend uses pressure/brush/raster helpers unchanged. Tests import createRenderer, graphiteGrain and rendererBudget; all exports retained. Offline worker must precache the two new modules, with a fresh cache identity. No model, storage, selection, app/controller, gesture, native or saved-format changes.

The extracted backend is byte-identical to accepted renderer SHA256 2d18d52d86589bac65e3ab9ab6fb1d0a296165b683c3d3aca256a66cd1d9e506 after normalizing the factory name. This is deliberate: boundary work does not fix complete replay or viewport-sized per-stroke copies.

Interface: createRenderer(canvas, {backend: 'auto'|'canvas2d'}) preserves render, renderReference, preview, thumbnail, magnify, snapshotLayer, invalidate and the five live surface handles. Unsupported backends fail explicitly. Actual backend selection is Canvas2D only. Default view/live arguments stay unchanged. No network/telemetry, backend probing, GPU claim or schema fields added.

getDiagnostics returns immutable bounded snapshots: backend/version, successful frame count, explicit invalidation epoch/reason, and last frame descriptor. Auxiliary operations and explicit invalidation clear lastFrame and the backend cache; failures invalidate and rethrow. Epoch counts these explicit calls, not implicit backend key misses. Backend keys continue to enforce board identity/revision, view, dimensions and DPR; callers must not mutate cached live-ink boards in place. Frame descriptors read layer state only; full backing-pixel region honestly describes current work, not a dirty/tiled implementation.

Risks: changed module graph could break offline updates; extra frame metadata could become point-count work; helper buffers could leave stale cache; diagnostics could alias mutable document state. Compensating checks: offline reload, no-geometry unit getter trap, helpers/failure recovery exact pixels, nested immutable snapshots and full regression. Mutable diagnostic surface handles are not exported; existing surfaces API remains for compatibility. No independent human approval or protected CI configuration claimed; verification is same-session plus observed GitHub execution.

Rollback: pin previous verified app source; no document rollback/migration needed. Deployment is the existing preview workflow pinned only after source CI/artifact verification, followed by exact hosted asset comparisons. A release pin on the preview branch is separate from source implementation scope. Physical Surface/Xiaomi latency and total RAM remain unknown.

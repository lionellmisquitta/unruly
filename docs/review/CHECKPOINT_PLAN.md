# Checkpoint and review plan

Status: proposed. Each slice needs its own contract, tests/data, permitted changes and rollback before build authorization. Checkpoint counts may be adjusted only with recorded dependencies; do not silently remove first-release scope.

## Feasibility before implementation
P0: quarantined pen/rendering experiment on Windows and Android. Verify architecture/toolchain viability, pressure samples, navigation, palm handling and measured frame/latency evidence. User hardware validation remains required. No runtime is locked yet.

## Batch 1 — foundation: three implementation checkpoints
C01: platform build/package, portable Windows folder, Android APK, local controller/tool-authentication preflight and offline launch.
C02: board lifecycle/storage/recovery and initial vector/raster drawing, pressure, size/opacity and stabilization.
C03: pan/zoom/rotation, input arbitration, undo/redo, save/reopen and basic layer separation.
User scenario: draw a page of handwriting and a sketch, change pressure/smoothing, navigate, undo, save, quit and reopen on both devices. Judge latency, pressure, palm rejection and navigation. Automated QA: engine/input contracts, document corruption/recovery, storage failure and UI journeys.

## Batch 2 — painting/editing: four checkpoints
C04: brush engine, textured tips/grain, original inking presets, smudge and brush controls.
C05: layers/groups, clipping/masks/blends, colours/palettes and paper/grid/artboards.
C06: lasso/transforms, vector nodes/intersection erasing and held-stroke shape recognition.
C07: bounded gap-aware fill, blur and experimental Procreate brush import.
User scenario: ink and colour a drawing, smudge, use clipped layers, edit vector curves and clean intersections, fill imperfect outlines and try imported brushes. Automated QA: reference render images, intersection topology, mask math, tile boundaries, malformed brush archives, fill/blur limits and UI regressions.

## Batch 3 — whiteboarding, presentation and exchange: four checkpoints
C08: text/font/size, sticky notes and attached connectors.
C09: images/PDF pages and reference companion with colour sampling.
C09M: Motion Trace: object/group path movement, camera pan/zoom, manual/timed cues, non-destructive default playback and explicit undoable commit. Depends on C06 selection/transforms; native input and platform rendering remain prerequisites.
C10: bounded image/PDF exports, proposed PSD import/export and timelapse.
User scenario: assemble an annotated diagram, add a PDF/image, reference colours, export a selected frame, replay a timelapse and test artwork exchange in the real external apps. Automated QA: malformed/large inputs, text fallback, connector edits, replay determinism and output compatibility fixtures. External-app round trips need actual app evidence.

## Batch 4 — sync and AI: three checkpoints
C11: Drive authorization, synchronization, offline queue, retry, conflict preservation and disconnect behaviour.
C12: BYOK provider boundary, selected-content transmission and AI output review/edit/insert.
C13: DOCX/PDF summary/diagram export, end-to-end regression, packaging and release readiness.
User scenario: edit offline, sync, induce a two-device conflict, keep both versions, then generate and review a summary/diagram. Automated QA: simulated OAuth/API outages and partial writes, credential boundaries, malformed AI responses, output validation and core frontend/backend regression. Live integrations require credential setup and narrowly scoped evidence.

## Autonomous loop at every checkpoint
Validate contract + baseline -> isolated builder -> independent QA -> bounded repair/retest -> independent Gatekeeper review -> accepted local integration merge -> merged-build tests -> documentation/graph/evidence closure -> designated remote push -> next ready checkpoint.

QA generates frontend and engine/backend tests from acceptance criteria, not from the builder narrative. Tests/data/simulators are versioned. Max three repair/retest cycles; unstable checkpoint stops dependent work. Structured output and exact commit/build identity are mandatory. Failed post-merge regression prevents promotion and downstream continuation. Public releases require a separately recorded release decision.

Human review is at batch boundaries, not every checkpoint. The controller saves a runnable build, concise test card and evidence summary. Missing human judgment is visible; it is never silently marked passed. Budgets, timeouts, cancellation and resume rules must be locked before unattended execution.

## Motion Trace checkpoint acceptance and adversarial coverage
Proposed acceptance: lasso/select group -> define path -> preview -> replay -> verify original board unchanged. Camera cue guides view without moving saved content. Manual Next and automatic playback honor the chosen mode. Explicit commit updates object geometry and is one undoable action.
Tests: vector/raster/text groups, clipped layers, locked targets, deleted target recovery, pause/cancel, repeated replay drift, overlap/order, zoom-independent paths, background/resume, save/reopen of cues, rejection of malformed cue files and concurrent autosave/sync. Commit/cancel operations require exact before/after document-state assertions. User batch review checks whether the audience can follow the explanation and whether movement feels clear.

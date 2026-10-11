# C04 graphite slice and G02 decision delta — 2026-10-09

Baseline: GitHub Pages verified cumulative G02 source `7ebfa329570a14e2dca09f2e16586f0a60014126`.
Current status: C04 GR01 under test; not released. The actual source commit and CI result govern acceptance.

## Approved G02 scope decision
Whole-canvas view rotation deferred to final drawing-polish phase. Preserve rotation of selected objects; do not replace or remove it. G02 beta-scope is treated as feature-complete from prior verified published gestures, but tablet hardware acceptance and expanded-shape refinements are open. This is a decision delta for the canonical UNRULY KGP; do not claim the KGP itself has already been regenerated.

## C04 GR01 bounded behavior
Only `pencil-4h` and `pencil-charcoal` receive deterministic extra graphite paper-tooth modulation during renderer replay. Original HB/2B/6B, markers, ink, airbrush paths must retain pixel behavior. Existing stroke schema, presets and pressure profiles remain unchanged. No random-number calls, new dependencies, persistent data changes, new UI controls, native main edits, or runtime network access.

## QA gates
Test determinism, bounds, malformed coordinates, original stroke/preset safety, full Chromium drawing/selection/undo/storage/offline regression, C04 visual quality on physical tablet. No automatic publication before model+browser CI green and reviewed hosted-byte verification. Visual feel on Surface/Xiaomi is NOT_VERIFIED.

## Pending C04 scope
Brush grain/texture adjustment UI, advanced smudge, new tips and spacing options remain future isolated slices, not part of GR01.

## Rollback
Restore exact published source `7ebfa329570a14e2dca09f2e16586f0a60014126` by repinning designated GitHub Pages workflow; do not touch native `main`.

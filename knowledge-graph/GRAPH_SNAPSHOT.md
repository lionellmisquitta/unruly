# UNRULY — decisions and capability index

Revision: unruly-kgp-20261008T102809Z
Knowledge updated: 2026-10-08T10:28:09Z / 2026-10-08T15:58:09+05:30

## Browser-first architecture

The browser application is the primary implementation direction. Native Windows/Android enhancements or wrappers may follow later; native-only is historical.

Status: current · ID: urn:unruly:architecture:browser-first

## Offline local-first operation

Core drawing and board editing work without a hosted SaaS backend; local storage is authoritative while offline.

Status: current · ID: urn:unruly:architecture:local-first

## No required hosted SaaS backend

Backend test scope refers to document engine, storage, history and adapters rather than inventing a server/database.

Status: current · ID: urn:unruly:architecture:no-saas-backend

## Open-source release

UNRULY is intended to be open source. License choice remains unresolved.

Status: current · ID: urn:unruly:architecture:open-source

## Infinite canvas

Infinite pan/zoom workspace with multiple saved boards and finite export/artboard frames when needed.

Status: current · ID: urn:unruly:cap:canvas

## Drawing engine

Current preview draws vector strokes with pressure snapshots. Hybrid raster painting is future scope, not verified implemented behavior.

Status: current · ID: urn:unruly:cap:drawing

## Brush system

Verified U2 brush system with 12 original deterministic presets across Pencil, Pen, Marker and Airbrush; per-preset size/opacity memory; legacy no-preset strokes retain the historical renderer path. Future watercolour/texture/import directions remain separate.

Status: current · ID: urn:unruly:cap:brushes

## Layer system

Verified layers: add above active, top-first order, visibility/locks, opacity and blending. Masks are planned. Clear active layer passed CI1 but repaired hosted update is pending.

Status: current · ID: urn:unruly:cap:layers

## Selection and transform

Prominent lasso selection with move, copy, cut, paste, delete and explicit transform workflows.

Status: current · ID: urn:unruly:cap:selection

## Gesture system

Procreate-inspired browser-safe gestures for undo/redo, pan/zoom, eyedropper and held-shape workflows.

Status: current · ID: urn:unruly:cap:gestures

## Color system

Verified U2 colour system with outer hue ring, inner saturation/value disc, Hex/H/S/V controls, 12 generated shades, recent colours, saved palette and toolbar current-colour indicator.

Status: current · ID: urn:unruly:cap:color

## Effects and fill

Gaussian blur, HSL-style adjustments and gap-aware raster fill planned with preview/apply/cancel boundaries.

Status: planned · ID: urn:unruly:cap:effects

## Whiteboarding objects

Editable text boxes, sticky notes, connectors and reference images in addition to drawing.

Status: planned · ID: urn:unruly:cap:whiteboard

## Timelapse

Local deterministic process replay and video export; retention/framing details remain unresolved.

Status: planned · ID: urn:unruly:cap:timelapse

## Motion Trace

Move selected content along paths and audience-view pan/zoom with manual-first playback and optional commit-to-board.

Status: planned · ID: urn:unruly:cap:motiontrace

## Import/export and exchange

Image/PDF-page import, PNG/JPG/PDF export and investigated layered PSD exchange for Procreate/Clip Studio interoperability.

Status: planned · ID: urn:unruly:cap:exchange

## BYOK AI assistance

Optional user-controlled AI to summarize/diagram selected ideas and export documents/images after base validation.

Status: planned · ID: urn:unruly:cap:ai

## Governed delivery and QA

Checkpoint-based delivery with independent QA, Gatekeeper review, regression and resumable evidence.

Status: current · ID: urn:unruly:cap:qa

## Performance foundation

Cached rendering, bounded canvas memory and regression benchmarks to preserve drawing responsiveness.

Status: current · ID: urn:unruly:cap:performance

## Procreate-inspired UX baseline

Selected Procreate Fundamentals layout and current handbook behavior are the UX reference family, without copying proprietary assets/algorithms.

Status: current · ID: urn:unruly:ux:procreate-baseline

## Hue disc color picker

Implemented and QA-verified hue ring plus inner saturation/value disc, generated shade row, recent colours, saved palette and precise Hex/H/S/V controls.

Status: current · ID: urn:unruly:ux:color-picker

## Pen-first interaction

Pen draws by default; fingers navigate or invoke gestures. Finger paint is reserved for a future functional Smudge tool.

Status: current · ID: urn:unruly:ux:pen-first

## P0a native pen feasibility

Historical quarantined native/Qt feasibility and input evidence.

Status: historical · ID: urn:unruly:checkpoint:p0a

## WB1 browser workspace

Browser-first offline workspace foundation including local board create/save/reopen and hosted preview verification.

Status: implemented · ID: urn:unruly:checkpoint:wb1

## P01 v0.3.0 performance checkpoint

Cached top-layer renderer, bounded memory and verified model/browser performance evidence.

Status: accepted · ID: urn:unruly:checkpoint:p01

## Vector selection checkpoint

Lasso/move/copy/cut/paste/delete implementation milestone with model/browser QA evidence.

Status: accepted · ID: urn:unruly:checkpoint:selection

## U1 compact reference UI and layers

Accepted U1 compact Procreate-reference controls and layer UX. Exact tested source 699d6fb29b2debe1ad3721a2c7a3ee86bd374792; 35/35 model and 53/53 browser groups passed before reviewed preview publication.

Status: accepted · ID: urn:unruly:checkpoint:u1

## U2 brush library and color

Accepted U2 Brush Library and Colour checkpoint: 12 original immutable presets, per-preset size/opacity memory/reset, optional v3 preset identity with legacy rendering compatibility, hue-ring/SV colour disc, shades, recents and saved palette.

Status: accepted · ID: urn:unruly:checkpoint:u2

## U3 core gestures and geometry

Accepted cumulative browser preview; physical pen capability and full production are outside this verification.

Status: verified_preview · ID: urn:unruly:checkpoint:u3

## G02 remaining reference gestures

Planned held history, view rotation/fit, clipboard/chrome/scrub and expanded shape coverage.

Status: planned · ID: urn:unruly:checkpoint:g02

## Physical pen feel verification

Synthetic/browser QA does not prove Surface/Xiaomi handwriting feel, palm rejection or device-specific pen behavior.

Status: open · ID: urn:unruly:question:physical-pen

## Android packaging/runtime

Browser-first is current; Android packaging/enhancement approach still needs future evidence.

Status: open · ID: urn:unruly:question:android

## Open-source license

Open-source intent is confirmed but exact license remains unresolved.

Status: open · ID: urn:unruly:question:license

## Procreate brush import fidelity

No lossless proprietary format promise; schema/asset-rights investigation required.

Status: open · ID: urn:unruly:question:brush-import

## Layered exchange fidelity

PSD is the recommended investigation route; round-trip fidelity for vectors/text/masks/blends remains unproven.

Status: open · ID: urn:unruly:question:psd

## Drive OAuth/release setup

Scopes, credentials and production release setup remain unresolved.

Status: open · ID: urn:unruly:question:drive-oauth

## BYOK AI provider support

Provider/capability/CORS/key-handling details remain unresolved.

Status: open · ID: urn:unruly:question:ai-provider

## Timelapse framing/retention

Storage growth, framing and retention policy remain unresolved.

Status: open · ID: urn:unruly:question:timelapse-retention

## U1 + U2 human review batch

Two-checkpoint review boundary used to update the durable knowledge graph after U1 and U2 acceptance.

Status: accepted · ID: urn:unruly:batch:u1-u2

## GDEC-001 · Windows distribution is a portable folder containing an executable and bundled dependencies; no

Windows distribution is a portable folder containing an executable and bundled dependencies; no installer. This supersedes the tentative single-HTML-file direction.

Status: superseded · ID: GDEC-001

## GDEC-002 · Android APK distribution is acceptable

Android APK was accepted as a distribution option; browser-first now leads. Future Android wrapper/runtime remains unresolved.

Status: approved_future_option · ID: GDEC-002

## GDEC-003 · Painting and whiteboarding are equally important in release one

Painting and whiteboarding are equally important in release one.

Status: approved_intent · ID: GDEC-003

## GDEC-004 · Personal use across devices; collaborative editing is outside release one

Personal use across devices; collaborative editing is outside release one.

Status: approved_intent · ID: GDEC-004

## GDEC-005 · Open-source release; license remains undecided

Open-source release; license remains undecided.

Status: approved_intent · ID: GDEC-005

## GDEC-006 · Smooth, responsive pen interaction is a primary release criterion

Smooth, responsive pen interaction is a primary release criterion.

Status: approved_intent · ID: GDEC-006

## GDEC-007 · Prepare requirements, architecture, UX, tests and automation before production coding

Prepare requirements, architecture, UX, tests and automation before production coding.

Status: approved_intent · ID: GDEC-007

## GDEC-008 · Independent cross-model QA is desired: Codex builder with Claude Code QA, or the reverse

Independent cross-model QA is desired: Codex builder with Claude Code QA, or the reverse. Gatekeeper reviews before merge; merged build receives regression tests.

Status: approved_intent · ID: GDEC-008

## REQ-001 · Infinite canvas, zoom, pan, multiple saved boards, cut/copy/paste, lasso, ruler, eraser

Infinite canvas, zoom, pan, multiple saved boards, cut/copy/paste, lasso, ruler, eraser.

Status: approved_intent · ID: REQ-001

## REQ-002 · Vector and raster drawing on one board; editable curve control points and dedicated curve pen t

Vector and raster drawing on one board; editable curve control points and dedicated curve pen tool.

Status: approved_intent · ID: REQ-002

## REQ-003 · Pen, pencil, marker, airbrush, watercolour, imported texture brushes

Pen, pencil, marker, airbrush, watercolour, imported texture brushes.

Status: approved_intent · ID: REQ-003

## REQ-004 · Layers, clipping masks, transparency/opacity and blending modes; brush size and opacity control

Layers, clipping masks, transparency/opacity and blending modes; brush size and opacity controls, layer transforms.

Status: approved_intent · ID: REQ-004

## REQ-005 · Pressure-sensitive drawing and adjustable stabilization for handwriting

Pressure-sensitive drawing and adjustable stabilization for handwriting.

Status: approved_intent · ID: REQ-005

## REQ-006 · Two-finger double tap undo, three-finger double tap redo, stationary hold colour picker and hel

Two-finger double tap undo, three-finger double tap redo, stationary hold colour picker and held-stroke endpoint shape/line recognition (GDEC-016).

Status: superseded_gesture_wording · ID: REQ-006

## REQ-007 · Gaussian blur and gap-aware paint bucket inspired by Clip Studio Paint

Gaussian blur and gap-aware paint bucket inspired by Clip Studio Paint.

Status: approved_intent · ID: REQ-007

## REQ-008 · Colour wheel, hue/saturation controls and different paper options; review Concepts colour/works

Colour wheel, hue/saturation controls and different paper options; review Concepts colour/workspace UX alongside Procreate and HiPaint.

Status: approved_intent · ID: REQ-008

## REQ-009 · Local timelapse recording and video export; framing and retention remain unresolved

Local timelapse recording and video export; framing and retention remain unresolved.

Status: approved_intent · ID: REQ-009

## REQ-010 · Google Drive synchronization with local offline work

Google Drive synchronization with local offline work.

Status: approved_intent · ID: REQ-010

## REQ-011 · Optional BYOK AI to summarize/diagram selected ideas and export DOCX, PDF, JPG

Optional BYOK AI to summarize/diagram selected ideas and export DOCX, PDF, JPG. Included in first release after base validation (GDEC-010); provider support remains unresolved.

Status: approved_intent · ID: REQ-011

## REQ-012 · Automated checkpoint coding, adversarial frontend and backend/engine tests, Gatekeeper review, 

Automated checkpoint coding, adversarial frontend and backend/engine tests, Gatekeeper review, merge and merged regression, with resumable state.

Status: approved_intent · ID: REQ-012

## REQ-013 · Maintain the project knowledge graph during design and coding, not retrospectively at release

Maintain the project knowledge graph during design and coding, not retrospectively at release. Graph Generator capture mode is active. This snapshot includes an initial capture delta and update protocol, not a validated full KGP export or viewer package.

Status: approved_intent · ID: REQ-013

## GDEC-009 · Human review occurs in batches of approximately 2–4 checkpoints, not after every checkpoint

Human review occurs in batches of approximately 2–4 checkpoints, not after every checkpoint. Each checkpoint still receives independent automated tests, documentation, Gatekeeper review, integration and merged regression. Human reviews judge pen feel and task usability. Dependent batches wait for required human feedback.

Status: approved_intent · ID: GDEC-009

## GDEC-010 · AI summarization/diagramming is included in release one, after validation of base features

AI summarization/diagramming is included in release one, after validation of base features.

Status: approved_intent · ID: GDEC-010

## GDEC-011 · Default pen draws; fingers navigate and invoke gestures

Default pen draws; fingers navigate and invoke gestures. User rarely uses fingers except for smudging.

Status: approved_intent · ID: GDEC-011

## GDEC-012 · Include smudge/blending brush using documented Procreate interactions: shared Paint/Smudge/Eras

Include smudge/blending brush using documented Procreate interactions: shared Paint/Smudge/Erase brush library; size and strength controls; hold tool icon to transfer brush settings. Exact rendering parity remains unverified. Active-raster-layer operation is the proposed implementation boundary, not a newly confirmed vendor specification.

Status: approved_intent · ID: GDEC-012

## GDEC-013 · Experimental Procreate brush import is accepted after native brush validation

Experimental Procreate brush import is accepted after native brush validation. Flag unsupported settings and preview results; no universal fidelity promise.

Status: approved_intent · ID: GDEC-013

## GDEC-014 · Both image and selected PDF-page import are included

Both image and selected PDF-page import are included.

Status: approved_intent · ID: GDEC-014

## GDEC-015 · Editable text boxes, sticky notes and attached connectors are included

Editable text boxes, sticky notes and attached connectors are included. Text supports font and size changes.

Status: approved_intent · ID: GDEC-015

## REQ-014 · Reference image box, colour picker, good inking pens, long-touch colour sampling, Concepts-insp

Reference image box, colour picker, good inking pens, long-touch colour sampling, Concepts-inspired colour shades/palettes and transient pop-out controls.

Status: approved_intent · ID: REQ-014

## REQ-015 · Canvas/artboard dimensions and DPI controls

Canvas/artboard dimensions and DPI controls.

Status: approved_intent · ID: REQ-015

## REQ-016 · Exchange artwork with Clip Studio Paint and Procreate

Exchange artwork with Clip Studio Paint and Procreate. Native-format or PSD route is not yet approved.

Status: approved_intent · ID: REQ-016

## GDEC-016 · Stationary hold colour picker; draw then hold endpoint for straightening/shape recognition

Stationary hold colour picker; draw then hold endpoint for straightening/shape recognition.

Status: approved_intent · ID: GDEC-016

## GDEC-017 · Drive sync preserves both conflicting board revisions; user chooses which to continue

Drive sync preserves both conflicting board revisions; user chooses which to continue. No silent overwrite.

Status: approved_intent · ID: GDEC-017

## REQ-017 · Support moving selected/lassoed content along a path and audience-view pan/zoom

Support moving selected/lassoed content along a path and audience-view pan/zoom. Both manual and timed playback are included; manual advance is default. Offer presentation-only motion with original layout restored (default) and an explicit commit-to-board option. Add a dedicated checkpoint after selection/transforms are validated. Individual cue parameters and recording semantics remain proposed.

Status: approved_intent · ID: REQ-017

## GDEC-018 · Motion Trace

Motion Trace includes object movement and audience camera pan/zoom.

Status: approved_intent · ID: GDEC-018

## GDEC-019 · Motion Trace

Manual and timed playback are included; manual advance is default.

Status: approved_intent · ID: GDEC-019

## GDEC-020 · Motion Trace

Presentation-only restore is default; commit-to-board is explicit.

Status: approved_intent · ID: GDEC-020

## Pen input and brush dynamics

Accepted cumulative browser preview; physical pen capability and full production are outside this verification.

Status: verified_preview · ID: urn:unruly:checkpoint:pen1

## Personal pressure response curve

Accepted cumulative browser preview; physical pen capability and full production are outside this verification.

Status: verified_preview · ID: urn:unruly:checkpoint:curve1

## LSET1 clear layer and global pen settings

CI1 passed198 checks. Hosted old-session update finding reopened acceptance. Repair1 applied and CI2 not run.

Status: paused_repair_pending_ci2 · ID: urn:unruly:checkpoint:lset1

## Adjustable pressure dynamics

Browser-reported pressure controls width and optional opacity; each new stroke snapshots response. Constant mouse/pressure reports cannot certify hardware.

Status: verified_preview · ID: urn:unruly:cap:pressure

## Pen-button mapping

Reported barrel and eraser/second signals map to temporary Lasso→Move, Eraser, Pan or None. OS/Bluetooth buttons may not reach the browser.

Status: verified_preview · ID: urn:unruly:cap:pen-map

## Personal pressure curve

Three monotonic response points at25/50/75% with graph, numeric and keyboard edits, Reset and isolated test pad. Saved per device, applies across brushes to future strokes.

Status: verified_preview · ID: urn:unruly:cap:curve

## Clear active layer

One-click clear contents only, one Undo/Redo, metadata/other layers retained; locked or empty disabled; hidden unlocked deliberate clear allowed.

Status: implemented_ci1_hosted_pending · ID: urn:unruly:cap:clear-layer

## Global pen settings panel

Actions → Pen settings. Both global and Brush entrypoints share one per-device penConfig storage key, across every brush and board.

Status: implemented_ci1_hosted_pending · ID: urn:unruly:cap:global-pen-settings

## Global pressure with optional brush override

User requests global pressure default, replaced only by a defined per-brush override. Current CURVE1 profile is already global; per-brush override hierarchy remains unimplemented.

Status: requested_not_implemented · ID: urn:unruly:cap:pressure-hierarchy

## Timestamped current graph

Store canonical graph in UNRULY repo with preserved creation time, update time, revision ID and live CURRENT.json pointer. Verify current revision before coding.

Status: approved · ID: urn:unruly:decision:graph-freshness

## One bounded increment at a time

Calibration after U3: keep one cumulative preview, one source-bound slice, independent QA and fixed repair/CI budgets; avoid advancing many speculative checkpoints.

Status: current_delivery_policy · ID: urn:unruly:decision:bounded-increments

## Hosted cached-update compatibility

Old session retained older controls after Update despite17hostedasset matches. HTTP-cache reuse is a hypothesis; repaired test and hosted smoke pending.

Status: open · ID: urn:unruly:question:hosted-cache

See canonical JSONL for evidence and history.

# UNRULY — full product roadmap
Updated: 13 October 2026 (Asia/Kolkata).

## Scope preservation
This is the current full-product roadmap index. Five painting checkpoints are a near-term subset, not all remaining product work. Omission, summarization, a browser platform change, or a new chat never cancels a requirement. Record any removal or deferral with the user's explicit decision and source. Keep original requirement/checkpoint IDs when splitting work. Completed subfeatures do not close their entire original checkpoint.

Application baseline: FILL2 complete at source 8a4a94225d01a19716915bc5f7d2551e9b414e73; published and verified. Read CURRENT_CHECKPOINT.md for actual completion evidence. Original PROJECT_STATE.md and docs/review/CHECKPOINT_PLAN.md retain requirements but their early native-platform/governance status is historical; current browser main and current continuation authorization supersede those platform statements.

## Near-term painting sequence
| Work | Status | Scope |
| --- | --- | --- |
| Hue/saturation and levels, including groups | Authorized 13-Oct-2026; not implemented | Next current build. Lock group composition/effect ordering and bounded preview/Apply/Cancel/Undo before implementation. |
| Curves and Gaussian blur | Pending | Tonal curves and bounded blur; group behavior carried forward. |
| TIP1 custom uploaded image tips | Pending; controls accepted | Transparent PNG/grayscale tips, inversion/preview, spacing/spacing jitter, lateral/linear position jitter, fixed/follow-stroke/random rotation, count/count jitter, size/opacity jitter, flip X/Y, global/per-brush pressure, named presets. Import/storage/replay limits unresolved. |
| TIP2 grain and textures | Pending | Imported grain scale/depth/rotation; splatter/sprinkle. No proprietary engine-fidelity claim. |
| Measured capacity/recovery | Pending | Realistic 30–50-layer folders/masks/images stress, real-device latency/RAM and recovery. Existing 32-layer cap is not fulfillment of this target. |

## Other retained product work
This table is not a fixed execution order or a promise that each row needs only one build.
| Original trace | Retained work | Current position |
| --- | --- | --- |
| REQ-017 / C09M | **Motion Trace:** selected/lassoed object or group follows a defined path; audience camera pan/zoom; manual default and timed playback; presentation restores original layout by default; explicit undoable commit. | Confirmed pending feature, not cancelled or arbitrarily relegated to optional work. Selection/transforms exist; cue behavior/storage and vector/raster/text/clipped-target handling require a bounded contract. Neon path styling was requested in historical chat and is retained for acceptance reconciliation; repository confirmed scope does not lock its visual treatment. Motion-video coupling remains unconfirmed. |
| REQ-009 / C10 | **Timelapse recording, drawing replay and video export:** local history, skip idle time, clean output without toolbars/cursors, selected-area/all-content/navigated-view framing. | Required pending feature. Event capture/storage/replay and video export may need separate checkpoints. Current bounded Undo that resets on reload is not persistent timelapse recording. Codec, retention and export budgets unresolved. |
| GDEC-015 / C08 | Sticky notes and attached connectors; richer text controls. | TEXT1 supplies editable generic-font text; sticky notes/connectors are not complete. Custom fonts/wrapping and cross-device font fidelity remain deferred/unverified. |
| GDEC-014 / C09 | Selected PDF-page import and reference companion behavior. | IMPORT1 supplies images/references/patterns; PDF import is pending. Independent reference navigation/docking/sampling parity needs acceptance audit; image import does not close C09. |
| REQ-015 / C05 / C10 | Finite named artboards, dimensions/DPI; bounded PNG/JPG/PDF export and framing/background controls. | Pending beyond current native board JSON/selection PNG capabilities. DPI metadata versus resampling must be explicit. |
| REQ-016 / C07 / C10 | Artwork exchange with Procreate/Clip Studio Paint; experimental proprietary brush import. | Feasibility pending. PSD route proposed, not approved as full-fidelity solution. TIP1 custom images do not fulfill proprietary brush import. |
| REQ-010 / GDEC-017 / C11 | Google Drive sync, offline queue/retry, disconnect/auth expiry and conflict preservation. | Required pending integration. Preserve both conflicting revisions; no silent overwrite. Browser-first does not cancel sync. |
| REQ-011 / GDEC-010 / C12–C13 | BYOK AI for selected ideas, review/edit/insert of summaries/diagrams; DOCX/PDF/JPG outputs. | Retained first-release scope after base validation. Provider choices and transmission/credential boundaries unresolved. |
| REQ-005 / C02 / accepted 6-Oct additions | Adjustable stroke stabilization/smoothing. | Explicitly retained pending work. Current pressure controls and shape straightening do not fulfill continuous stroke stabilization; bounded current-source search found no stabilization control/implementation. |
| REQ-001 / C05–C06 / accepted 6-Oct additions | Drawing guides: ruler, symmetry, snapping guides and grid behavior. | Grid paper exists; it is not a ruler, symmetry engine or editable snapping guide. Dedicated guide tools remain pending. |
| REQ-008 / REQ-014 / C05 | Concepts-inspired colour workflow and palette completeness. | Hue wheel/SV, shade families, recent colours and one saved palette exist in U2. Broader palette management/mixing and reference-image sampling parity remain unverified; do not rebuild shipped basics or silently close the full colour workflow. |
| REQ-001–002 / C06 | Ruler; artwork vector control-point editing and dedicated curve pen; complete intersection geometry. | Existing editable PATH1 selection outlines are not proof of editable artwork nodes/curve pen. Ruler and outstanding vector editing need explicit coverage audit. Existing intersection eraser has historical tests; physical-device issues remain to be checked. |
| C05 / effects decisions | Folder-wide masks, group effects ordering/isolation; pattern deformation. | Leaf masks/clipping/folders exist. Folder-wide masks and pattern deformation remain pending/deferred details; colour-adjustment contract must settle its own group semantics. |
| REQ-003 / C04 | Advanced wet-media/watercolour behavior. | Pending/deferred after native brush/textured-tip validation. Watercolour appearance and pigment simulation remain distinct. |
| C03 / G02 | Whole-canvas rotation and remaining gesture parity. | Whole-canvas rotation explicitly deferred toward final polish, retained. Audit remaining gestures instead of declaring full Procreate parity. |
| REQ-005–006 / C13 | Tablet acceptance, palm/pressure/latency, long-session stress, recoverability, accessibility/polish and end-to-end regression. | Pending real-device evidence. Synthetic CI cannot establish Surface/Lenovo/Xiaomi feel or 50-layer readiness. |
| C01 / C13 | Android packaging and Windows/native feasibility. | Browser-first is current product. Earlier native distribution is historical; future packaging is a feasibility/decision item, not a requirement silently deleted or a promised completed build. |
| REQ-013 | Knowledge graph maintenance. | Last authorized refresh complete after FILL2. No refresh authorized by this roadmap repair/current build; future refresh requires explicit permission. |

## Completed foundation and partial original checkpoints
Cumulative browser main includes brushes/global and per-brush pressure/0–100 size/comparison/recipes, held shapes/picker/pen mapping, layer transforms, rendering/storage/history foundations, raster paint/smudge, folders, leaf masks, clipping/alpha lock, generic editable text, image/reference/repeating-pattern import, magic wand, exact region lasso and selection PNG, large-layer selection repair, editable selection paths, magnetic tracing, gap-aware bucket fill and geometric selection/enclosure fill. Actual evidence lives in scoped delivery receipts; no full original C04–C13 closure inferred.

## Evidence and reconciliation
- PROJECT_STATE.md: REQ-001–017, GDEC-003/010/014/015/017 and Motion Trace confirmed scope.
- docs/review/CHECKPOINT_PLAN.md: original C04–C13, C09M acceptance and the rule not to silently remove first-release scope.
- docs/delivery/CURRENT_CHECKPOINT.md: verified FILL2 closeout and near-term five-checkpoint painting subset.
- docs/delivery/CONTINUATION_CONTRACT.md: cumulative implementation constraints and accepted TIP1 controls.
- Recovered conversation: original 3-Oct timelapse local board-change recording, idle skipping, clean video and framing preferences; 8-Oct Motion Trace manual/timed playback and restore/explicit commit; 13-Oct user correction rejects omission of roadmap checkpoints.
- Reconciliation uncertainty: not every historical requested subfeature has an executed acceptance receipt. Unverified items remain open; do not mark them completed merely because a neighboring tool exists.

## Continuation rule
Read this roadmap alongside the current checkpoint and continuation contract. Every closeout must carry forward all still-open rows through this canonical index. A fixed count can describe only a named subset; the total product build count is not yet established. No user-requested feature is cancelled by this correction. This is a documentation repair, not feature completion, code publication, or a knowledge graph update.

## Mandatory build status maintenance — user instruction 13-Oct-2026
Update this file after EVERY build attempt and closeout, not only graph-refresh batches. Use pending / in progress / failed / blocked / verified-unpublished / published / explicitly deferred as appropriate, carrying exact source and CI/publication evidence plus remaining acceptance gaps. Keep every other open row; no silent deletion. Partial completion never closes a broader original requirement. Architecture ownership/dependencies are recorded in [CODE_STRUCTURE.md](CODE_STRUCTURE.md); AGENTS.md requires both files at startup. The previous five-checkpoint list is only a painting subset. This roadmap consolidates recovered scope, not a claim that every historical microrequirement has been independently proven exhaustive.

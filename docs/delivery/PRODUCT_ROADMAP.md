# UNRULY — full product roadmap
Updated: 16 October 2026 (Asia/Kolkata).

## Scope preservation
This is the current full-product roadmap index. The painting sequence below is a near-term subset, not all remaining product work. Omission, summarization, a browser platform change, or a new chat never cancels a requirement. Record any removal or deferral with the user's explicit decision and source. Keep original requirement/checkpoint IDs when splitting work. Completed subfeatures do not close their entire original checkpoint.

Application baseline: TIME1 published at 0bab964ad5722c5dc3fd6dbe67c5705125635447, after MOTION1. Persistent completed-operation recording/replay and recording backups delivered; clean video export/framing and physical-device acceptance remain OPEN. Motion mixed-target compatibility,32layer cap,30–50interactive target and all other retained scope remain. See CURRENT_CHECKPOINT.md for current evidence.

## Current build priority — owner decision, 16 October 2026

Complete the remaining drawing and painting work before export-focused builds. This order supersedes earlier near-term sequences and “video export next” proposals; historical build receipts remain unchanged. Work groups are not fixed build counts. No requirement is removed.

1. **Stroke stabilization/smoothing** — next proposed checkpoint.
2. **Drawing guides and editable geometry** — ruler, symmetry, snapping, artwork control-point editing and dedicated curve pen; intersection-eraser completeness/device issues.
3. **Painting and composition completion** — custom-tip alpha-lock compatibility, proprietary brush-import feasibility, expanded palettes/mixing/reference sampling, folder-wide masks, group opacity/blends/effects ordering, pattern deformation and advanced wet-media/watercolour.
4. **Drawing workflow completion** — whole-canvas rotation/remaining gestures, sticky notes/attached connectors/richer text, Motion Trace mixed region/original-object compatibility, and focused pen/palm/performance acceptance. Earlier drawing-tool deferrals are brought ahead of export by this owner instruction; feasibility/unverified status is not converted to completion.
5. **Clean timelapse video export** — codecs, framing, cancellation and storage budgets; recording/replay is already published.
6. **Artboards and artwork export** — finite named artboards, dimensions/DPI and PNG/JPG/PDF export with framing/background controls.
7. **Release-candidate validation and fixes.**

Selected PDF-page/reference work, artwork interchange, Google Drive sync, BYOK AI and every other retained roadmap row remain in scope. This drawing-before-export decision does not approve removing them from the first release or establish a total remaining build count. Their detailed requirements/statuses remain in the canonical tables below. No new feature implementation is authorized by this documentation update.

## Published painting checkpoints (historical build sequence)
| Work | Status | Scope |
| --- | --- | --- |
| Hue/saturation and levels, including groups | Published — HSL1 | CHG-UNRULY-HSL1-1013: metadata-only layer HSL/levels and isolated combined-group effects. Source 098c8463e86cd9d0c404381616314e306cc69fb4; CI38433660119 SUCCESS307models/289Chromium; PR12 merged; Pages38436283497 SUCCESS48hosted byte matches. Device feel remains unverified. |
| Curves and Gaussian blur | Published — FX2 | Master/RGB curves and padded Gaussian blur for layers/groups; v11metadata preserves originals. Source6c3e49f942675e020cc517f508c3bfd5473d7148; CI38440969358 SUCCESS322models/299Chromium/132identities; PR13 merged; Pages38443319147 SUCCESS50hosted bytes match. Physical-device acceptance remains open. |
| TIP1 custom uploaded image tips | Published — TIP1; compatibility gap retained | Transparent PNG/grayscale tips, inversion/preview, spacing/spacing jitter, lateral/linear position jitter, fixed/follow-stroke/random rotation, count/count jitter, size/opacity jitter, flip X/Y, global/per-brush pressure, named presets. Named sections/create/rename/move, local library backup/import. Sourcea415dd3530bd0ff8cdb7479cd60e22e2d8f0dd33; Actions38583117039 SUCCESS341model tests/310Chromium scenarios/136source identities. PR14 merge95911bae5c52f68757bae658bbd8685d5121b1a2 exact tested tree. Publicationc0cccf354d23914be7b115cedf57b7a2769be948; Pages38585969301 SUCCESS52hosted byte matches. v12strokes retain masks/settings/seeds/effective dynamics. <=128px tips; existing2048px/12MiBsource decoder;16sections/32brushes/1MiBlibrary;4,096stamps/4,194,304sampled-mask-pixel work per stroke. Alpha-lock custom-tip stamping remains open: explicit guard preserves artwork; use clipped layers. Mask/smudge retain their own tips. Pressure profiles device-local; repeated masks count against8MiBboard cap. Physical tablet/50-layer and proprietary brush parity not claimed. |
| TIP2 grain and textures | Published — TIP2 | Imported PNG/JPEG grain, scale4–128tip pixels/depth0–1/rotation±180/invert; tip-local tiled sampling, portablev13strokes/library; depth0preserves original pixels. Ready-to-save Splatter/Sprinkle presets reuse seeded scatter/count/direction controls. Source3af2a6bdf84dd251c83a7770f26d5cd5fd7f9eba; CI38671904693SUCCESS358models/320Chromium/142source identities. PR15mergeff4b756709da36cff77edab0ed56aeb67e39ff52 exact tested tree. Publicationeeca0961697662996aa2c752db4d9d350dd23f4a; Pages38673569838SUCCESS54hosted byte matches. Existing alpha-lock/vector-mode limits and proprietary import/engine parity gaps remain. |
| Measured capacity/recovery | CAP1 measured/recovery and CAP2 retention engineering published; interactive/device acceptance OPEN | Processed folder surfaces retained within spare80MiBbacking,<=16MiBcache; exact reference pixels, invalidation, fallback,32layer native/history/IDBsave/reload/recovery/conflict/quota tests passed.50layers remain renderer-only; document cap32. Mixed50layer warm medians~231msDPR1/~527msDPR2 in targeted preflight. Active effects/unretained leaves remain expensive. Full30–50interactive, physical-tablet/long-session/processRAM acceptance remains OPEN; no cap increase. Scoped CAP2 PERFORMANCE_REPORT/QA/PUBLICATION receipts hold evidence. |

## Other retained product work
This table is not a fixed execution order or a promise that each row needs only one build.
| Original trace | Retained work | Current position |
| --- | --- | --- |
| REQ-017 / C09M | **Motion Trace:** selected/lassoed object or group follows a defined path; audience camera pan/zoom; manual default and timed playback; presentation restores original layout by default; explicit undoable commit. | MOTION1 engineering baseline published: saved v14 movement/camera cues,pen/mouse/numeric paths,manual/timed/Pause/Resume/Stop,one-Undo commit; native/offline/import remapping and vector/raster/text/mask/clip/region checks passed. Region commit rasterizes its layer undoably. Same-layer mixed region/original-object cue compatibility and physical/audience acceptance remain OPEN; not full C09M closure. Paths are translation-only; motion/video coupling unconfirmed. Original requirement retained. |
| REQ-009 / C10 | **Timelapse recording, drawing replay and video export:** local history, skip idle time, clean output without toolbars/cursors, selected-area/all-content/navigated-view framing. | TIME1 published: opt-in persistent completed-operation history, Pause/Resume/reload-paused gap recovery,scrub/step/timed/idle-skip read-only replay,separate JSON recording backup/import/confirmed attachment.2000states/32MiB per board,128MiB global payload; visible stop on limit/conflict/quota,no silent eviction. Native board JSON excludes recording. Continuous pen-point animation,clean video export/framing/codec/retention UX and physical/long-session acceptance remain OPEN; not full C10closure. |
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
| C05 / effects decisions | Folder-wide masks, group effects ordering/isolation; pattern deformation. | Leaf masks/clipping/folders exist. Folder-wide masks and pattern deformation remain pending/deferred details; HSL1 implements isolated group HSL/levels; folder masks,group opacity/blends and deformation are still open. |
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
- docs/delivery/CURRENT_CHECKPOINT.md: latest verified build, remaining acceptance gaps and next proposed checkpoint.
- docs/delivery/CONTINUATION_CONTRACT.md: cumulative implementation constraints and accepted TIP1 controls.
- Recovered conversation: original 3-Oct timelapse local board-change recording, idle skipping, clean video and framing preferences; 8-Oct Motion Trace manual/timed playback and restore/explicit commit; 13-Oct user correction rejects omission of roadmap checkpoints.
- Reconciliation uncertainty: not every historical requested subfeature has an executed acceptance receipt. Unverified items remain open; do not mark them completed merely because a neighboring tool exists.

## Continuation rule
Read this roadmap alongside the current checkpoint and continuation contract. Every closeout must carry forward all still-open rows through this canonical index. A fixed count can describe only a named subset; the total product build count is not yet established. No user-requested feature is cancelled by this correction. This is a documentation repair, not feature completion, code publication, or a knowledge graph update.

## Mandatory build status maintenance — user instruction 13-Oct-2026
Update this file after EVERY build attempt and closeout, not only graph-refresh batches. Use pending / in progress / failed / blocked / verified-unpublished / published / explicitly deferred as appropriate, carrying exact source and CI/publication evidence plus remaining acceptance gaps. Keep every other open row; no silent deletion. Partial completion never closes a broader original requirement. Architecture ownership/dependencies are recorded in [CODE_STRUCTURE.md](CODE_STRUCTURE.md); AGENTS.md requires both files at startup. The previous five-checkpoint list is only a painting subset. This roadmap consolidates recovered scope, not a claim that every historical microrequirement has been independently proven exhaustive.

## HSL1 closeout — 13-Oct-2026
Published 098c8463e86cd9d0c404381616314e306cc69fb4 with307model tests/289Chromium scenarios and48hosted file matches.14new model tests and8new browser scenarios. Nativev10 preserves originals and stores optional adjustments; Reset removes isolation; one Undo restores prior appearance/version. Adjusted groups use bounded full replay, not retained live cache. No physical-tablet/50-layer readiness claim. One completed application build since last authorized graph refresh; graph itself unchanged. Next proposed painting checkpoint curves/Gaussian blur; ALL other open product rows above remain. First HSL1 source870fe3f was superseded by review corrections; its CI was cancelled, not published. Exact attempts, scope, QA and publication receipts in .delivery/CHG-UNRULY-HSL1-1013/.

## FX2 closeout — 13-Oct-2026
Source6c3e49f942675e020cc517f508c3bfd5473d7148 published.15new model/10new browser tests; all322models/299Chromium passed. Master/RGB piecewise-linear curve editing,document sigma0–16Gaussian blur,unsaved preview/Apply/Cancel/Reset/one Undo. Layers/group metadata retain originals; group effects isolate combined descendants. Padding includes offscreen/nested halo support within80MiB backing; clipped group alpha uses filtered matte within8MiB cache. Native Gaussian approximation is not proprietary-engine parity; physical pen/50-layer/totalRAM acceptance unverified. Two completed application builds since last authorized graph refresh; KG unchanged. Next proposed TIP1 custom uploaded image brush tips with all previously accepted controls above; all other open product rows retained. No automatic next build. Exact source/scope/QA/publication receipts in .delivery/CHG-UNRULY-FX2-1013/.

## TIP1 active attempt —14-Oct-2026
Authorized image tips plus named sections. Candidate1new8browser journeys passed; source5c8716f/CI38579802366 superseded by scoped scatter bounds correction. Candidate2verification pending; not yet published. All accepted jitter/rotation/pressure controls retained. Image-tip alpha-lock stamping is not supported in this bounded build: explicit guard preserves artwork; use a clipped layer for shading. Existing mask/smudge tools retain their own shapes. Google Photos folder conversion awaits user-provided originals; no Photos integration or automatic background segmentation claimed. All other roadmap rows, including Motion Trace/timelapse, remain open. KG unchanged.

TIP1attempt update: candidatec544bd5 / CI38580687915failed an old cache-name expectation in HSLB06; tip10/FX2tenbrowser journeys passed. Runtime unpublished. Correct two already-scoped suffix literals, retain offline assertions, rerun cumulative QA. No feature removed; KG unchanged.

TIP1candidate4ecba773review found empty inverted-source Save could reuse stale preview. Candidate5adds current-source admission at Save plus TIPB11rejection/recovery; cumulative verification pending, no publication yet. Other rows/graph unchanged.

## TIP1 closeout —14-Oct-2026
Sourcea415dd3530bd0ff8cdb7479cd60e22e2d8f0dd33; Actions38583117039 SUCCESS341model tests/310Chromium scenarios/136source identities. PR14 merge95911bae5c52f68757bae658bbd8685d5121b1a2 exact tested tree. Publicationc0cccf354d23914be7b115cedf57b7a2769be948; Pages38585969301 SUCCESS52hosted byte matches.19new model tests and11new browser scenarios. Brush Library→Image tips & sections: create/rename sections, import PNG/JPEG masks, preview/invert and edit accepted jitter/rotation/count/flip controls, save/move/edit/delete named library brushes, export/import library JSON. Saving/editing library is separate from artwork history. v12drawn strokes embed mask/options/seed/effective dynamics; Undo/Redo/native JSON/reload and library-independent replay verified. Empty inverted mask Save rejects rather than reusing stale preview.

Scatter bounds cover selection/export, complete pixel-edit complement tiles, thumbnails and smudge snapshots. Live temporary tip backing/cache allowance remains inside80MiB;5base renderer surfaces and frozen source/pixel oracles retained. Existing8MiBboard/16MiBhistory/32layers retained; repeated embedded tips reduce effective stroke capacity. New brushes require Vector ink with Alpha lock off; custom-tip alpha-lock stamping remains an explicit compatibility gap, while clipped-layer shading works through existing composition. Mask painting/smudge retain their own tools. Pressure profiles remain device-local; saved stroke dynamics travel with board JSON.

No Photos connector, automatic subject segmentation or folder conversion claimed: user originals/archive not yet supplied. PNG/JPEG masks and brush-library JSON can be imported now. Next proposed painting checkpoint TIP2grain/textures; measured capacity/recovery and ALL other product rows—including Motion Trace and timelapse/video—remain open. Three completed builds since last authorized graph refresh; KG unchanged. Earlier active-attempt paragraphs are historical. Exact attempts/scope/QA/publication receipts in .delivery/CHG-UNRULY-TIP1-1014/.

## Authorized painting batch —15-Oct-2026
TIP2thenCAP1in one delivery; separate checkpoint gates/status. Basee880b0a; scope .delivery/CHG-UNRULY-TIP2CAP-1015/. No capacity bump without successful measured probe. Physical device acceptance retained pending. All other roadmap rows preserved; KG unchanged.

## Painting batch measured finding —15-Oct-2026
TIP2implemented, verification in progress. CAP1probe38671573229shows50layer mixed replay preserves exact reference pixels/backing bounds, but warm450–476msDPR1and1058–1080msDPR2does not establish interactive readiness. Keep32layer cap. CAP1measurement/recovery engineering gate proceeds; CAP2render-performance optimization and physical-tablet/30–50acceptance remain explicitly OPEN. User-authorized split for substantial capacity findings; no requirement removed. One new UI selector failed by counting folder rows, not lost/saved artwork. No publication yet. KG unchanged.

## TIP2 + CAP1 batch closeout —15-Oct-2026
Source3af2a6bdf84dd251c83a7770f26d5cd5fd7f9eba; CI38671904693SUCCESS358models/320Chromium/142source identities. PR15mergeff4b756709da36cff77edab0ed56aeb67e39ff52 exact tested tree. Publicationeeca0961697662996aa2c752db4d9d350dd23f4a; Pages38673569838SUCCESS54hosted byte matches.17new models/10new browser cases. TIP2delivers imported stamp-local grain scale/depth/rotation/inversion, removable portable textures, Splatter/Sprinkle ready-to-save presets. Existing image-tip sections, pressure, Undo/Redo, native/library/clipboard transfer and offline use retained. Nativev13grain needs this reader or newer; no vendor brush-format fidelity claim.

CAP1engineering gate passed defined mixed30/32/50renderer probes and32layer actual document/recovery checks.50layer full replay with group HSL/blur was~0.5sDPR1/~1.2sDPR2onCI; paired removal of group effects improved warm work to~65–180ms. Correctness/memory results do not establish interactive readiness. **Keep32layer cap. CAP2processed-group retention/performance is explicitly open**, plus physical Surface/Xiaomi/Lenovo pen/palm/latency/long-session acceptance. No GPU/Rust/OPFS or storage rewrite slipped into this build. User-authorized split for substantial capacity findings preserves the entire30–50target; it is not closed or cancelled.

Recovered previous-valid revision and subsequent save, stale-tab conflict rejection, injected quota/transaction-abort preservation, invalid capacity-save rejection and native/history/UIreload verified. This does not simulate OS power loss or establish processRAM. Existing8MiBboard/16MiBhistory/80MiBbacking/folder16/depth8bounds and raw renderer/pixel oracles retained.20shared runtime modules byte-unchanged.

Next proposed painting/performance work is CAP2bounded processed-group optimization with exact invalidation and capacity budgets; physical acceptance follows measured improvements. TIP1custom-tip alpha-lock, Motion Trace, timelapse/video, guides/vector/whiteboarding/PDF/export/sync/AI/wet-media/packaging and ALL other pending rows remain. Four published application batches since last authorized graph refresh; KG unchanged. Earlier in-progress attempts are historical. Scope/attempts/probe/capacity/QA/publication evidence in .delivery/CHG-UNRULY-TIP2CAP-1015/.

## Historical CAP2 attempts — 15-Oct-2026
User authorized next checkpoint. Base 5d5a3afcc04ff94420659b9dce0a8035594542b8. Processed-group retention/invalidation and bounded performance verification in progress; no passing or publication claim yet.32layer cap and all other pending rows preserved; KG unchanged.

CAP2attempt1:361local model tests pass; local browser blocked by missing executable/invalid Chromium download. Remote cumulative and targeted browser checks pending; not published.

CAP2preflights38728720281and38728923400passed. Final byte-accounting diagnostics consistency correction and cumulative verification pending; existing live version unchanged.

CAP2attempt2: cumulative38729191826FAILED on stale offline SWsuffixHSLB06. Scope revision permits only version-literal migrations in two additional offline tests; no publication, cap change or requirement closure. All product rows retained.

## CAP2 closeout — 15-Oct-2026

Source 90630dd21ab35c5b4000ce93bcbeddd98017a8f5; cumulative CI 38729736179 SUCCESS: 361 model tests, 322 Chromium scenarios, 145 source identities verified from the downloaded artifact. PR16 merge 2fff3989c3964bbd6bcdcef11f943b088cb066db has the exact tested tree. Publication commit 6196d39e47b90bae9be279b18c789588cd053141; Pages 38731877005 SUCCESS with 55 hosted application files matching tested bytes.

CAP2 engineering scope is complete: optional processed-folder retention, exact content/live/view/hierarchy/clipping invalidation, bounded backing and replay fallback. It changes no saved format or document limit.51 existing application files remain byte-identical to base; model/storage/original renderer/clipping/filters/folders unchanged. Existing six offline tests changed only the exact worker identity literals.

35 cached/reference mutation cases per DPR1/2, growing-live strokes, mask drafts, helper/reference/resize recovery and zero-budget fallback passed;361 model tests include ownership/headroom/allocation-failure cases. All cumulative legacy assertions retained. Current32layer cap,8MiBboard,16MiBhistory and80MiBbacking remain. Retention is capped16MiB and further limited to actual spare backing.

Measured mixed50layer renderer-only warm medians~231msDPR1/~527msDPR2 in targeted preflight, versus prior~0.5s/~1.2s across runs. This is improvement, not interactive50layer readiness. Active group effects and unretained/unadjusted layers still replay. Full30–50interactive target plus Surface/Xiaomi/Lenovo pen/palm/latency/long-session/processRAM acceptance remain OPEN.50layers are not admitted/saved documents.

Next proposed feature: Motion Trace REQ-017/C09M, then persistent timelapse recording/replay and video export, artwork export and release-candidate testing as discussed. No next build automatically authorized. No early-access scope cut approved: Drive sync, BYOK AI and every other full PRODUCT_ROADMAP row remain retained. TIP1 alpha-lock custom-tip gap also remains.

Five published application batches since last authorized graph refresh; knowledge graph unchanged. Same-session owner-authorized verification/publication, not independent approval or physical-device sign-off. Scoped impact/plan/revisions/attempts/performance/scope/QA/publication receipts are in .delivery/CHG-UNRULY-CAP2-1015/. Local browser was blocked by missing Chromium/download failure; GitHub Chromium executed. Bundled contract validator dependency was unavailable; explicit stdlib schema/link check passed, not a claim of external validator execution.

## Historical MOTION1 attempts —15-Oct-2026
User authorized next checkpoint REQ-017/C09M. Base 2c8c615a5ebd2bbf2cadf82b5b31d13b6637c1f4. Bounded saved object/region/folder motion and camera cues,manual/timed non-destructive playback and one-Undo explicit commit. Plan/impact/UX contracts committed before implementation; not yet verified or published. Every remaining roadmap row and32layer/device-performance gaps retained. KG unchanged.

MOTION1attempt1: saved v14cues and disposable object/region/folder/camera playback implemented.372model tests pass; production UI validation0errors. Actual browser/visual/cumulative verification pending. Not published; no broader roadmap closure; KG unchanged.

MOTION1attempt2: preflight38766631599FAILED region playback timing;9/10new browser scenarios passed. Negative RAFprogress correction and mobile/focus refinements under verification. No publication or C09Mclosure; original full scope retained; KG unchanged.

MOTION1visual review: preflight38767247208passed10browser scenarios, but screenshot review found hidden SVGpath overlay. Attribute correction and real-pointer/visible-overlay regression added; final checks pending, no publication.

MOTION1attempt3: real-pointer/mobile/region checks pass; preflight38767903689failed an inappropriate zero-height horizontal-SVG visibility assertion. Screenshot confirms visible neon stroke; geometry-aware visibility check replaces it. Runtime unchanged, final QA pending; not published.

MOTION1preflight38768437038passed all10browser scenarios, including visible neon path and actual mouse drag. Final completion-status accuracy check added; cumulative QA pending. Same-layer mixed pixel-region/original-object cue sequencing remains an explicit compatibility gap; not silently closed or removed.

## MOTION1 closeout —15-Oct-2026

Source 81a452809df78203b067e9e6a7e02569f1b4c409; cumulative CI 38768769402 SUCCESS: 372 model tests, 332 Chromium scenarios and 150 source hashes verified from the downloaded artifact. PR17 merge f7ae0187bb151bc4283458ac4ecb614743538917 has the exact tested tree. Publication commit 8a558d4ac42201f1a2d93fa69fb337c5511c73c0; Pages 38771750451 SUCCESS, with 58 hosted application files matching tested bytes.

MOTION1 delivers saved movement/camera cues in the existing cumulative browser app. Actions→Motion Trace; select with lasso then open Motion Trace, or use a folder Actions→Motion Trace. Draw a relative document-space path with pen/mouse or enter its endpoint; edit camera centre and zoom. Save cue stores metadata only. Manual Next is default; timed sequence,Pause/Resume and Stop/restore are available. Hidden-tab/window blur pauses without auto-resume. Preview is disposable; autosave/export never read the preview board. Explicit Commit position writes current geometry in one Undo. Stop/Close restores original artwork/view.

Object/folder motion preserves vector/raster/text representation; folder movement includes leaf masks and uses existing clipping/effect rendering. Pixel-lasso motion uses the existing bounded original-source split and complete outside-pixel complement; only explicit region commit rasterizes the affected layer, and Undo restores originals. Cues survive reload/offline and travel in native board JSON. New optional v14metadata validates/remaps cue/stroke/layer/folder identities on import; older versions remain readable. Use a v14-capable reader for boards saved with cues.

Limits:24cues,128pathpoints,0.25–30seconds/cue,2MiBcue metadata within existing8MiBboard;32layers,16MiBhistory and80MiBrender backing unchanged. Missing/hidden/locked/stale region sources reject playback atomically. Region cues are spatial masks tied to source IDs,not semantic object trackers. Same-layer mixed independent region/original-object cue sequencing can become unresolved after transient region conversion: this compatibility gap remains OPEN, with no dropped targets or whole-object fallback. Recapture after a destructive region commit,or Undo. Full C09Mowner/device/audience-clarity acceptance is not closed solely by these tested paths. See scoped KNOWN_LIMITS.md.

The original renderer/storage/selection/wand/lasso/history implementation remains unchanged;50existing application files match base bytes. Six older offline assertions change only the exact worker identity. Local372model tests passed; actual Chromium ran in GitHub after local Chromium/download was unavailable. Static UI validation0errors; warnings/84-of-100same-session visual review and corrected screenshot defects are recorded in UI_REVIEW.json. No independent human/protected approval claim.

Next proposed feature: timelapse recording/replay, then clean video export,artboards/artwork export and release-candidate testing. No next build automatically authorized. Motion mixed-target compatibility,physical device/long-session/palm/pen/audience review and30–50interactive performance remain retained OPEN. All other PRODUCT_ROADMAP rows—including Drive sync and BYOK AI first-release intent—remain. No early-access scope cut approved. Six published application batches since last authorized graph refresh; KG unchanged. No skill modifications.

Scoped impact/plan/UX/visual contracts,failed attempts,preflight,scope,known limits,change-impact map,QA and publication receipts are in .delivery/CHG-UNRULY-MOTION1-1015/.

## TIME1 active build —15-Oct-2026
REQ-009/C10 persistent local board-change recording/replay authorized. Base9165878; implementation not yet verified/published. Bounded append-only deltas, explicit start/pause/resume, reload-paused recovery, disposable replay/idle skipping and recording backup are in scope. Continuous handwriting interpolation, clean video export/framing remain separate pending work. All other roadmap rows remain unchanged; KG unchanged.

TIME1 review revision2: recording backup portability must handle native import assigning a new board ID. Explicit attach-to-empty-slot confirmation added to scope; no artwork replacement or silent recording overwrite. Candidate8e5e4fad under CI, unpublished. All other rows/KG unchanged.

TIME1attempt8e5e4fad: preflight38778480189FAILED13/14; corruption assertion ran before replay read persisted data. Corrected to request replay and retain corruption/original-preservation assertions. Backup attachment revision2also pending verification. Not published; other requirements/KG unchanged.

TIME1candidatef29261bfa4d8c8ed4e3ea171c9c13625f588fc46: preflight38778846585SUCCESS14browser journeys. Superseded before publication by compact replay layout and explicit2000state/32MiB boundary tests; verification pending. Scope retained, KG unchanged.

TIME1attempt74e43a6c: preflight38779281817FAILED14/15;320pxStop measurement raced async replay loading. Screenshot shows visible Stop. Retain viewport assertion and wait for replay-ready before measurement; add actual layer-selection-only exclusion test. Runtime remains unpublished; all scope/KG unchanged.

TIME1memory revision3: explicitly own retained delta substrings to avoid pinning superseded full board strings; final source verification required. Existing limits and all other roadmap rows remain, KG unchanged.

TIME1revision4: a refused inspector entry must pause capture before error handling can abort queued writes, so Resume always rebuilds from the saved prefix. Add real mask-mode refusal→artwork edits→Resume→validated log journey. Candidate55adefd7 targeted15passed; final revised source pending. All other product scope and KG unchanged.

## TIME1 verified, publication pending —15-Oct-2026
Source 0bab964ad5722c5dc3fd6dbe67c5705125635447; cumulative38781105113SUCCESS; preflight38781105165SUCCESS16browser journeys. PR18 merged 486b114c50b98de0effe3806e69306ea43619991 with exactly the tested tree8211680c308c9100eca3591bfd414b19abe698f9. Publication pending. Runner will independently download the cumulative artifact, verify ZIP digest/commit/all source hashes and386model/348browser results before deployment, then compare every hosted asset. This is automated same-session verification, not independent human/protected approval. Local execution environment disconnected; GitHub source/CI/runner remain the delivery route. All roadmap scope and knowledge graph remain unchanged.

## TIME1 publication attempt correction
Publicationad600fe65a0dfd8ad88e56f90a378899ee3270c2 / Pages38785705825/job116597037781 failed BEFORE deployment: ZIP digest/commit and155source hashes passed, but parser counted340JSON cases with IDs against348expected. Legacy viewport-result rows omit IDs, and fullscreen/airbrush report through text-only PASS markers. Extend reader to validate these observed formats, keep total348 and every-PASS assertions. No application/test assertion change; previously deployed app retained. Cumulative source0bab964a remains verified. KG unchanged.

TIME1 publication reader correction2: Pages38786022176/job116598105739 again stopped before deploy.155hashes passed; expanded reader found348JSON browser scenarios plus2separately executed legacy text checks (fullscreen/airbrush), total350. Keep required348JSON count/all-PASS and validate the2console markers separately; receipt reports both. This reconciles actual report formats without changing application tests or reducing their assertions. Earlier332baseline/348current counts refer to JSON scenarios. Same tested app source0bab964a and retained roadmap/KG.

## TIME1 closeout — 16 October 2026

Source 0bab964ad5722c5dc3fd6dbe67c5705125635447; cumulative CI38781105113 SUCCESS:386model tests,348Chromium JSON scenarios plus2legacy console checks. Publication runner verified the downloaded artifact ZIP digest, commit identity and155source hashes against this pinned checkout. PR18 merge 486b114c50b98de0effe3806e69306ea43619991 has exactly the tested tree8211680c308c9100eca3591bfd414b19abe698f9. Publication 5eead4c6265c6b9d181dd2255246df8ddfb400f6; Pages 38786233048 SUCCESS; 61 hosted application files match tested bytes.

TIME1 delivers opt-in local recording of completed board edits, Undo and Redo. Actions→Timelapse→Start recording closes the inspector for drawing; the recording badge reopens it. Pause/Resume capture, reload-paused recovery and board-switch isolation preserve the saved prefix. Resume marks an unrecorded gap/current state; it does not fabricate intermediate edits. Selection/revision-only changes and cancelled strokes are excluded.

Replay saved changes offers scrub,Next state,0.5×–4× speed,idle skipping,Pause/Resume and Stop/restore. Blur/hidden/resize pauses playback. Temporary preview never changes h.board,autosave,native export or Undo. Stop/Close restores current artwork and view. Tested composition pixels match source at DPR1/2 with group blur,masks,clipping,text and raster. Replay displays completed operations; continuous pen-point animation and clean video export/framing remain OPEN.

Separate IndexedDB unruly-timelapse-v1 stores a baseline and owned text deltas, leaving native board schema/model/history/artwork storage/renderers unchanged. Limits:2000states/32MiB UTF-8 event payload per board,128MiB global payload;4queued snapshots/32MiB conservative UTF-16 queue. Atomic revision-guarded appends and discard tombstones preserve conflicts. Limit/quota/backpressure/error visibly pauses capture; artwork editing/autosave continue. Browser storage overhead,total process memory and target-device/long-session performance remain unmeasured.

Native artwork JSON excludes recording. Back up recording downloads separate JSON. Import validates every reconstructed board; attaching a different-board backup to an empty recording slot requires confirmation and remaps only recorded root board IDs. Artwork/Undo remain unchanged. Discard requires separate confirmation. Browser eviction/site clearing/abrupt tab termination still require backups; no cloud sync claimed.

14new model tests and16new browser journeys;54existing application files byte-identical to base. Seven legacy offline tests changed only exact SWcache identity literals. Static UI validation0errors; same-session visual review83/100 and warning dispositions in UI_REVIEW.json. No independent human/protected approval claim. Local execution disconnected after initial checks; final exact-source execution and downloaded-artifact/host verification ran in GitHub.

Next proposed checkpoint: clean timelapse video export with explicit framing/codec/cancellation/storage budgets. No automatic next build. All PRODUCT_ROADMAP rows remain, including Drive sync and BYOK AI first-release intent. Motion Trace same-layer mixed region/original-object compatibility,32layer/30–50interactive capacity and physical Surface/Xiaomi/Lenovo/palm/pen/audience/long-session acceptance remain OPEN. No early-access scope cut approved. Seven published application batches since last authorized graph refresh; knowledge graph and skills unchanged.

Scoped records: .delivery/CHG-UNRULY-TIME1-1015/ includes impact/plan,UX/visual boundaries,known limits,all failed/superseded attempts,manual scope/schema checks,change-impact map and QA/publication receipts. Earlier active-attempt entries are historical.


## Knowledge graph refresh — 16 October 2026

Owner-authorized incremental refresh captures HSL1, FX2, TIP1, TIP2+CAP1, CAP2, MOTION1 and TIME1: seven published batches/eight checkpoints since FILL2. Current graph records drawing/painting before video/artwork export, cost controls and all retained gaps/scope. No roadmap requirement removed or new application build/deployment performed. Counter reset to zero; .knowledge/CURRENT_GRAPH.json binds graph commit and package hashes.


## STAB1 —16 October2026, implementation pending verification

REQ-005/C02: adjustable0–100 device-local smoothing for ink/image tips,pixel paint and mask painting. Off preserves raw input. Constant-state geometric filter preserves pressure and exact successful-release endpoint; no board-schema/replay change. Targeted model checks10/10 PASS; browser/cumulative verification and publication pending. Real-device feel/latency remain OPEN. No other scope removed. Knowledge graph unchanged by owner instruction. Next proposed work group: drawing guides (ruler/symmetry/snapping), with vector nodes/curve pen/intersections still retained separately.

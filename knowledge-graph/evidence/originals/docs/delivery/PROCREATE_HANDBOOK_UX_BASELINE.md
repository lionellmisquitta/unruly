# UNRULY — Procreate handbook UX baseline

6 October 2026. Authoritative research amendment to DUX1. The user selected the Fundamentals PDF interface and then explicitly chose Procreate’s gestures. **Two-finger SINGLE tap Undo / three-finger SINGLE tap Redo are confirmed defaults.** Earlier double-default and “gesture decision pending” statements are historical and superseded. This closes the user-owned reference decision; it does not certify implementation, hardware feel or production readiness.

## Coverage and reference authority

Reviewed all 104 named handbook navigation pages and their nested subsections, plus the Introduction landing alias: 105 successful retrievals, no failed pages, 14 main tool sections. The audit records 1,786 functional headings and 83,055 article words including the alias. Four reports cover 40 interaction, 19 brush/effect, 23 layers/gallery/actions and 23 extended-component pages. See HANDBOOK_REVIEW_MANIFEST.json and the four HANDBOOK_*_REVIEW.md files. Coverage means the actual bodies were read, not merely their titles.

The July 2022 / Procreate 5.2 workbook remains the selected visual layout; the current unversioned handbook includes 5.4 and newer hardware capabilities. Newer native capabilities inform behaviour but do not silently enlarge the current whiteboard build. The handbook describes workflows; it does not disclose proprietary recognition, brush or colour-engine algorithms. Our icons, recipes and texture assets remain original or explicitly compatible with the MIT distribution. No copied reference articles, images, brush assets or PDF are bundled.

## Immediate UI target

- Dark compact icon toolbar: document/actions/selection/transform at the upper left; brush/smudge/eraser/layers/colour roles at the upper right. Keep original icons, accessible names, focus and hover/press help. Undelivered tools are omitted from the working UI; no enabled decorative Smudge or filter buttons.
- Narrow left Size and Opacity rail, with Undo/Redo. Numeric readouts appear while adjusting. It collapses independently of the Layers popover. Opening an overlay never shifts the canvas coordinate origin.
- Active Brush tap opens the two-column category/preset library; outside dismissal consumes the tap without drawing. Per-preset size/opacity memory is bounded settings state, not an artwork mutation.
- Compact Layers popover: topmost first, selected row highlighted, thumbnail/name/visibility, blend indicator opening selected-layer opacity/mode controls. Add above active; hold-drag reorder; swipe actions with menu and keyboard alternatives. Background/paper is a separate non-paintable bottom row.
- Hue ring and inner saturation/value disc are the primary picker. Generated Concepts-inspired shade suggestions and HSL/hex values are secondary views of the same colour. Colour history, a saved palette and a currently previewed colour are different state lifetimes.

These selected reference choices replace the historical labelled-button mockup; no second full-layout confirmation is required. Accessibility alternatives remain even where native reference gestures are used.

## Gesture behaviour and delivery map

“Target” means the accepted interaction direction. “Current” means inspected app behaviour, not this research package. U3 is the bounded first gesture slice; G02 is a subsequent reference-gesture completion checkpoint whose implementation handoff/readiness is still required.

| Gesture | Accepted behaviour | Delivery boundary |
|---|---|---|
| Two-finger single tap | Undo | U3; replaces double-chord default. No second-tap waiting window. |
| Three-finger single tap | Redo | U3; separate from two-finger admission. |
| Two-/three-finger hold | Rapid Undo/Redo | G02; configurable delay/repeat and history ownership, no extra undo at release. |
| Two-finger movement/pinch | Pan/zoom | Current basic behaviour; U3 arbitration/regression. |
| Two-finger twist | Rotate the view | G02; needs rotation-aware drawing, paper, eraser, selection, sampling and cached rendering. |
| Quick pinch | Fit artwork, with remembered return view | G02; infinite canvas uses visible-content bounds, finite artboard bounds when set. Empty board resets to origin/default zoom. Fitting does not alter geometry. |
| Three-finger downward swipe | Clipboard menu | G02; active-layer geometry clipboard first, explicitly distinguished from OS/pixel clipboard. |
| Four-finger tap | Hide/show application chrome | G02; does not require or claim browser fullscreen permission. Provide a visible exit affordance. |
| Finger long-hold then drag/release | Eyedropper | U3; sample visible composite. Cancel restores the previous colour; commit on release. |
| Draw with pen and hold | Shape recognition | U3 line/circle subset with explicit editing described below. G02 adds arc, polyline, ellipse, triangle and quadrilateral recognition. |
| Second finger during held shape | Perfect-form/rotation modifier | U3 line angle increments and circle modifier; G02 full shape constraints. An intentional modifier is not an Undo/navigation chord. |
| Three-finger scrub | Clear active editable layer | G02; destructive command, one undo, distinct scrub classifier and lock guards. Never fire from a clipboard swipe or pinch. |
| Layer-panel pinch/taps/swipes | Merge, multi-select, opacity, alpha lock and content selection | Later layer/mask checkpoint. Canvas gestures must not leak into the panel; merge changes editable data. U1 implements single-layer reorder and swipe actions only. |
| Fine slider drag / accessible single-touch navigation | Precision modifiers and single-touch alternatives | U1 retains numeric/button alternatives; G02 defines lateral fine adjustment and optional navigation companion. These must not start paint or history chords. |
| QuickMenu invocation | Customizable radial commands | Later productivity checkpoint. Tool popovers are not a radial menu. |
| Pencil side tap/squeeze/hover/roll | Device-specific tool modifiers | Capability-dependent; no Surface/Xiaomi/iPad promise without actual browser/device evidence. |

Pen-first remains the default: fingers navigate or invoke controls, with finger paint reserved for a future functional Smudge tool as requested. Choosing Procreate gestures does not override that preference. Visible Undo/Redo and browser-safe transform buttons remain available. UNRULY retains its existing 100-entry/16 MiB history bound; native history limits are not copied as a performance promise.

## U3 interaction contract corrections

One owner at a time: live pen, touch navigation, history chord, picker drag, lasso draft, held-shape draft, transform preview or layer reorder. Chords are admitted only on the canvas, with no active pen, navigation, lasso draft, handle drag or property drag. Idle released shape/transform previews route history to their local edit history as specified below; they never route to document history. Contacts must arrive within 120 ms, remain within 8 CSS pixels of their starting positions, and all release within 250 ms of first contact for a single tap. A qualifying three-contact chord never produces an earlier two-contact Undo. Movement converts to navigation and permanently invalidates that chord’s history eligibility. Fourth contact cancels history admission. These timings are our initial testable engineering defaults, not claimed native thresholds.

Unexpected lost capture while a contact is active cancels its operation. Expected pointerup→lostpointercapture ordering preserves an already completed chord; it cannot double-fire. Blur, pointercancel, board/tool/mode transitions reset recognizers. No dormant double-tap preference is implemented in this batch. G02 must define held/repeated operations and their precedence before adding them.

Finger sampling and pen shape holding initially use 650 ms/8 CSS pixel stationary thresholds. This replaces the prior 3-pixel timer-reset proposal: a stationary anchor starts the timer; movement beyond 8 CSS pixels resets the anchor/timer until another full 650 ms stationary interval occurs. Sampling reads the final visible composite, including opacity/blends and paper, at correct view/DPR coordinates; preview colours do not enter recents until release. While the pen owns input, palm contacts cannot navigate or undo. The narrow exception is a second contact admitted as a held-shape modifier after recognition; it is never allowed to take navigation/history ownership.

**Shape recognition is not the entire QuickShape workflow.** U3 recognizes line and circle only, retaining the bounded 1,024-point recognition input and two-/129-point outputs. Unsupported/ambiguous traces remain original strokes. Once recognized, continued pen drag scales/rotates the draft rather than restoring the raw stroke. Line rotation with an admitted second finger snaps to 15-degree increments; circle rotation has no visual effect. Brush style and mean reported pressure (or null when absent) remain unchanged.

On release, show an Edit Shape affordance. Editing uses two endpoints for a line, or centre/radius handles for a circle. Geometry remains a transient draft until Apply/Enter, an outside-dismissal tap, or starting the next stroke commits it; Cancel/Escape restores the pre-stroke board. The outside-dismissal tap is consumed without a mark. Starting a new stroke commits the shape first and then begins a distinct stroke transaction. Board/update/navigation requests prompt Apply/Cancel before transition, never save provisional points. Recognition and all editing commit as **one** document Undo entry, not recognition-plus-edit entries. This preserves a bounded model without rewriting already-persisted history. G02 expands recognition/edit choices; do not claim native full-shape parity after U3.

Lasso selects whole strokes in the active editable layer; it is not a feathered pixel selection. Transform provides move, uniform scale and rotation with explicit Apply/Cancel, numeric alternatives, unchanged brush width and one committed history entry. T and the button remain browser-safe; add V as the reference shortcut when not typing. Ctrl+T can remain best-effort but must never be the only route. During a transform, Undo/Redo target bounded draft edits; document history is untouched until Apply. Escape cancels. Save/board/update commands require Apply/Cancel. Freeform, warp, distortion, pixel interpolation and cross-layer selection are later capabilities.

### Draft history ownership

| State | Buttons/keyboard/touch Undo–Redo | Commit boundary |
|---|---|---|
| Live pen, lasso draft, navigation, picker or active handle/property drag | Suppressed; no document history changes. The deliberate held-shape modifier is the only added pen/touch exception. | Complete or cancel the owning interaction first. |
| Released shape preview / idle transform preview | All three routes target local edit history. No local Undo/Redo entry means a visible no-op; never fall through to document history. | Apply/Enter produces one document transaction; Escape/Cancel discards the whole draft. |
| Committed lasso selection or ordinary idle canvas | Document Undo/Redo; selection remains session state and is sanitized after document changes. | Existing document transaction rules. |

Each completed handle drag or committed numeric field change records one local edit; cancelled/no-op edits record none. New edits invalidate local Redo. The initial recognized/selected geometry is the local origin, not an editable document-history entry. Cancel leaves no local Redo. Combined retained document and draft history stays within 100 entries/16 MiB: admission checks available capacity before accepting a new local step, with a visible rejection if insufficient; never silently evict document history for a preview. Draft geometry also obeys point/document limits. Autosave/export cannot see draft snapshots. This is the authoritative routing decision; the actual U3 handoff still must bind transitions and tests to inspected source.

## Layer and colour corrections

U1 adopts an explicit protective lock: block paint/erase/smudge, content moves/transforms, cut/paste into the layer, clear and deletion. Unlock is always reachable. Layer-stack reorder, visibility and viewing controls remain allowed; changing opacity/blend is blocked until unlock. Copy and duplication are non-destructive and allowed; the duplicate receives new IDs and is unlocked. The handbook’s “move” protection concerns artwork changes; this policy does not claim undocumented native layer-stack parity. Lock, alpha lock, grayscale mask and clipping mask are four separate concepts.

U1 includes true single-layer duplication already added by the PDF amendment; older report language deferring all duplicates is historical. Preserve style/pressure, validate capacity before allocating IDs, and commit one Undo. Multi-layer groups and cross-board drag are later. Eight browser Canvas2D/sRGB modes remain the bounded first subset; matching native mode names does not prove native profile/pixel parity, and 5.4’s legacy Shade migration must not silently rename serialized UNRULY modes.

U2 keeps the twelve immutable original presets and work/pressure budgets in DUX1. HB/2B/6B need visibly different coverage, grain and pressure response at equal settings, not just different labels. Stabilization, taper, pressure mapping, tilt and held-shape correction are separate stages. Brush Studio’s fourteen attribute groups were fully reviewed; a full native Brush Studio is not implied by twelve presets. Tilt/azimuth/roll need future schema and device proofs. Hue is retained at grey/black; HSV brightness is not mislabeled HSL lightness. Picker views synchronize within one RGB-unit rounding tolerance.

## Engine dependencies and first-release roadmap

| Requested capability | Required design boundary after the immediate UX batch |
|---|---|
| Smudge, watercolor, richer texture brushes | Hybrid raster tiles, sampling/coverage, bounded tile history, original texture tip/grain assets, raw/stabilized input and deterministic recipe versions. Vector translucency is not pigment mixing. |
| Alpha lock, layer/clipping masks | Explicit mask/base relationship IDs, alpha/compositing rules, reorder/delete/transform/export behavior. Do not encode attachment solely by adjacency. |
| Paint bucket with gap tolerance | Raster connected-region fill, tolerance plus independently defined gap closing/reference layer, preview/cancel and one transaction. Procreate colour threshold alone does not supply Clip Studio-style gap closing. |
| Gaussian blur and HSL adjustments | Tile halo/edge handling, alpha preservation, preview/apply/cancel and history. Selecting a brush colour is not adjusting existing artwork. |
| Text/fonts and reference-image box | Editable object schema, measurement/font portability, bounded image ingestion, movable reference UI and explicit export/recording inclusion. |
| Canvas size, DPI, PNG/JPG/PDF and layered exchange | Finite artwork/export frame independent of infinite navigation; dimensions/resampling/profile/alpha/fidelity rules. Investigate layered PSD exchange; proprietary Procreate/Clip Studio format conversion is not proven. |
| Timelapse and movement trace | Bounded durable process replay and selected-object motion respectively; separate from layer-frame animation or screen recording. |
| Google Drive sync and BYOK summaries/diagrams | Explicit optional authenticated sync with conflict recovery; direct provider key handling/capability/CORS constraints; provider calls remain user-controlled. Offline local drawing stays usable. |
| Procreate brush import | Native workflow reviewed, but no published proprietary brush schema discovered in the handbook. Compatibility investigation and asset rights are prerequisites; no lossless import promise. |

Frame animation, Page Assist/multi-page PDF editing and 3D/material painting were fully reviewed and remain outside the requested immediate whiteboard scope. These do not displace the user’s existing first-release requirements.

## Checkpoint sequence and gates

1. **U1 — compact reference UI and layers:** reference toolbar/popovers, independently collapsible controls, add-above-active, ordering, protective lock/duplicate, opacity/eight modes, paper row and safe v3 migration. Independently runnable candidate, reviewed before U2.
2. **U2 — original brush library and colour:** twelve genuine presets, category/previews, size/opacity, primary hue disc and secondary shade/value controls. Preserve legacy pixels and the P01 rendering budget.
3. **U3 — dependable core gestures and geometry:** SINGLE Undo/Redo, touch arbitration, sampling, editable held line/circle, discoverable lasso and uniform move/scale/rotate. One combined tested publication and one tablet test card for U1–U3.
4. **G02 — remaining reference gestures/shape coverage:** held history, view rotation/fit, clipboard/fullscreen/scrub and expanded shape recognition/editing. Create its concrete contracts, independent QA handoff and bounded budget before implementation; this research does not authorize an extra repair allowance or fold unbounded work into U3.
5. **Painting and sharing checkpoints:** preserve the roadmap dependencies above, with another batched feel review when true Smudge/fill/blur are available.

Read-only legacy v1/v2 stores, atomic resumable v3 migration, stable IDs, recovery-v3 rollback, existing document/history/storage ceilings, five backing canvases/80 MiB nominal RGBA, retained top-layer performance and frozen legacy pixel fixtures remain mandatory. No per-layer or picker canvas may defeat that budget; thumbnails use bounded existing scratch only. Existing two-repair/three-CI allowances per U1/U2/U3 remain, including final combined regression within U3; none are reset by this review. G02 is planned, not a fourth consumed or authorized allowance.

The reference decision is settled. Before source, the independent Gatekeeper must assess the concrete U1 handoff and these corrections against its current test/rollback contracts. QA owns adversarial test design and actual execution. No application, test, worker, workflow or live Pages change occurred in this research continuation; current live v0.3.0/P01 remains unchanged. Full product/main/production authorization remains false. Ordinary technical details are architect-owned, not a new questionnaire for the user.


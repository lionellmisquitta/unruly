# Handbook interaction review

Planning review dated 2026-10-06. All 40 complete article texts in the five assigned sections were read, including subsection prose, notes and tips. This is independent interaction and acceptance analysis using the Quality Engineering Adversary role. No application changes, executable tests or QA runs were performed for this review.

The user chose two-finger SINGLE tap undo and three-finger SINGLE tap redo as the default. Earlier DOUBLE-default planning is superseded; any optional DOUBLE preference needs its own explicit contract. Pen-first input with finger navigation remains compatible with the reference. Pencil hardware features and iPad system integrations are capability-dependent and are not browser support claims.

Each source-coverage paragraph below is an original paraphrase below 80 words. It covers every functional heading and its prose, including subordinate headings; repeated advisory headings are represented by their actual topics rather than copied boilerplate. Engineering gap/risk paragraphs are our own analysis. The audit table records the ordered functional heading count/hash (from the first article h1, excluding clipboard-error chrome) and actual text hash. Raw source is not included in this repository report.

Actual source inspection: `app.js` touch movement currently pans/zooms, touches do not paint, pen moves retain coalesced points, and history keyboard handling uses Ctrl/Cmd+Z. Lasso and move operate on stroke IDs in the active layer; page clipboard is geometry. `model.js` validates version 2 with ink/pencil/marker/airbrush. These are current behaviour; v3 migration, brush presets, shape holding and extended transform are planned changes.

## Interface and gestures

### interface-gestures

[Source article](https://help.procreate.com/procreate/handbook/interface-gestures).

**Source behaviour and subsection coverage:** Overview covers workspace, touch, accessibility, Pencil, keyboard, clipboard, radial commands and widgets.

**UNRULY gap and acceptance risk:** This is a navigation page, not a commitment to implement every linked capability. Acceptance must distinguish current, approved batch and deferred functionality.

### interface-gestures / interface

[Source article](https://help.procreate.com/procreate/handbook/interface-gestures/interface).

**Source behaviour and subsection coverage:** Coverage: painting, smudging, erasing, layers, colour; size, modifier, opacity and history sidebar; gallery, actions, adjustments, selection and transform; theme, handedness, sidebar positioning, cursor, chrome hiding and external projection. Fine sliders combine sideways and vertical movement; held history repeats.

**UNRULY gap and acceptance risk:** Current compact controls omit several tools. Test independent collapsible sections, selected-layer identity, responsive reachability and labelled numerical alternatives. In-app chrome hiding and browser fullscreen need distinct states; projection is outside this batch.

### interface-gestures / gestures

[Source article](https://help.procreate.com/procreate/handbook/interface-gestures/gestures).

**Source behaviour and subsection coverage:** Coverage: finger painting; pinch zoom, rotation and fit restoration; two/three-finger single-tap history; scrub clear, clipboard swipe, fullscreen; held shapes and precision sliders. Accessible single-touch history, zoom, rotation, movement and fit disable drawing while navigating. Hover adjusts size/opacity. Layer gestures merge, distinguish primary/secondary selection, adjust opacity, lock alpha and select content. Configurable mappings warn about conflicts.

**UNRULY gap and acceptance risk:** SINGLE is the chosen default. Specify chord admission, movement/time tolerances, pen ownership and suppression before any pan or history action. Canvas and layer-panel chords must not share an unqualified handler. Finger painting remains optional; a pen-first navigation setting is consistent with the reference.

### interface-gestures / accessibility

[Source article](https://help.procreate.com/procreate/handbook/interface-gestures/accessibility).

**Source behaviour and subsection coverage:** Coverage: accessibility entry points, single-touch navigation, screen-reader limitations, larger text, colour cards/descriptions, sound and tremor-friendly initial touch handling. Stabilization has global and brush settings; motion filtering separates amount from expression, and tip attachment changes starting-point behaviour. Tips and capability notes qualify these features.

**UNRULY gap and acceptance risk:** Require semantic buttons, readable focus, zoom-safe layout, non-colour state cues and alternatives to multi-touch or drag. Browser screen-reader operation is not proven by iPad guidance. Stabilization changes stroke pixels and cannot silently alter normal-brush baseline.

### interface-gestures / pencil

[Source article](https://help.procreate.com/procreate/handbook/interface-gestures/pencil).

**Source behaviour and subsection coverage:** Coverage: connection, pressure/tilt properties, configurable side double-tap, app pressure curve, handwriting input, hover, squeeze and barrel roll. Several inputs require particular Pencil/iPad generations; system and app mappings interact.

**UNRULY gap and acceptance risk:** Use reported PointerEvent capabilities only. Pen pressure/coalesced samples, cancellation and mouse fallback remain regression requirements. Side taps, squeeze, hover distance and barrel roll need explicit feature detection and device evidence before availability claims.

### interface-gestures / keyboard

[Source article](https://help.procreate.com/procreate/handbook/interface-gestures/keyboard).

**Source behaviour and subsection coverage:** Coverage: keyboard connection; application, file, edit, tools, transform, view and window commands; shortcut discovery through windowed menus and menu invocation. Platform/version notes and an unavailable file command qualify the list. Tools use S for selection and V for transform; arrows nudge transformed content.

**UNRULY gap and acceptance risk:** Ctrl+T commonly belongs to the browser. Provide a reachable transform button and an explicit alternate binding; do not promise universal interception. Scope shortcuts away from editable fields/dialogs and preserve browser navigation. Document differences from S/V and Space radial-menu conventions.

### interface-gestures / copypaste

[Source article](https://help.procreate.com/procreate/handbook/interface-gestures/copypaste).

**Source behaviour and subsection coverage:** Coverage: menu invocation and cut, active-layer copy, visible-composite copy, duplicate, cut into a new layer and paste. Clipboard integration extends across compatible applications.

**UNRULY gap and acceptance risk:** Current page-session clipboard stores stroke geometry. State that boundary in UI. Test active-layer isolation, immutable copied data, new IDs on paste, empty/locked destinations and cancellation; raster/system clipboard interoperability is a separate capability.

### interface-gestures / quickmenu

[Source article](https://help.procreate.com/procreate/handbook/interface-gestures/quickmenu).

**Source behaviour and subsection coverage:** Coverage: enabling, invocation, persistent tap menu, directional release actions, six customizable commands and named profiles. Defaults include layer creation, flips, copy, merge and clearing.

**UNRULY gap and acceptance risk:** A compact toolbar is not a customizable radial menu. If deferred, record it plainly. If introduced, test cancelled release, disabled contextual actions, focus restoration, profile persistence and conflicts with single-finger navigation or Pencil mappings.

### interface-gestures / widgets

[Source article](https://help.procreate.com/procreate/handbook/interface-gestures/widgets).

**Source behaviour and subsection coverage:** Coverage: a supported iPad home-screen widget opens recent artwork directly.

**UNRULY gap and acceptance risk:** Current browser recent-board recovery is not an OS widget. Keep installability, widget support and page restoration separate; reopening must identify the board actually recovered.

## Colours

### colors

[Source article](https://help.procreate.com/procreate/handbook/colors).

**Source behaviour and subsection coverage:** Overview covers shared colour controls, disc, classic field, harmony, values, palettes and colour profiles.

**UNRULY gap and acceptance risk:** Different picker views must share one committed colour state. The batch need not implement every reference view.

### colors / colors-interface

[Source article](https://help.procreate.com/procreate/handbook/colors/colors-interface).

**Source behaviour and subsection coverage:** Coverage: primary/secondary colours, comparison reticle, ten-entry artwork history, active palette, compact history/palette toggles and detachable companion. Previous-colour switching, bounded fill thresholds, continued filling, hover fill, swatch fill and recolouring precede eyedropper methods. Sampling can switch between composite and active layer; modifier tap/hold and configurable invocation support different grips.

**UNRULY gap and acceptance risk:** Current HSL and eight swatches differ from artwork history. Decide committed-selection timing, artwork scope and persistence. Preview/cancel must not pollute history. Sample final blended appearance versus raw active layer explicitly. Raster flood fill, recolour and detached windows are outside the approved geometry scope unless separately chosen.

### colors / colors-disc

[Source article](https://help.procreate.com/procreate/handbook/colors/colors-disc).

**Source behaviour and subsection coverage:** Coverage: hue ring, saturation/brightness field, primary/secondary state, precision control, inner-disc enlargement and snapping to canonical tones; tips explain fine adjustment.

**UNRULY gap and acceptance risk:** HSL lightness is not HSB brightness. Label the actual model and verify endpoint colours, pointer capture, hue wrap and keyboard steps. Use DOM/SVG rather than adding a raster backing surface.

### colors / colors-classic

[Source article](https://help.procreate.com/procreate/handbook/colors/colors-classic).

**Source behaviour and subsection coverage:** Coverage: choosing colour with a square saturation/brightness field, hue/saturation/brightness sliders and finishing/dismissing the panel.

**UNRULY gap and acceptance risk:** A future classic view must synchronize with disc, hex and shades without changing the committed value when merely opened or closed.

### colors / colors-harmony

[Source article](https://help.procreate.com/procreate/handbook/colors/colors-harmony).

**Source behaviour and subsection coverage:** Coverage: hue/saturation wheel, brightness slider, multiple reticles and selecting/dismissing colours. Modes include opposite, split-opposite, neighbouring, three-way and four-way arrangements.

**UNRULY gap and acceptance risk:** Derived shade suggestions are not all harmony schemes. Test hue wrap, selected reticle identity and deterministic palette generation; do not claim five modes if only shades are built.

### colors / colors-value

[Source article](https://help.procreate.com/procreate/handbook/colors/colors-value).

**Source behaviour and subsection coverage:** Coverage: numerical hue/saturation/brightness, RGB channels, hexadecimal values, input tips and completion. Fields represent one synchronized colour.

**UNRULY gap and acceptance risk:** Hex validation and HSL controls already exist; adding RGB/HSB introduces conversion and rounding risk. Test invalid/partial entries, reversible updates, focus behaviour and keyboard-only selection.

### colors / colors-palettes

[Source article](https://help.procreate.com/procreate/handbook/colors/colors-palettes).

**Source behaviour and subsection coverage:** Coverage: compact swatches and named cards; create, finish, select, fill, reorder, replace and delete swatches. Library operations create, activate, share, duplicate, reorder and delete palettes. Capture supports camera visual/indexed modes, files and photos; importing/exporting supports native and Adobe formats and drag sharing. Tips qualify layouts and destructive actions.

**UNRULY gap and acceptance risk:** Palette library, current colour and per-artwork history are separate state lifetimes. Current fixed swatches and planned shades do not supply camera/import parity. Require named controls, deletion confirmation where chosen, selected identity after reorder and no accidental active-colour change on library navigation.

### colors / colors-profiles

[Source article](https://help.procreate.com/procreate/handbook/colors/colors-profiles).

**Source behaviour and subsection coverage:** Coverage: accessing preset profiles, RGB versus CMYK, importing profiles and changing profiles within the compatible colour family; tips warn about colour changes.

**UNRULY gap and acceptance risk:** Browser rendering must not imply print-grade CMYK or managed wide-gamut equivalence. Keep current canvas colour assumptions explicit; profiles are deferred unless separately contracted.

## Selections

### selections

[Source article](https://help.procreate.com/procreate/handbook/selections).

**Source behaviour and subsection coverage:** Overview covers interaction, automatic regions, freehand paths, rectangular/elliptical masks, advanced reuse and visibility settings.

**UNRULY gap and acceptance risk:** Current whole-stroke selection differs fundamentally from raster masks. Describe that difference before comparing interface affordances.

### selections / selections-interface

[Source article](https://help.procreate.com/procreate/handbook/selections/selections-interface).

**Source behaviour and subsection coverage:** Coverage: drafting, selection-local history, commit, edit and cancel; mode buttons; adding, removing, inverting, copying, feathering, saving/loading, filling and clearing. An active selection constrains subsequent tools; outside shading indicates exclusion. Tips qualify mixed modes and filling.

**UNRULY gap and acceptance risk:** Choose whether SINGLE history targets a draft, pending transform or document history. A whole-stroke bounding overlay must not imply feathered pixel masking. Cancel and undo need distinct outcomes; clearing selection must not delete strokes.

### selections / selections-freehand

[Source article](https://help.procreate.com/procreate/handbook/selections/selections-freehand).

**Source behaviour and subsection coverage:** Coverage: fluid and polygonal creation, mixed paths, navigation during drafting, closing/committing for editing and cancellation.

**UNRULY gap and acceptance risk:** Current lasso commits on release. Multi-contact navigation during drafting would need frozen document coordinates and explicit resume semantics; preserve prior selection on cancellation or point-limit failure.

### selections / selections-automatic

[Source article](https://help.procreate.com/procreate/handbook/selections/selections-automatic).

**Source behaviour and subsection coverage:** Coverage: connected-region creation, threshold adjustment, adding regions, mixed-mode editing, commit and cancel; tips describe selection feedback.

**UNRULY gap and acceptance risk:** Colour-threshold regions cannot be represented by whole-stroke IDs without a changed model. Defer automatic raster selection; never substitute all strokes of a similar colour without user-facing semantics.

### selections / selections-shape

[Source article](https://help.procreate.com/procreate/handbook/selections/selections-shape).

**Source behaviour and subsection coverage:** Coverage: rectangular and elliptical creation, composing selections, committing into editing and cancelling.

**UNRULY gap and acceptance risk:** A shape may select intersecting whole strokes rather than pixels. State inclusion rules, boundary tolerance and active-layer scope; test empty and degenerate bounds.

### selections / selections-advanced

[Source article](https://help.procreate.com/procreate/handbook/selections/selections-advanced).

**Source behaviour and subsection coverage:** Coverage: reloading the previous selection, saving/loading selection slots and selecting layer contents while respecting transparency; tips give an alternate gesture.

**UNRULY gap and acceptance risk:** Current selection is session state. If reuse is added, prevent stale IDs after deletion/import/board switch and define whether hidden or transparent strokes count. Do not persist masks through incompatible schema paths.

### selections / selections-settings

[Source article](https://help.procreate.com/procreate/handbook/selections/selections-settings).

**Source behaviour and subsection coverage:** Coverage: changing the visible exclusion overlay without altering selection membership.

**UNRULY gap and acceptance risk:** Opacity of selection feedback must not change artwork, selected-layer opacity or exported pixels. Provide an accessible membership indicator independent of shading.

## Transform

### transform

[Source article](https://help.procreate.com/procreate/handbook/transform).

**Source behaviour and subsection coverage:** Overview covers interaction, unconstrained/uniform transforms, perspective distortion, mesh deformation, snapping and pixel resampling.

**UNRULY gap and acceptance risk:** Approved geometry-only move/scale/rotate is narrower. Do not imply deforming raster content or mesh editing.

### transform / transform-interface-gestures

[Source article](https://help.procreate.com/procreate/handbook/transform/transform-interface-gestures).

**Source behaviour and subsection coverage:** Coverage: layer-content selection, bounding box, resize/orientation handles, scale/angle readouts, snapping, transform modes, flip, fixed rotation, fit, interpolation, reset and local history. Numeric linked/unlinked sizing and rotation supplement gestures. Inside/outside pinches target content/view; a modifier reverses that rule. Nudge and explicit commit finish the workflow. Tips distinguish simplified history and platform capabilities.

**UNRULY gap and acceptance risk:** Separate view navigation from geometry edits. Pending transform must own its controls and gate save until commit/cancel. Test layer snapshot, centre/opposite-handle pivots, 0.05–20 scale limits, Escape rollback and one committed history step. Numeric controls offer an accessible alternative; Ctrl+T needs browser-safe fallback.

### transform / transform-freeform

[Source article](https://help.procreate.com/procreate/handbook/transform/transform-freeform).

**Source behaviour and subsection coverage:** Coverage: movement and directional nudge, snapping/magnetics, non-uniform resizing, uniform shortcut and centre-anchored pinch scaling.

**UNRULY gap and acceptance risk:** The batch uniform geometry scale must not be labelled freeform. Explicitly choose pivot and aspect policy; crossing handles or singular bounds must not generate invalid coordinates.

### transform / transform-uniform

[Source article](https://help.procreate.com/procreate/handbook/transform/transform-uniform).

**Source behaviour and subsection coverage:** Coverage: movement, snapping, proportional transformation; pinching anchors at the centre, while handles anchor opposite their position.

**UNRULY gap and acceptance risk:** Geometry-only scaling preserves relative points but leaves brush size unchanged under the agreed scope. Communicate that rule and test it independently from view zoom.

### transform / transform-distort

[Source article](https://help.procreate.com/procreate/handbook/transform/transform-distort).

**Source behaviour and subsection coverage:** Coverage: moving/nudging, corner-based perspective distortion, temporary held-corner distortion and side-handle shear, optionally axis constrained.

**UNRULY gap and acceptance risk:** Affine move/scale/rotate does not supply projective distortion or shear. Keep these excluded and prevent a hold on a resize handle from unexpectedly invoking line/circle recognition.

### transform / transform-warp

[Source article](https://help.procreate.com/procreate/handbook/transform/transform-warp).

**Source behaviour and subsection coverage:** Coverage: mesh dragging/folding, node front/middle/back overlap control and a denser editable mesh.

**UNRULY gap and acceptance risk:** Mesh deformation is absent from the stroke model and renderer. Avoid decorative controls that suggest support; future work needs topology and replay-limit design.

### transform / snapping

[Source article](https://help.procreate.com/procreate/handbook/transform/snapping).

**Source behaviour and subsection coverage:** Coverage: alignment feedback against objects and canvas; distance and velocity thresholds; separate axis magnetics and second-finger axis locking.

**UNRULY gap and acceptance risk:** If snapping is deferred, do not claim it from rounded numeric fields. A future algorithm must define document versus screen pixels, visible-layer eligibility, hysteresis and pointer-speed measurement.

### transform / transform-interpolate

[Source article](https://help.procreate.com/procreate/handbook/transform/transform-interpolate).

**Source behaviour and subsection coverage:** Coverage: resampling during transforms, cumulative degradation and nearest, bilinear and bicubic trade-offs; tips explain repeated edits and mode labels.

**UNRULY gap and acceptance risk:** The source conflicts: this page says Bilinear default, while Transform Interface says Nearest. No default is adopted. Geometry replay avoids repeated raster resampling; confirm normal brush pixel fidelity with frozen baseline rather than copying this raster setting.

## Guides and shape holding

### guides

[Source article](https://help.procreate.com/procreate/handbook/guides).

**Source behaviour and subsection coverage:** Overview covers guide creation, orthogonal/isometric/perspective/symmetry guides, assisted drawing and held-shape recognition.

**UNRULY gap and acceptance risk:** Paper decoration, visible guides and geometry constraints require separate states; current paper settings are not drawing assistance.

### guides / guide-create

[Source article](https://help.procreate.com/procreate/handbook/guides/guide-create).

**Source behaviour and subsection coverage:** Coverage: activation and remembered defaults; editor layout; cancel/done, guide colour, mode, opacity, thickness, spacing and assistance toggle; guide choice and appearance changes.

**UNRULY gap and acceptance risk:** If deferred, retain current paper controls without assistance claims. Future guide previews must cancel transactionally and preserve per-board settings without altering paper pixels unintentionally.

### guides / guides-2D

[Source article](https://help.procreate.com/procreate/handbook/guides/guides-2D).

**Source behaviour and subsection coverage:** Coverage: customization, positional/rotational handles and resets, appearance and cancel/commit.

**UNRULY gap and acceptance risk:** A paper grid is not a movable guide. Verify overlay versus export policy and screen/document coordinate conversion before adding it.

### guides / guides-isometric

[Source article](https://help.procreate.com/procreate/handbook/guides/guides-isometric).

**Source behaviour and subsection coverage:** Coverage: triangular guide customization, position/rotation and reset, visual settings and cancel/commit.

**UNRULY gap and acceptance risk:** Technical guide constraints need an independent geometry contract. Keep them deferred from the line/circle hold batch.

### guides / guides-perspective

[Source article](https://help.procreate.com/procreate/handbook/guides/guides-perspective).

**Source behaviour and subsection coverage:** Coverage: positioning/rotation, adding and removing vanishing points; one-, two- and three-point configurations; colour, thickness, opacity, assistance and cancel/commit.

**UNRULY gap and acceptance risk:** No perspective constraint exists in current model. Future point editing must handle coincident or off-canvas points and preserve recoverable guide state.

### guides / guides-symmetry

[Source article](https://help.procreate.com/procreate/handbook/guides/guides-symmetry).

**Source behaviour and subsection coverage:** Coverage: position/rotation handles; vertical, horizontal, quadrant and radial configurations; mirrored versus rotational repetition; colour, opacity, thickness and assistance; cancel/done.

**UNRULY gap and acceptance risk:** Replicated strokes affect history, IDs, point limits and renderer cache validity. Do not infer symmetry support from a symmetric-looking paper pattern.

### guides / guides-drawing-assist

[Source article](https://help.procreate.com/procreate/handbook/guides/guides-drawing-assist).

**Source behaviour and subsection coverage:** Coverage: activating assistance in guide or layer controls, per-layer labelling, freehand constrained drawing and settings; tips describe activation.

**UNRULY gap and acceptance risk:** Assist must belong to the intended layer, not an unrelated selected panel row. Structural toggles during active pen/reorder remain gated; visibility and lock changes cannot redirect an in-flight stroke.

### guides / quickshape

[Source article](https://help.procreate.com/procreate/handbook/guides/quickshape).

**Source behaviour and subsection coverage:** Coverage: draw-and-hold recognition, perfect-form modifier, held scale/rotation and stepped rotation. Release opens shape editing with options and control nodes; transformations precede explicit canvas commit. Custom settings change invocation.

**UNRULY gap and acceptance risk:** Approved line/circle recognition is a subset of line/arc/polyline/ellipse/polygon support. Add an explicit edit-state decision before any parity claim. Test hold eligibility, jitter thresholds, second-finger precedence, continued drawing, cancel and one history transaction; normal brush pixels must remain unchanged.

## Cross-page acceptance priorities

1. Establish one interaction owner: live pen, canvas navigation, history chord, selection draft, pending transform, layer reorder or picker drag. Admit SINGLE history chords only within contracted timing/movement thresholds; a pan, pinch, extra contact, unexpected capture loss, blur or cancellation must never also undo. Expected capture loss after completed pointerup must not invalidate a completed gesture. Verify browser-generated captured-touch event ordering later, not just synthetic callbacks.
2. Keep shared state explicit: active layer receives drawing; selected row controls its opacity/blend; hidden/locked layers remain identifiable. Colour preview, committed colour, history, palette and board-scoped settings have distinct lifetimes. Layer reordering must not redirect an active pen or leave stale selection references.
3. Define shape recognition versus shape editing. A 650 ms hold alone does not specify edit affordances, second-finger perfect-form behaviour or post-release commit. If line/circle remains the only approved subset, explain it and test rejection of unsupported shapes.
4. Preserve keyboard and accessibility alternatives: visible undo/redo and transform buttons, numeric geometry controls, reorder buttons and labelled colour values. Browser Ctrl+T, OS gestures and hardware commands cannot be treated as reliably interceptable. Test focus, editable inputs, zoomed layout and non-colour status cues.
5. Retain P01 safeguards: frozen original normal-brush pixels at equal backing dimensions/DPR; unchanged retained top-layer fast path; explicit reference fallback for middle/hidden/zero-opacity cases; cache invalidation for board/revision/view/DPR/resize/full render/sample; five backing surfaces and 80 MiB at every allocation setter, including rotated dimensions. New overlays/pickers should use DOM/SVG where possible. These are later regression requirements, not execution claims here.
6. Retain approved storage compatibility: read-only legacy sources, stable-ID deduplication, valid previous-version recovery, explicit warning for older-foundation fallback when newer copies are invalid, and atomic v3 target/migration marker. Board switch/reload during pending interactions must not save provisional geometry. Colour history/preset metadata must not bypass validation or point/replay limits.

## Readiness recommendation

The reference review is complete for the assigned 40 pages and is usable for planning. Implementation readiness still requires a reconciled SINGLE-default gesture contract and a human-approved layout/interaction lock. Resolve the QuickShape edit-stage scope and browser-safe transform activation before acceptance is frozen. Pixel-mask selection, raster flood fill, guide assistance, mesh/projective transforms, OS widgets and hardware-only Pencil features are reference gaps, not implicit additions to the bounded batch. There is no executed-QA verdict for this review.

## Coverage audit

| Article file | Functional headings read | Ordered heading SHA-256 | Actual text SHA-256 |
|---|---:|---|---|
| colors.txt | 8 | `a637051598b6b948be9bd6b2f7972d4092769319e5c3f157dabb48c65424999c` | `0b3e6ff669b62a1d056454622e0a5e5743df88c0523a529d7b23d79c232c35a8` |
| colors__colors-classic.txt | 5 | `e2b4a596887d9bc6093f73479e12a9f12b8f743c44dbd8c08685146e25c6f93f` | `4fc506d879fd021d01a561d330fdacb8de0226d6cc2dc7edb77ef4b2ab1885b6` |
| colors__colors-disc.txt | 9 | `3bad1e57f3825ade1aa287dc69744797754c10ab4466669cc6df9998b6dd5ff9` | `e3b37e216a6e2f8fd7fe153383c177dc91292f8283907883d030013674659220` |
| colors__colors-harmony.txt | 13 | `6e96507cdeb759bbbe0e0f1bb96f19ca7c97dd1224470948b23a599eb6354e31` | `719611a872e69cacb5041a80d365ab9fa75339d83aa4494c1fc6586fcc3c05d2` |
| colors__colors-interface.txt | 35 | `97661fa0e468aba3d62fd43eae38dc10bbf5fa942d2b66d710a37dd28aa7fa0b` | `57b1b7d65e3d63891f2385a754697d7b47db022483da909eb7e5d624dd6470e2` |
| colors__colors-palettes.txt | 34 | `52cd438fa25a1f0df3f83c5515386f78d53e261d56f328478c17f0828cdb2c4e` | `ceb6720f1c386ed8546654daeb41bf22d9218aeec8eff30222f1a7d8fff6cd95` |
| colors__colors-profiles.txt | 11 | `d6e574dc12f08eda19204d66ee80051ff29c39bacdf3cb109ec05bb0fd60b90c` | `930df2496be7f7d8c25e592753880b5b5b92ac8a5cc30ba2d7767ed555b18e92` |
| colors__colors-value.txt | 8 | `6be83fb6fc337a4a1e4908bc8fc6a6fdc0c1b794577c5a6b761987f1b91c24fa` | `476506e08838648f20088a0d1c78bfad46a7325a5b175b468065b33d367b1d23` |
| guides.txt | 8 | `bda3e0fcdad0e5c7200e87b666e0a17065cf17bc233950f39aa37f08aab8a592` | `52756374375867b21769e2dedf7bf879e75d440db8c3b2078b0e1c3c0db5fed1` |
| guides__guide-create.txt | 15 | `700978954b88dfa8f764c9708ea7c856c64eb16014335356e1954a2489ff5e32` | `df4935a9a4bbe82fef8ee7357fd987b22e958c2ed5c8a331d18395efb6c786d2` |
| guides__guides-2D.txt | 5 | `4fc8c2acae5fcf028f8dd7ff1e94a480b330ef334bf56c2428d09d40dfa223ea` | `6dad708699256d4174d480dec9944274e8662b8a2327ce54d5f3935150d06273` |
| guides__guides-drawing-assist.txt | 7 | `7fc45e9ceaa30d189b21057297783be4fb401595f5e259761ef444af1cb812d2` | `3f06cb29f2541fed355412f3526f8f25c52f68a332757326935ca3d18a46d39b` |
| guides__guides-isometric.txt | 5 | `62ae2c873780ed8f6981f97db879638aea37d23af92bae0c14cc9cecd74dd439` | `680c61f5a6aa53a4fc382e13c2d05573629a4b9973545c9c799391f52a4069ff` |
| guides__guides-perspective.txt | 14 | `28f2a8c8e9291a795bf08dcc6666d5da5ddf51a29e9df3db1d6c5658015ecf70` | `39f6ef1757cbdd39576a9235deea2554344003083b356376c1b3b90dd480ee65` |
| guides__guides-symmetry.txt | 18 | `d318c186d40b1efa0cbda7f5c09c767b9807efe7fca40db9e9a3a6ff20e509df` | `20006ff6bee180f54d576bb285cac96e80b57c7484ca535d5425445f34a7e5ca` |
| guides__quickshape.txt | 13 | `2244073b6ee6398f5c87fe1a75b53efdaa17c83fda3379c0114a56b760c985b3` | `94482117f545d5a3a320b16faef258ba642d1722c00bb297477675dfbe66f60e` |
| interface-gestures.txt | 9 | `d1f812f74fd23afec5c2bee2b228f5de3ae37fab758482791e1c1a3e2ec81929` | `51183f9791a5c069b4f7dbc55d75e40ee28b7b8397543bcc425bbf00537fc350` |
| interface-gestures__accessibility.txt | 23 | `7fbcc7aadcd0231120b3b8f04632a34fd3abc5d812d7a86f369c6c768d7a1f42` | `c1183982576a2a0d1fe0b3700e577e2e761fcc7ae72b1b2c5969d2caba2b6e36` |
| interface-gestures__copypaste.txt | 9 | `f7868bffd5d6c9c3db943859227961fec15ede89c66d40686f5bc9f099577f0c` | `fa4f16697aedf083824c69f0ba04939b08da9dcbb2003649ececfbb9c4bc00a7` |
| interface-gestures__gestures.txt | 47 | `6fdb28308826c7549eb9c3a9a102edcbd318191c671c59245295fca1778f558b` | `b6ba4eb6ae538fedfa2385faaf9e500ab52b82ac04f814f8e0456b1cfb89715e` |
| interface-gestures__interface.txt | 28 | `c78ff13f1accbc43cfdd387a1c5a79b5fee7c5293094e2c2d7b2ac4060b721e4` | `327fab46c524f445fac971ce7524c8b70fb3ff9ada84072db14b6bc47fb0effa` |
| interface-gestures__keyboard.txt | 16 | `bbaa6170a2a8a6c2d282af3b4d0eb3d608b877697fcf034390614b2b968f0560` | `0ed88ec6bf8d0b3a32d53c4751578bb90b070406798bd8a645db7aea12385cac` |
| interface-gestures__pencil.txt | 12 | `51efa31d696f01abb7e736fb65b6d692be4e8d50139d88e5d3e723cd146ec1b5` | `69c4d8d284319929662fa3cb107984c7df9ec7beb74e703b2f0dfc5153f93e1d` |
| interface-gestures__quickmenu.txt | 6 | `e0c73ae34c885ca6987982212a77925025add680aa7f58ef15e625bab951e405` | `112936fe213314ed10df6d1ef5eba563d8fa6c3e10c7a0587710c9b329e3d7c2` |
| interface-gestures__widgets.txt | 1 | `cc8ef9f9e6bdc859af7e83db7710695b2397d812bc97547675dddfa67177f325` | `c4bcee8f17dd5e29282bb9665a2839cce7df1eb6c81e264f1c103ff538c3328d` |
| selections.txt | 7 | `60428c662f57c8738bbb9c3f93bb904b8ceaa7f62125f7781079095710297ef8` | `a7b2cc877ec6b7ee4801492e64ea57bbde486d681dc6aa69783fdafc1558e843` |
| selections__selections-advanced.txt | 7 | `0317068a1ca1e85ad0c21a8982894818775e5b44e0575b49263a7dca0431ff54` | `fb0b5947378571e4da3ca85fa606889a44cd06ba36b14781804465526b04b4e5` |
| selections__selections-automatic.txt | 7 | `b867bf3c926101bae8c1081d4389429f4e68bc521cce38d79eb8616a99ae3285` | `aae918ffe86443f58241ecb733981206ab08838c743a3312cba455305dce435e` |
| selections__selections-freehand.txt | 7 | `e440a460e0b927487ff4f3c9e73c70cde2f62ad58f72a140c888ecc4e8424615` | `edc45a74dc62cca0352f095c2307adb0295a20e92520fe34cac5716408fb3eaf` |
| selections__selections-interface.txt | 20 | `50f1a5200c47bdf7434a6ae159f90a752e3e9b2756740d4b10490f0ff5ddef5e` | `6b844eaf280affbed210a30f010d55e710b745fc073b587782d6909179c4d2a1` |
| selections__selections-settings.txt | 2 | `d2a170c50a18f7ef5a9969a4245df0c81d13c6e10316387c048624db1b4e95ea` | `5668ff79eece6c3405cc2305f076843ee6789dc6fd9211e189398a360710df16` |
| selections__selections-shape.txt | 3 | `7745252ff9c76ee63bd2080c401dc7aa71773e6ede8e81ba02b9ca5104293848` | `d54f422b8bc4da97497bdc1fcdb9b56885566f240ee34ca1d17a974d9f87440a` |
| transform.txt | 8 | `d6d0b30766b0ffd8bdcaf16638b31f2f235b3dd369663bdc1d8495531a70cc74` | `5a8eef0a66bd06c823c1efc503fe2a38845a7baca2f59dec5927980c15ec9aec` |
| transform__snapping.txt | 7 | `9ec9481af6be47b76ec88bf4e6a86e6fc8cdd1e914ebdbee94d4690171d5299c` | `fe77fb05e4462cf5936407839ad17152ab7baf39f5159cad9f9f41f9d7ab2f49` |
| transform__transform-distort.txt | 6 | `f789429cc6ecd372bad35654fba5a40ee4bcf6d913457707f08b1c12e6c68b2a` | `e48f22c875fbc45864371f2b3bf0e849f51c6a0393b523adfd2a636e4644224e` |
| transform__transform-freeform.txt | 7 | `ab0b997bd3332127872e76149d819985a29ea93a9bc1f2a0cd38dd1ae8e12e49` | `e0d161d1d145dc0f7725e36a39815b90008251a007d7bc175ffb3d4ebdc412e6` |
| transform__transform-interface-gestures.txt | 28 | `f155d83fd8bfcd518ab9a241366e157c8d2b9951dadc4e77dce34774726b63f4` | `ca6a0c2fb70534039dcba3e0d6f95a61ff52b0592f77ed5b287fcf56f1569331` |
| transform__transform-interpolate.txt | 8 | `1753bb84d72e2dfd49467feaf9f3aacf630701f5e1ea2c89f70a0de3266db944` | `d07c36783327e5c2715bc651ceee1e62780486ae80805912a728acd2263e6fe4` |
| transform__transform-uniform.txt | 6 | `bf51d0b4cfe742d9c704cb97f66d8e386703f5376e86e1740ba12e032e521854` | `6dde701f47f5165838549adbea0a414077a1ce55c6567bc17d7e8c3602c1ce7c` |
| transform__transform-warp.txt | 4 | `e3db0e23b86a12451dd18a9625b5d0604bd8218f87e700bc7c9a9ba0258b168a` | `7dc8505d7b942f62caa1880e27001a1a8668450374837beb7658400612a4c0a9` |

Retrieval manifest: `procreate-reference/handbook/retrieval-manifest.json`; source HTML digests remain recorded there. The article text digests above bind this review to the local bodies actually read. Every assigned article returned a successful retrieval status in the manifest.

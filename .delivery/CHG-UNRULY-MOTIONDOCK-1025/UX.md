# Motion Trace and quick colours — 25 October 2026

User asks for understandable camera motion including destinations outside the screen, and dock/undock of floating colours. Base e20961b. Evidence sufficient for bounded implementation; browser/device validation outstanding.

UXD-1: Spatial canvas with compact framing controls: choose Camera, Frame start, navigate, Use this view; Frame end, navigate, Use this view; Preview and Save. Pan by pen/mouse/finger drag, pinch or wheel to zoom, explicit zoom and arrow-key controls. Capture mode hides inspector to maximize canvas. Done captures actual visible frame. Cancel/Escape restores draft and original view; close restores original canvas without artwork edits. Start and end are independent persisted frames. Existing camera target numeric controls remain as advanced controls. Reject numeric-only or off-screen handle dragging as the primary task.

UXD-2: Artwork movement retains freehand paths, plus Place end using navigable canvas centre for off-screen endpoints. Captured selection is explained; camera without selection is explicit. Existing saved sequence, manual/timed playback, pause, restore and explicit commit are retained.

UXD-3: Floating colours defaults to current behavior. Dock into colour wheel hides floating panel and exposes Undock colours in Colour inspector. Device-local preference persists; storage failure retains session choice with feedback. Palette data and artwork remain independent. Keyboard focus moves to Colour button on dock and floating Dock button on undock. No drag/drop required.

Impact: motion UI owns disposable navigation; camera cue gains optional strict start frame using motion envelope version 2. Existing v1 data/semantics preserved, unknown start fields rejected in v1. No native model/history/storage/render engine edits. motion.js validation/compile callers include model admission, import/remap, region preparation and playback. Existing imports preserve camera fields. palettes-ui.js consumes U2 colour and history observers; only UI preference changes.

Scope excludes other pending eraser/full-window-pose/selection PRs. No roadmap, graph or existing QA records changed. Same-session checks do not establish independent review or physical Surface acceptance.

Baseline locked for implementation following the concrete user-facing preview; task authorization covers reversible implementation. Reopen if actual framing cannot be represented without changing playback contracts.

Scope revision: service-worker identity changes to v10-20261025-motiondock-1 for safe update delivery. Existing offline tests change only matching cache literals; assertions and cumulative invocations retained. Existing final screenshot restore is asynchronous, so new restore assertions wait for actual exact pixels rather than reading before the queued animation frame.

Verification finding: narrow-screen footer status wrapped during Stop, changing canvas from 390×717 to 390×707. Motion-only footer no-wrap/ellipsis keeps the viewport stable; exact pixel restore assertion retained. Main camera/path controls moved ahead of name/duration to avoid novice actions being buried.

# UX review — Offline Drawing Whiteboard

Status: proposed consolidated interaction baseline for review. Confirmed user decisions are identified below; recommended details are not yet a locked UX baseline. No production build authorization.

## Outcome and interaction architecture
Personal offline drawing/painting and whiteboarding across Windows and Android. Spatial canvas workspace is the dominant archetype: strokes, shapes, text, images and their arrangement are the work itself. A thumbnail gallery supports finding and resuming boards. Tool inspectors support edits without leaving the canvas. A dashboard or sequential wizard would interrupt the drawing task and is rejected.

## View inventory
1. Board gallery: create, search, rename, duplicate and reopen local boards; thumbnails and sync state.
2. Canvas: draw, paint, annotate and compose; most screen area remains available for artwork.
3. Expandable inspectors: tools/brushes, layers, colours/palettes, paper/grid/artboards. Panels may pin open or collapse; size/opacity quick controls are transient.
4. Reference companion: float/dock an image, independently zoom/pan and sample colours; reference panel is separate from imported canvas images.
5. Export/replay: select artboard or bounded region, choose export dimensions/DPI and review timelapse framing.
6. Settings/integrations: input preferences, shortcuts, local storage, optional Drive authorization and BYOK provider configuration.
7. Conflict review: identify the two versions by device/time, preview/open both, keep both and choose the continuing version.
8. AI review: selected board region plus instruction -> preview summary/diagram -> accept/edit -> insert/export. Existing artwork must not be overwritten automatically.

## Confirmed input behaviour
Pen draws. Fingers navigate and invoke gestures; finger drawing is optional. Smudge supports finger interaction. Two-finger double tap undo; three-finger double tap redo. Stationary hold invokes eyedropper; draw-and-hold at the endpoint invokes line/shape recognition. These resolve the earlier stationary-hold conflict.

Recommended arbitration: do not commit one-finger ink during a recognized navigation gesture; while finger-smudging, movement starts smudge and a stationary hold invokes the picker. Stylus and palm events must be distinguished using available platform evidence. Activation thresholds are configurable and must be tested on actual devices. Gesture tests must cover accidental contact, cancellation and mode changes.

## Drawing and editing
Vector and raster layers coexist. Vector curves expose control points; pressure width remains editable where the chosen representation supports it. Vector eraser modes: touched segment, up to intersection, whole stroke; point deletion is a separate action. Smudge and raster-only filters offer a rasterized copy for vector content, preserving the original.

Painting: pen, pencil, marker, airbrush, watercolour, textured brushes and smudge. Proposed original ink presets: technical fineliner, studio ink, dry ink, brush pen and monoline. Independent pressure-to-width and pressure-to-opacity curves; brush size, opacity and stabilization. Procreate-inspired Paint/Smudge/Erase share brushes and support holding a tool icon to transfer settings. Rendering fidelity requires human validation.

Layer controls: names, order, groups, visibility, locks, opacity, masks, clipping masks and supported blend modes. Define the initial blend-mode set and test reference outputs before its slice is ready.

Gap-aware fill: configurable gap closing/tolerance and layer references. Fill and blur require a finite operation region, a preview or cancellable operation and one undo transaction. Painting remains responsive during background processing.

Text boxes, sticky notes, shapes and attached connectors are included. Text supports font, size, colour and layout edits. Missing-font fallback is explicit. Fonts bundled in releases must permit redistribution; user font support depends on platform capabilities.

## Colour and paper
HSL/RGB controls, shade families, palettes, recent colours, eyedropper and palette mixing. Reference Concepts interaction behaviour; palette assets themselves are not automatically included. Paper background, grid, brush grain and export background are independent concepts.

Infinite board plus finite named artboards. Artboards specify pixel dimensions or physical dimensions/DPI. DPI metadata changes and pixel resampling are distinct operations. Original vector content remains scalable; raster resizing is previewed and undoable.

## Local state and sync
Local board editing requires no account. Drive authorization enables sync. Confirmed conflict policy: preserve both revisions, present both and let the user choose which to continue. No silent last-writer overwrite. Opening a board stays available through sync failures. Proposed local autosave uses atomic recovery snapshots; sync success is shown only after remote write confirmation. Disconnecting Drive does not delete local boards.

## Import/export
Confirmed image and selected-PDF-page import, experimental Procreate brush conversion with unsupported-setting reports. Preserve original inputs. Layered PSD is the proposed exchange bridge to Procreate/Clip Studio; native-format export is not a release dependency until separately approved and verified. Export only a bounded region; retain native board to preserve application-specific semantics. Round-trip compatibility is measured, not assumed.

## Timelapse and AI
Timelapse is in release one; proposed default is operation replay excluding idle time, bounded by selected artboard. Retention, quality presets and undo replay semantics need an explicit contract before implementation.

AI summary/diagramming is confirmed for release one after base validation. Proposed default: explicit selection and explicit send, cloud transmission preview, review before insertion, provider adapters and ordinary offline exports independent of AI. Provider selection and credential storage remain unresolved.

## Accessibility and recovery
Visible undo/redo and keyboard shortcuts remain available alongside touch gestures. Clear focus states and adequate touch targets. Multi-display DPI changes, rotation, background/resume and device disconnect are part of acceptance. Failed imports preserve the board. Lost network affects sync/AI, not drawing. Large operations expose cancellation and their completion becomes one undoable action.

## Review milestones
Human evaluates real drawing feel and task usability in batches of 2–4 checkpoints. Every checkpoint independently completes automated QA, documentation, graph capture, Gatekeeper review, local integration and merged regression. Dependent work waits for material human feedback at a review boundary.

## Not yet locked
Runtime/graphics engine, board format, precise performance thresholds, blend-mode set, timelapse semantics, provider adapters, license, release credentials, controller budget and remote repository. This review is a concrete proposal for feedback, not a claim those engineering decisions have been made.

## Motion Trace — approved behaviour and proposed details
Confirmed: object/group movement plus camera pan/zoom; manual and timed playback, manual default; presentation-only playback restores layout, explicit commit option is available.
Proposed: separate cue track stores target IDs, path, view framing, duration and easing. A presentation preview transform must not mutate saved artwork. Cancellation restores pre-playback state. Commit is an explicit undoable document operation, independent of camera movement. Locked/hidden/deleted targets and overlapping cues require defined outcomes before implementation. Repeated playback must not accumulate positional drift. No live collaboration is implied.

# Full-window pose alignment
Base: 2806fe13b10c3883f05a2dec7d52db23de65f870. Owner requests entire canvas for joint alignment against imported reference, with navigation and pose proportions available in the editor.

Evidence: reference-editor is capped at 760px and SVG at 55dvh. prepareBackgrounds excludes the whole pose layer, hiding same-layer references. app commit replaces only selected pose stroke and retains one board Undo. Prior navigation PR56 merged but publication still pinned to older source.

UX baseline: full-window spatial editor, compact toolbar and persistent Apply/Cancel. Drag empty space or Pan view to navigate; touch pan/pinch and wheel remain. Move pose moves all joints together; separate width/height controls resize around joint bounds center. Reference pixels remain stationary as alignment evidence. Both same-layer and other visible-layer raster references appear. Joint, move and size operations share local Undo/Redo; Apply commits one board step; Cancel is lossless. Preset tools remain available. No new schema. This bounded implementation follows the owner's explicit full-canvas requirement; no further preference is needed.

Allowed: drawing-reference-ui.js, drawing-reference.js, pose.css, index.html, existing pose model/browser tests, this change folder. Prohibited: roadmap and all existing delivery docs, graph, other features, deletion of QA records, workflows, release pin/cache. Existing tests retained. No live publication claim.

Regression obligations: POSECANVASM01 translation/scaling around center retains source and rejects invalid/out-of-bounds results; POSECANVASB01 full-window dimensions, same-layer background, blank-space pan, pose move/size/local Undo and Cancel; existing POSENAVB02 off-frame Apply/board Undo/Redo/reload; existing pose regression suite. Scope self-review plus actual diff check; no independent human review claim. Rollback is reverting this isolated commit.

# DRAW2 acceptance ledger

All 13 original feedback items remain tracked. Implementation is not a browser pass or physical-device acceptance. This ledger is updated from executed evidence, not from feature labels.

| Item | Result implemented | Executable check / remaining acceptance |
|---|---|---|
| 1. Import artwork larger than 2048 | PNG/JPEG source bound raised to 16384 per side / 64 MP / 32 MiB; browser downsizes to 1024 before canvas sampling | DRAW2B01 imports 5000×3000; IMPB04 still rejects beyond safe bound |
| 2. Three-finger redo; find hair | Application chord tolerance 220 ms arrival / 400 ms duration / 14 px movement; explicit Hair guides action | DRAW2M09 / DRAW2B04; physical Surface/Xiaomi trial remains open |
| 3. Pose over image; proportions | Native reference photo and separate native pose layer; editable 2D joints; feminine/masculine/child/chibi/custom 3D profiles | DRAW2B01 / DRAW2M01–06; 3D rebuild is explicit so manual joints are not silently replaced |
| 4. Layers/brush wall of text | Prior DRAW1A stack/catalog ordering retained | Existing W14 cumulative acceptance |
| 5. Grey reference action | Prior startup guard retained; Add reference now defaults to canvas reference layer | Existing W15 + revised IMPB05 retains legacy side-reference verification; DRAW2B01 native layer |
| 6. Automatic timelapse | Default automatic capture with explicit persistent opt-out; manual recording compatibility retained | DRAW2TIME + existing TIME suite |
| 7. Pose new layer / transform / resize / warp | Native raster layer with validated editable source; normal selection transforms; projective warp transports joints | DRAW2B01 / DRAW2M04; mesh deformation does not promise editable joint transport |
| 8. Reference image → stick figure | Explicit on-device MediaPipe human pose detection; downloaded model only when requested, no pixel upload; source preserved on errors/cancel | DRAW2B03 real official human-photo fixture; cartoons, occlusion, animals and unusual poses may fail and need manual correction |
| 9. Hide pose independently | Native layer eye, opacity, lock and order controls | DRAW2B01 / native layer regressions |
| 10. Independent hair | Hair guides action adds hair-only native layer without requiring pose | DRAW2B02; style/camera edits from layer actions |
| 11. Image swatches; floating history/swatches | Frequency palette extraction from visible pixels; floating recent-colour/swatches and Undo/Redo dock | DRAW2PAL / DRAW2M08; phone dock can collapse |
| 12. Find Gaussian blur | Direct Actions entry for active layer; existing curves/blur layer controls retained | DRAW2B04 + existing filters/adjustments suite |
| 13. Better female poses | Distinct feminine/masculine proportion starters and five additional original stance/action starters, all reusable across profiles | DRAW2M06; usefulness/quality for the owner's artwork remains OPEN, not certified by automated tests |

Native guide metadata and pixels travel in board JSON and history. Guide strokes are excluded from artwork export and the video render projection; ordinary drawing on the same layer remains artwork. Existing legacy side-reference/pose-overlay workflows remain compatible and explicitly secondary. Saved 2D poses have independent backup/import; existing 3D pose/proportion preset backup remains available. No automatic knowledge-graph or skill edits. Animal rigs/external corpora and all other product roadmap requirements are retained.

Model sources: https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker/web_js ; runtime https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs ; model revision1 https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task ; real-photo verification fixture https://storage.googleapis.com/mediapipe-assets/pose.jpg .

Execution at this record: 673 complete local model checks PASS (including 115 focused model/CI-contract checks); syntax and HTML unique IDs PASS. Browser verification pending GitHub CI; local Playwright browser download failed. No merge/publication claimed.

# CAP2 measured results — 15-Oct-2026

Targeted preflight38729191536 at3064110a4a0d88c374921721ec062fa52340873d passed. Final90630dd21ab35c5b4000ce93bcbeddd98017a8f5 application is byte-identical; only offline test literals/delivery records changed. Artifact11969807270 SHA25662b300105d180642a291840eb74caf60e32a88c6ea4b253e64a245539a24bf34 downloaded and verified.

35cached/reference mutation/view/hierarchy/clipping cases perDPR1/2, plus mask draft/helper/reference/zero-budget checks and5growing-live comparisons perDPR passed. Growing-live warm replay count4vs6reference strokes; a static sibling stays retained. Warm median1.8msvs2.75msDPR1;11.3msvs15.25msDPR2in this small320x240six-layer fixture. Cold retention can cost more; oneDPR2warm sample17.5mswas slower than14.7msreference. No universal speedup/FPS claim.

Original CAP1mixed800x600 fixture unchanged:30/32/50layers,5folders,masked/clipped/multiply leaves, vectors/images/text/grain, HSLgroup+sigma1blurgroup;DPR1/2. 50layers remain renderer-only. Warm50layer medians230.7msDPR1/526.8msDPR2versus previous checkpoint~515–522ms/~1240–1245ms. These cross-run measurements suggest improvement but are not a controlled device benchmark.32layer warm medians150.4ms/333.6ms. Still too slow for an interactive capacity-target claim.

Exact cached/reference pixels,<=80MiBbacking,32layer native/Undo/Redo/IDBsave/reload/UI,previous-valid recovery/subsequent save,stale-write rejection,injected quota atomicity andinvalid-save preservation passed. Standard backend and model/storage unchanged. No cap increase,30–50interactive acceptance,totalprocessRAM,physical Surface/Xiaomi/Lenovo,palm/pen/long-session claim.

Cache ownership<=16MiBfurther bounded by spare backing after five engine surfaces,max active effect depth,8MiBclip reserve,tip temporary. Whole-board content conservatively invalidates retained groups; geometry/helpers/reference release them. External leaf/nested-group matte consumers prevent unsafe skips. Active effects and unretained/unadjusted layers still replay: retained leaf composition for group frames remains possible future performance work,not silently included inCAP2.

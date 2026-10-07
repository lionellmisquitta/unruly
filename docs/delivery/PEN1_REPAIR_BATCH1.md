# PEN1 application repair batch1

CI1 source9bf176a589f9a45580c07bf19dd7475c20c91d54, run37631776750, artifact11486149246. Model57/57 and inherited90/90 browser checks passed; PEN15/17 passed.

PENB13 product defect: Chromium emitted terminal lostpointercapture with buttons0/pressure0 before the hover pointermove for an operation admitted on pointermove, cancelling the completed mapped lasso. Mapped gesture records its admission event. A no-contact lostcapture for a move-admitted pen operation waits one event-loop task for the same-pointer terminal hover movement. That confirms normal contact end and commits once; a contact continuation, blur/cancel or absent terminal movement cancels. The lostcapture mask alone is insufficient because unexpected capture release can also report zero. Down-admitted capture loss retains cancellation. Admission also permits primary-tip contact with zero pressure, a valid contact sample. Per-gesture tool ownership remains frozen.

PENB08 test/tooling limitation: Chromium CDP dropped attempted eraser mask32; browser observed buttons0/pressure0. Independent QA replaces the false real-device assertion with explicitly synthetic reported-mask integration coverage and retains failed real-CDP capability evidence. Physical eraser and pen support remain NOT_VERIFIED.

Budget after this batch: application repairs1/2; CI1/3 consumed, CI2 pending. No publication acceptance yet.

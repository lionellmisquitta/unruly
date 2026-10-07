# PEN1 independent adversarial test design

Source boundary: accepted U3 `41019aa0b7991bbe5bd56b71b9516da9bb454cd0`; PEN1 scope is `PEN1_CHECKPOINT_TEST_HANDOFF.json`. Builder is root Codex; adversary is fresh isolated Codex QA session (preferred cross-model runtime unavailable). Physical stylus remains **NOT_VERIFIED**, even when browser/CDP tests pass.

The blind attack pass prioritizes pressure endpoints, atomic document admission, input ownership, and temporary tool restoration. Tests use deterministic boards with one editable layer, original Fineliner for width/alpha measurements, and new preset IDs only where validating catalogue reachability. Every browser case receives a clean disposable browser context and its own IndexedDB/localStorage. No production data or physical device is mutated.

| IDs | Contract / risk | Evidence oracle |
|---|---|---|
| PENM01–02 | Immutable original12 +8 additional original presets, bounded families/work | Exact original IDs and serialized catalogue; unique additional descriptors; compatibility and work limits |
| PENM03–04 | Valid dynamics; unknown/invalid fields rejected atomically | Boundary data, null/missing/NaN/Infinity/type/extra-field rejection; deep equality of input and history |
| PENM05 | No retroactive pressure metadata | Absent dynamics accepted and preserved in legacy imports/migration |
| PENM06–07 | Snapshot metadata survives all vector operations | Import, duplicate, copy/paste, affine transform, partial eraser, undo/redo equality |
| PENM08–09 | Pressure and mapping helper boundaries | Null mouse pressure full width; monotonic bounded response; eraser precedence, barrel masks, mouse exclusion |
| PENB01–03 | New pressure visibly dynamic, stable replay, release0 protection, mouse full width | Real CDP forces .1/.9; independent canvas cross-section widths; saved stroke endpoint; canvas bytes before/after reload and Undo/Redo; mouse comparison |
| PENB04 | UI settings and mappings persist without document history | Set controls, reload, inspect controls and revision/history |
| PENB05 | All20 selectable, distinct previews, bounded rendering | Categories original+extra containers; distinct preview raster per family; serialized new preset |
| PENB06–09 | Real nonprimary pen events, temporary tool restore, lasso auto Move, no active switch | CDP buttons + observed actual pointer bitmasks; selected stroke coordinates, count, history and prior tool; cancel/blur restoration |
| PENB10 | Context menu suppression limited to workspace | Cancelable contextmenu defaultPrevented on canvas/overlay; allowed toolbar; unchanged document; mouse right drag produces no ink |
| PENB11/11a | Honest live diagnostics | In-contact variation vs constant .5, min/max/latest and buttons; valid contacting0 admitted; release0 cannot pollute range |
| PENB13–14 | Pointermove admission, unexpected gesture termination | Real CDP tip+barrel move-only lasso; real capture release and window blur cancel mapped eraser, restore previous tool, preserve document/history |
| PENB15 | Original12 pixels remain unchanged without dynamics | 48 exact RGBA comparisons against independently frozen accepted U3 preset draw kernel, pressures null/0/.5/1 and stroke opacity .63 |
| PENB12 | Offline cumulative app | Service worker controlled offline reload, local pen module fetch, new brush/settings usable; no external assets or page errors |

The inherited U1/U2/U3/performance suites remain mandatory and retain substantive assertions. Exact original12 tests are not rewritten to20; the additional catalogue uses its own export and separate UI container. CDP capability limitations are recorded; a synthetic event must not be described as physical hardware proof. Failures retain screenshots, traces, machine-readable results and are classified before repair. QA does not edit application source or publish. Root executes CI against exact integrated bytes, at most three runs; application repair batches at most two.

PENB15 fixture provenance: `fixtures/accepted-u3-preset-render.js.txt` reconstructs the accepted U3 preset draw kernel captured in the independent initial source read, including literal original airbrush gradient alphas. It is a frozen pixel oracle, not a claim that the entire old renderer was byte-for-byte archived. Existing performance evidence retains its earlier full legacy renderer parity checks.

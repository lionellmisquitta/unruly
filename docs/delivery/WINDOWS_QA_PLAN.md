# P0a-WIN-D1 independent adversarial QA plan

QA identity: fresh isolated Codex session (`windows_slice_qa`), same-model fallback. Builder session is separate; no Claude execution or paid external calls. Test design derives from WINDOWS_INPUT_CONTRACT.json before builder source is available. No production authorization or checkpoint closure implied.

## Bounded substantive cases

| ID | Criterion | Deterministic attack and expected outcome |
|---|---|---|
| W01 | 04/05 | Empty capture rejects append/end without a contact; retained data remains empty. |
| W02 | 02/04 | Valid contact with ID 7 at finite negative/client coordinates, pressure 0 then 1; coordinates, identity and normalized pressure are retained exactly. End then a second contact gets a distinct stroke. |
| W03 | 02 | Unknown pressure remains explicitly unknown; no pressure value is inferred. Rendering uses disclosed constant width for unknown pressure. |
| W04 | 05 | NaN and positive/negative infinity coordinates on begin and append reject without mutating retained data or corrupting active identity. |
| W05 | 05 | Known pressure NaN, infinity, negative and above 1 reject on begin/append; endpoints 0/1 valid. |
| W06 | 04 | ID 8 append/end during ID 7 contact cannot append to or terminate ID 7. A second begin during contact cannot silently join/replace it. |
| W07 | 04 | Cancel ends contact but preserves completed/retained ink; subsequent append rejects; new begin produces distinct stroke identity. |
| W08 | 05 | At sample 7999 append reaches 8000 exactly. Sample 8001 is rejected, size remains 8000, capture stops with full state. Further begin/append cannot resume until Clear. |
| W09 | 04/05 | Clear mid-contact erases samples and resets active/full state; subsequent append rejects; fresh contact works. Repeat Clear is harmless. |
| W10 | 02/03/04 | Windows adapter review: PT_PEN contact gating, hover/mouse/touch non-inking; pen API failure visible, pressure mask honored, release/cancel/focus-loss terminates capture; pointer coordinates transformed to client space. Static review only on Linux. |
| W11 | 01/06 | Native Windows build with warnings as errors; startup shows permanent zero diagnostics, Clear and close work; creation failure visibly explained. Windows compile/runtime evidence required. |
| W12 | 02/03/07 | Physical Surface then Lenovo pen: contact draws, pressure varies or explicitly unavailable, hover/mouse/finger do not draw, lift/recontact does not bridge strokes. Physical run required; synthetic injection cannot pass this case. |

## Data and execution

Fresh Capture per model case; fixed IDs 7/8; finite coordinates including zero and negatives; deterministic IEEE nonfinite values and capacity boundary. No filesystem/network mutation in model tests. QA owns model_tests.cpp and does not repair application source. Run host C++ warnings-as-errors, bind source and executable SHA-256 to results; one builder repair maximum. Windows build, native UI, physical pen and post-merge regression are distinct NOT_VERIFIED/BLOCKED outcomes until real evidence exists.

Source is currently unavailable; model execution NOT_VERIFIED. Plan does not redefine ambiguous implementation semantics; discrepancies return to Gatekeeper/Builder before changes.

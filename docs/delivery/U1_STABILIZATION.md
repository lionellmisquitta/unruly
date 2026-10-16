# U1 stabilization checkpoint — CI2 continuation

Date: 6 October 2026

CI2 on commit `866fd5ff8a6d4c7d408a0bcff914b0e19a550c74` proved 35/35 model tests, 15/15 foundation browser groups and 16/16 performance groups. Three browser failures remained.

Diagnosis:
- U02/U04 selection failures were QA compatibility-locator defects. The U1 compatibility adapter still resolved hidden Copy/Cut/Paste/Delete/Clear controls by accessible-role lookup. The application controls and clipboard behavior remain unchanged. QA now maps those legacy names to the existing stable control IDs while preserving the same behavioral assertions.
- UB10 proved a real layer pointer-drag defect. Keyboard reorder passed, but moving the captured layer row in the DOM can interrupt row-local pointer delivery before commit. The stabilization keeps the existing model/reorder contract and UX, but owns the active gesture with temporary window-level pointer listeners so pointerup/cancel remains observable even if the row is reparented.

This is an explicit stabilization checkpoint after the original U1 application repair allowance was exhausted; it is not recorded as an extra U1 repair cycle. No U2/U3 scope is introduced. Existing CI remains the independent executable verifier.

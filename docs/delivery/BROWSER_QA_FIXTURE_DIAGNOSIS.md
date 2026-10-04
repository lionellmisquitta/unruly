# Actual CI F05 timing diagnosis

Run37179952664, commit41cd77ffbe2dc1b3a935faa25058b26d84464636: model9/9 PASS; Chromium151.0.7922.34 journeys11/12 PASS. F05 failed its immediate dialog visibility assertion after clicking Boards. No uncaught browser errors were recorded.

Independent QA inspected the actual F05 trace ZIP. Click call612 finished at18405.495ms; `isVisible` call614 returnedfalse at18407.503ms, about2ms later. Boards handler awaits actual IndexedDB `getAll` before showModal. Final screenshot after-snapshot call616 at18448.32ms contains gallery DIALOG explicitly `__playwright_dialog_open_: modal` and two board rows. Thus the assertion raced asynchronous IndexedDB completion; the gallery actually opened about40ms later. Earlier F05 save/reload/export/New assertions passed before this failure; downstream rename/open/inert-title assertions did not execute and remain unverified until rerun.

Classification: **test synchronization defect**, not proven application defect. QA-only correction adds bounded `waitFor({state:'visible',timeout:5000})` before retaining the exact visibility assertion. No assertion removed/weakened, no source change, no application repair-budget reset. Request Gatekeeper disposition for one bounded diagnostic CI rerun of frozen application identity; rerun must execute remaining F05 checks rather than declaring PASS from trace alone.

# P0a-WIN-D1 — bounded native Windows input slice

Pre-build quarantined feasibility task, independently reviewed before source creation. Not the production app, selected renderer, Qt deployment or closed P0.

This program uses Windows SDK input directly instead of the failed WSLg route. It opens a canvas with event/sample/pressure status visible from startup. Pen contact draws; mouse/touch only update diagnostics. Unknown pressure is explicitly unavailable and uses a fixed diagnostic line width. Clear resets the bounded 8000-sample capture. No board storage, network, login or employer policy changes.

## Use a built CI artifact

Download `unruly-native-windows-input` from the successful isolated Windows CI run, extract the ZIP into a folder, then double-click `unruly-windows-input.exe`. This uses Windows directly. A legitimate Application Control denial is a blocker; do not bypass it. Build success never certifies that an employer-managed device permits execution.

## Build with existing Windows MSVC tools

From Windows Explorer, run `build-windows.cmd` inside this folder. It discovers an existing x64 MSVC SDK, compiles the diagnostic and QA-owned tests, runs tests and opens the window. It does not install tooling. Use `build-windows.cmd --ci` to build/test without opening the window. Linux/WSL is not the native execution environment. No AI CLI is required.

## Three physical checks

1. Initial status shows zero pen/sample counts. Draw with Surface Pen; confirm pen count and ink. Pressure must change or explicitly read unavailable. Test Lenovo separately and record which device was used.
2. Draw two separated strokes with hover between them, press lightly/hard, and move a finger/mouse. Hover/mouse/touch must not ink or connect separated strokes.
3. Change focus midstroke, return, draw again, Clear and close. No bridge or freeze. This is an input check, not a validated production feel benchmark.

Record the build hash, Windows/pen/display identity and outcomes. CI/host/synthetic results remain separate from physical checks. No saved board is provided by this diagnostic.

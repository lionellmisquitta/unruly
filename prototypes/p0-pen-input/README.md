# P0a — quarantined raw pen-input probe

Status: source created; native build and device behaviour NOT VERIFIED. Qt is an evaluation candidate, not the final runtime decision. This is one small C++ source file plus a build manifest; it is not UNRULY's architecture or drawing engine.

## What this proves, once run
Observe whether Qt tablet events reach each target screen, pressure changes as force changes, and separate strokes remain separate. Draw thin-to-thick strokes, fast loops and tiny handwriting on Surface, Lenovo second display and Xiaomi separately. Compare pressure readout against the physical action. Fingers/mouse must not produce ink. Clear resets capture. Switch away during a stroke, return and draw elsewhere: no connecting bridge. Hit the 8,000-sample limit: stop capture, display the limit and recover with Clear.

This probe does not verify palm rejection, production rendering performance, stabilization, gestures, infinite canvas, persistence, APK packaging or end-to-end latency. It redraws bounded raw samples with QPainter to isolate input routing; production needs a separately measured rendering candidate. Eraser ends currently draw ink intentionally: device-tool discrimination belongs to P0b.

## Build prerequisites and command
Developer dependencies are separate from the install-free product. Use a Qt 6.8-or-later desktop kit with matching C++ compiler and CMake. Record the exact Qt/compiler/OS versions in evidence; no version is claimed installed here.

From this directory with the Qt kit activated:

```bash
cmake -S . -B build
cmake --build build --config Release
```

Run the resulting `unruly_pen_probe` executable from the build directory (possibly `Release/` for a multi-configuration generator). These are build commands, not a portable distribution recipe. Portable Windows deployment still needs the matching Qt deployment tool, runtime dependencies and a clean-machine test. Android needs an Android Qt kit, matching SDK/NDK/JDK, APK deployment and device tests; desktop success proves none of those.

## Evidence and next steps
Keep build logs and a short screen recording per target; note which display received pen input, OS/driver/pen versions, pressure range, unexpected ink, missing samples and failures. Do not enter real meeting content. Logs/video are locally collected evidence, not automatically uploaded.

P0b must test device/eraser identity, touch arbitration, multi-display coordinates, lost-device recovery and Android lifecycle. P0c must compare tiled GPU rendering candidates under background work with frame-time and latency measurements. P0a does not close P0 or authorize production build.

Rollback: close the executable and remove its build directory. No user documents, network integrations or credentials are modified.

Reference: https://doc.qt.io/qt-6/qtabletevent.html and https://doc.qt.io/qt-6/qtwidgets-widgets-tablet-example.html

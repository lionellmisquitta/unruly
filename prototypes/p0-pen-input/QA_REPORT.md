# P0a independent adversarial QA

Overall status: **BLOCKED**. This is a quarantined source/model check, not native execution, production approval, or full P0 closure.

Adversary: fresh isolated Codex QA agent, same-model fallback requested by Gatekeeper because Claude CLI was unavailable. Builder: Codex. No merged commit/build identity was supplied. Source was checked by SHA256 below. No application source was edited by QA. Repair cycle: 1 (Builder added contact-button guards after QA reported missing-release hover risk).

## Executed checks

Working directory: `/workspace/scratch/361b0c571efe`.

```bash
g++ -std=c++17 -Wall -Wextra -Wpedantic -Werror whiteboard-preparation/prototypes/p0-pen-input/model_tests.cpp -o /tmp/p0_model_tests
/tmp/p0_model_tests
sha256sum whiteboard-preparation/prototypes/p0-pen-input/main.cpp whiteboard-preparation/prototypes/p0-pen-input/README.md whiteboard-preparation/prototypes/p0-pen-input/CMakeLists.txt whiteboard-preparation/prototypes/p0-pen-input/model_tests.cpp
g++ --version
command -v cmake
pkg-config --modversion Qt6Widgets
```

Compiler: g++ (Ubuntu 13.3.0-6ubuntu2~24.04) 13.3.0. Compile exited 0 with warnings treated as errors. Initial and repair-cycle model executions each returned **10 test cases passed, 0 failed**, exit 0. The suite compiles only `Capture` through `P0_MODEL_ONLY`; it excludes every Qt/UI function. The observation line is diagnostic, not an extra passing test. Deterministic data includes NaN, both infinities, pressure endpoints and out-of-range values, finite negative coordinates, 8,000 and 8,001 sample attempts, and three fill/clear cycles. No external or user data is used.

```text
PASS P0-M01 idle hover and repeated end
PASS P0-M02 distinct strokes and release
PASS P0-M03 pressure endpoints and exact values
PASS P0-M04 invalid press is rejected
PASS P0-M05 invalid move does not append
PASS P0-M06 replacement press terminates old stroke
PASS P0-M07 exact capacity and overflow
PASS P0-M08 clear recovery from full
PASS P0-M09 end preserves ink and splits resumed stroke
PASS P0-M10 repeated capacity clear cycles
OBSERVATION missing-release zero-pressure move accepted=1 samples=2 (UI contact guard requires native verification)
RESULT 10 passed, 0 failed; model only

```

| Test | Contract coverage |
| --- | --- |
| M01 | Idle append rejected; repeated end safe |
| M02 | Press samples retained; release stops append; separate stroke IDs |
| M03 | Finite coordinate preservation; pressure 0 and 1 accepted |
| M04 | 11 invalid press combinations rejected without sample insertion |
| M05 | 11 invalid move combinations rejected; subsequent valid input recovers |
| M06 | Replacement press separates strokes; invalid replacement stops old stroke |
| M07 | Exact 8,000 bound; 8,001 rejected; full press rejected |
| M08 | Repeated clear resets all capture state; new press recovers |
| M09 | end stops capture while retaining previous ink; resume starts distinct stroke |
| M10 | Three capacity/clear cycles preserve bounded state |

## Static UI findings and repair-cycle retest

1. Initial review found `TabletMove` unconditionally forwarding samples while active. A lost release followed by unpressed movement could therefore append ink. The model reproduction still accepts pressure-zero append while active because contact state belongs to the Qt adapter. Builder repair now checks `event->buttons().testFlag(Qt::LeftButton)` on both press and move, and calls `capture.end()` otherwise. Re-read confirms the contact guard is present in the hashed source. **Static repair verified; Qt API compile and platform contact mapping NOT VERIFIED.** A target reporting no LeftButton will not capture ink; its readout currently says “raw input,” which does not explicitly diagnose unsupported contact mapping.
2. `TabletRelease`, focus-out, widget hide, and window-deactivate paths call `capture.end()`. Actual event delivery and focus/lifecycle behavior require native tests. Model M09 tests the end primitive only.
3. Painting connects consecutive samples only when stroke IDs match and clips to widget bounds. Visual appearance, pressure response, and latency have not been observed.
4. No mouse/touch drawing handlers exist in this source; tablet events are accepted to avoid duplicate mouse synthesis. Mouse/finger exclusion remains a native/device check, including OS routing behavior.
5. No network, filesystem persistence, credentials, or export operations appear in the application source. Static inspection only; no runtime traffic monitoring was performed.
6. At exactly 8,000 accepted samples `full` remains false until the next valid append or begin attempt. Memory remains bounded. Consequently the limit message appears upon the next valid attempted sample, rather than necessarily on sample 8,000. This is a UI timing observation for native testing, not a bound failure.

## Blocked coverage

`command -v cmake` returned no path. `pkg-config --modversion Qt6Widgets` failed with command-not-found (exit 127). Additional Python path checks found neither `/usr/include/qt6` nor `/usr/include/x86_64-linux-gnu/qt6`. CMake and a usable Qt kit are unavailable in this environment. No Qt native build was attempted or claimed successful. No application launch, screen recording, physical pen test, native hover/focus test, mouse/finger test, Surface/Lenovo/Xiaomi test, or Android test ran.

Native acceptance remains **NOT_VERIFIED**, blocked by toolchain and target hardware. Required follow-up: build with a recorded Qt kit and OS/compiler identity; exercise contact/hover/release loss, focus loss, display routing, pressure variation, capacity/Clear, and mouse/finger exclusion on each target. P0b and P0c remain outside this source/model suite.

## Checked source identities

| File | SHA256 |
| --- | --- |
| `main.cpp` | `68621f1a4642d28d38affb993c9c1c043b09b563b1e490e2c5ea9de0d08ed8a1` |
| `README.md` | `e0696a9b42c14405d8a4900cc0fd0eb377e40ecc4ff69ba5967b9eaa47d69700` |
| `CMakeLists.txt` | `b14b61777a091025fa03b7d4f806a2557147adc5633da058def7ed02fa1320ac` |
| `model_tests.cpp` | `8d85bd6747b3ffe8e3b2c0e4c93ad468ef101c41e299d50ab02e6b8bec854358` |

The SHA256 values bind this report to the checked files; any source change requires a new check. This QA result does not close a delivery gate.

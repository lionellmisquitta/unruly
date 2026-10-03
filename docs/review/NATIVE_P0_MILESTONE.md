# Runnable native P0 milestone — WSLg, 3 October 2026

Artifact: `prototypes/p0-pen-input/build/native-wslg-2026-10-03/unruly_pen_probe`. Launch from repository root with `bash prototypes/p0-pen-input/launch-linux.sh`. It is a Linux ELF executable using the verified user-owned Qt kit, displayed by WSLg/XWayland. The exact launched PID has a viewable 1000×700 window with the expected P0 title; the probe-only screenshot and binary/source hashes are recorded. The generated executable and dependency packages stay local and ignored.

Human review: [one three-task card](P0_HUMAN_TEST_CARD.md). Slow handwriting/curves, fast pressure strokes, and interrupted input on the Lenovo display are the only tasks. Pressure/tilt readouts, raw variable-width ink, separate strokes, Clear and an 8,000-sample limit are supported by this diagnostic. There is no saving, undo, navigation, smoothing, sync or AI. Real pen routing/accuracy/feel remains human/device evidence, and WSLg results remain separate from native Windows and Android.

## Reproduce the bounded Linux build

On this configured Ubuntu 26.04 checkout, Qt 6.10.2, CMake 4.2.3 and Ninja 1.13.2 plus dependencies were downloaded using the official APT package indexes. Each of 66 archives was checked against its index SHA256 and extracted with `dpkg-deb --extract` into `~/.local/share/unruly/toolchains/ubuntu-26.04-qt6`. No apt installation, maintainer scripts, sudo, global PATH, Windows policy or credential changes occurred. g++ 15.2.0 is the existing compiler. This is an experimental distro-compatible kit, not an assertion of Qt vendor certification for Ubuntu 26.04/WSLg. Qt remains a runtime candidate.

For a fresh compatible user prefix, `python3 prototypes/p0-pen-input/bootstrap-linux.py` prepares the kit and refuses an existing prefix. It records the actual package pins/checksums selected from the configured official index; it is not a universal pinned clean-machine environment for C01. On this already prepared checkout:

```bash
bash prototypes/p0-pen-input/launch-linux.sh --build
bash prototypes/p0-pen-input/launch-linux.sh
```

CMake configures the existing source with Release/Ninja and `-Wall -Wextra -Werror`. The optional GLX lookup reports missing `OPENGL_glx_LIBRARY`; the OpenGL wrapper needed by this Widgets build was found, configuration/build both exited 0, and xcb startup succeeded. This does not establish accelerated production-renderer readiness. No Android or Windows native build ran.

## Actual QA and repair evidence

Initial native build succeeded. Initial independent Claude-authored adapter tests compiled with strict warnings and ran through `QApplication::sendEvent`: six of eight passed; P0N-002/P0N-006 failed on buttonless hover delivery. Claude diagnosed the shared cause without changing assertions. A separate diagnostic, excluded from passing counts, confirmed default tablet tracking was false and hover left capture active, in both hidden and shown widgets; enabling tracking only in that diagnostic delivered hover and ended capture.

Codex repair cycle **2 of 3** adds a comment and `setTabletTracking(true)` to the existing Pad constructor. No prior Windows repair was removed. Qt documents that disabled tracking only delivers moves during contact/button press, while enabled tracking delivers hover. [Qt QWidget tabletTracking](https://doc.qt.io/qt-6.10/qwidget.html#tabletTracking-prop).

On repaired source, existing10 + Claude adversarial9 + capacity2 + native8 compiled and executed with exits 0: **29 passed, 0 failed**. Observation lines are excluded; native events are synthetic and the test widgets are mostly hidden. These results do not establish driver delivery, palm rejection, physical pressure/tilt, renderer fidelity or latency. Raw input/proposed labels in the older adversarial suite remain stale diagnostic text, not evidence statuses.

Initial window-inspection failure was a controller-tool defect: legacy WM_NAME was empty. The corrected observer checks the exact _NET_WM_PID and UTF-8 _NET_WM_NAME before capturing only the P0 window. The failure and successful inspection are both retained. Initial and repaired binaries/source have separate identities; the repaired probe was launched and left available for human review.

Independent authenticated Claude QA and a separate Gatekeeper role use sanitized packets, disabled tools/MCP/slash commands, no session persistence, existing login and a 180-second timeout with a $3 reported-usage ceiling per call. The independent immutable responses are kept locally; the curated evidence summary contains their assessment outcomes and hashes. A claimed assessment is not substituted for process exits or artifacts.

## Contracts, readiness and publication boundary

Preparation now includes seventeen draft checkpoint contracts (P0a/P0b/P0c and fourteen implementation slices including C09M), EDR-001–014, an engineering-principles review candidate and an explicit ready/blocked queue. Acceptance criteria, deterministic fixture designs, dependencies, resource proposals, security boundaries and rollback are specified; material choices and measured-device requirements remain visible. No proposed number, license, PSD route, provider, timelapse default or UX baseline is silently accepted.

Production authorization is **false**. Closed delivery-checkpoint count is **0**. Windows App Control clearance, native Windows regression/current-source build, actual Surface/Lenovo pen evidence, Android kit/APK/Xiaomi evidence, P0b/P0c, locked pre-build baselines and merged regression remain blocked/unverified. The separate WSLg startup submilestone does not close P0 or C01.

Only a curated preparation/prototype branch may be published to `https://github.com/lionellmisquitta/unruly.git` after the independent preparation-scope review. No main merge, blind pull, reset, clean, organizational GitLab operation or merge of `preview/offline-canvas` is part of this milestone. The preview branch remains an optional layout discussion artifact.

Full local evidence: `prototypes/p0-pen-input/evidence/native-wslg-2026-10-03/`. Curated publishable receipts are under its `publish/` folder. Historical Windows and Linux reports/evidence retain their original bytes. Runtime-only tooling/bootstrap does not ship with a production release.

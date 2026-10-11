# Linux continuation — 3 October 2026

This is supplemental Linux evidence. Preserve the Windows continuation, its source repairs, its independent QA verdict and its App Control blocker. Production authorization remains **false**; independent Gatekeeper review is pending. No production implementation, merge, push, release, hook registration or employer security-policy change occurred.

Environment: Ubuntu 26.04 LTS, x86_64 WSL2, kernel 6.6.114.1-microsoft-standard-WSL2; g++ 15.2.0 and Python 3.14.4. Claude is available at `<user-home>/.local/bin/claude`, version 2.1.288. Filtered `claude auth status` reports logged in using existing Claude authentication. A tools-disabled noninteractive smoke returned `UNRULY_QA_READY`, exit 0, in 7.025 seconds. No credentials, email or organization identifiers were persisted in the authentication evidence.

CMake, Ninja, Clang, JDK, adb, sdkmanager, Qt tools and pkg-config were absent from PATH. Bounded checks found no Qt6 CMake config under `/usr/lib/*/cmake/Qt6`, `/usr/lib/jvm`, `/opt/android-sdk` or `~/Android/Sdk`. These are bounded observations, not proof against custom installations. No dependency installation or native configure/build was attempted. Linux GUI, native pen routing, Windows target compilation, physical devices and Android remain unverified.

Starting HEAD is `cb1d52089c5cdd159050dc375b92750eb84d8271`, with existing dirty/untracked Windows work. All four probe file hashes exactly match the saved repaired Windows source identity. Linux compiled the current bytes without source edits, using `g++ -std=c++17 -Wall -Wextra -Werror -pedantic`. Three separate binaries reside in ignored `prototypes/p0-pen-input/build/linux-2026-10-03/`; no Windows executable was invoked or relocated.

| Suite | Cases passed | Compile / run exit |
| --- | ---: | --- |
| Existing Capture tests | 10 | 0 / 0 |
| Unchanged Claude adversarial tests | 9 | 0 / 0 |
| Unchanged Claude capacity regression | 2 | 0 / 0 |

These are **21 Linux model passes**, with zero executed failures. Counts are derived from actual stdout plus process exits, rather than runner-native JSON; observation lines are excluded. The adversarial fixture's literal “proposed” and “full lags” labels are historical diagnostics, not current evidence statuses. Tests use deterministic synthetic in-memory data and never access user boards. No additional application repair cycle was used; the prior cycle count stays at one.

The model accepts the final 8000th sample and immediately becomes full/inactive. Linux results verify this Capture contract and the saved boundary tests. They do not prove native rendering of that sample, contact identity, lost-release handling in the UI, palm rejection, handwriting feel, pressure/tilt hardware behavior or performance thresholds.

Fresh independent Claude assessment uses the already approved enumerated probe/protocol and sanitized test-evidence exchange, with model tools, slash commands and MCP disabled and no session persistence. Its actual invocation and immutable response are recorded separately in `assessment-invocation.json` and `assessment-response.json`. The controller's `QA_CHECKPOINT_RESULT.json` summarizes the evidence for Gatekeeper; it cannot authorize production or close P0.

Evidence: `prototypes/p0-pen-input/evidence/linux-2026-10-03/`. It includes environment/CLI identities, source hashes, validated handoff, adversary selection, compile/run commands and exits, binary hashes, data manifest, independent assessment and preservation checks. `run-linux.py prepare` is the Linux test command; it refuses a differing saved source identity. Preserve an existing evidence directory before any repeat run, since the runner uses fixed evidence filenames. Claude smoke/assessment are separate commands and consume the existing enumerated request files.

Next: use this Linux model evidence in the pending independent Gatekeeper review while continuing preparation. Obtain suitable native desktop and Android kits through permitted setup, then gather target-device evidence. Windows still needs legitimate App Control clearance for the previously saved binary and an actual Windows regression run. Linux success cannot remove that blocker. No runtime choice, UX baseline or production checkpoint is approved by this continuation.

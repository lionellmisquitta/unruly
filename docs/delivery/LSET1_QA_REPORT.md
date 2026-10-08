# LSET1 independent QA result

PASSED on exact integrated source `d7d31b0d630a045055ef569e6a04517788aa14f9`, CI run `37738555167`. Independently verified all 41 source-manifest hashes, archive SHA-256 `dfd5ceef74a7c0802236063f6643a7a0d92ec16fe52afbe324c4a2224d4e5ede`, and all 27 durable reports against the archive.

72 model cases and 126 Chromium journeys passed: 198 total, including all 184 inherited cases and 14 new LSET1 cases. No failures, skips or outstanding product findings. Clear-layer coverage verifies immutable metadata and other-layer preservation, one Undo/Redo command, empty/locked guards, hidden and last-layer behavior, selection clearing, and save/reload. Global Pen settings coverage verifies shared mappings across both entrypoints, brush/board/reload/offline persistence, mobile keyboard/touch dismissal, and live pen/shape/curve ownership boundaries. Original brush pixel and renderer-resource regressions passed.

One of three CI runs consumed; zero of two application repairs consumed. Test design and deterministic fixtures are described in `LSET1_QA_TEST_DESIGN.md`; raw evidence is in `evidence/lset1/ci1`.

Physical pen hardware remains NOT_VERIFIED. Chromium CDP does not expose the trusted eraser mask32 signal; inherited eraser integration proves the synthetic PointerEvent contract only. Hosted publication and merge identity require Gatekeeper verification.

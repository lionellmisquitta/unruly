# CONN1 replan after three unsuccessful cumulative attempts

The first two attempts failed a phone fixture before feature execution. The third source68a5e384f422f9004f9829005ce35a02e2a2c75a passed all17connector models and5connector browser cases plus five cumulative shards; foundation shard1 failed U03-cancel-frozen-touch-zero-outside. Actual evidence: new connector buttons/help enlarged Selection panel until it intercepted Reset view. The original test is valid and unchanged.

Revise UXD-CONN1: reuse the existing paper-row disclosure pattern, adding a collapsed Connectors section after existing selection actions/help/Trace selection. Connector creation/reverse/detach semantics remain identical; no controls, tests or accepted functionality removed. User opens Connectors only when needed. New connector browser journeys explicitly open the disclosure. HTML/test-only repair within existing allowed paths; native schema, commands, persistence and renderer unchanged.

Validation: rerun exact-source full cumulative suite because this is a real UI change. Keep original U03 assertions untouched; require all596models,460browser cases and2legacy checks. Inspect phone/desktop screenshots. Do not merge/publish until all pass. This is a bounded layout correction, not a broad UI redesign or new scope.

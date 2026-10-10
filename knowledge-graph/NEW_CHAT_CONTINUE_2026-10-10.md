# Continue UNRULY — cumulative product

Use https://lionellmisquitta.github.io/unruly/ as the single cumulative application. Increment that product rather than delivering separate test slices.

Latest verified application source: `e0c98dc2ff1ca08d03feefce982e77283d70495c` on `CHG-UNRULY-CUMULATIVE-1010/brush-comparison`.
Cumulative QA run 38030638512 passed. Pages run 38031010653 passed, including hosted application asset byte comparisons.

The full app includes 0–100 brush sizes, global/per-brush pressure curves, diagnostics, presets and disposable A/B comparison inside Brush Library. Comparison uses identical calibration contact samples and never writes board/history/brush settings.

Native main `cb1d52089c5cdd159050dc375b92750eb84d8271` remains unchanged. Physical tablet feel is NOT_VERIFIED. Next: C04 advanced controls and smudge; whole-canvas rotation deferred.

See `deltas/2026-10-10-cumulative-brush-comparison.json`. The repository's `releases/UNRULY-Current.kgp.zip` remains historical. The latest complete refreshed package is saved privately, not synchronized into this public repository.

## October 10 continuity addendum (verified against GitHub)

- Latest cumulative source `e0c98dc2ff1ca08d03feefce982e77283d70495c`, branch `CHG-UNRULY-CUMULATIVE-1010/brush-comparison`.
- Full application CI run `38030638512` passed. Pages run `38031010653` passed. Published URL remains `https://lionellmisquitta.github.io/unruly/`.
- The earlier `work/brush-size-percent-2026-10-09` CI run `37947624527` failed due to PENB02 legacy expected-width assumptions. This is historical; percent-sized functionality was subsequently corrected and released in the cumulative source. Do not confuse an old red workflow with the latest passing release.
- C04 graphite, responsive fullscreen control, airbrush size and scrollbars, nonlinear 0–100% size UI and Brush Library A/B comparison are cumulative features. Native main remains untouched. Tablet pen feel still NOT_VERIFIED.
- Full-canvas rotation deferred to final polish. Next scoped C04 work: grain, density, spacing and smudge. Do not introduce separate public demo URLs.
- CI takes several minutes because its workflow installs pinned Chromium dependencies and runs many separate document-model, rendering, persistence, browser and regression journeys, gathers evidence and validates release identity. It also cancels superseded runs on active branch. A long run is not itself an error.
- The historical `knowledge-graph/GRAPH_SNAPSHOT.md`, `HANDOVER.md`, `INDEX.json` and `.knowledge/CURRENT_GRAPH.json` are October 8 and MUST NOT be read as current state without October 10 release deltas. The current main graph archive under `knowledge-graph/releases` is also historical; preserve its identity, do not silently overwrite its hash or revision.

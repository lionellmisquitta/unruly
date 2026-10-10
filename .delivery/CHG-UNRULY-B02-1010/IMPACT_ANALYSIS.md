# C04-B02 — opt-in advanced brush controls

Baseline: e0c98dc2ff1ca08d03feefce982e77283d70495c; exact-source cumulative CI 38030638512 and hosted Pages 38031010653 passed. User authorizes next checkpoint and cumulative existing-page delivery.

Scope: per-preset opt-in density (10–100%), spacing (50–300% relative to preset), pencil grain (0–100%) and preset/round/flat tip. Custom tips replace native texture/spray with solid stamps; grain only original pencil tips. Density scales particle count for graphite/scatter and coverage for nonparticle tips. New optional version-1 stroke recipe is valid only for known compatible v3 presets; absent/neutral settings preserve original preset objects and pixel paths. No native catalogue changes. Existing v3 version retained with strictly validated optional recipe; older readers ignore recipe, so UI warns about older-version replay and backups.

Callers: app live pointerdown deep snapshot; existing renderer cached/reference/preview paths; shared effectivePreset and replayWork admission budget; model import/add/history/duplicate; selection copy/transform and eraser fragment spreads retain recipes. UI uses a separate validated device key; per-preset selection/reset; comparison capture and preset snapshot inclusion. Service worker caches two modules and bumps atomic generation. No new backing surfaces.

Limits retained: 20,000 dabs and 600,000 particles. Changed-spacing or custom-tip continuous ink becomes budgeted stamps. Flat rectangle 0.9 width by 0.36 width remains inside size/2 footprint at arbitrary rotation. Grain multiplier neutral at zero, bounded deterministic document-coordinate texture.

Risks: richer stamps may increase work up to fixed caps; runtime validation rejects over-budget strokes before board/history/storage mutation. Older preview cannot reproduce recipes. Physical stylus feel remains NOT_VERIFIED. Adjacent startup size-memory behavior is out of scope. Smudge/raster, masks, whole-canvas rotation, native main and deployment workflow are excluded from candidate implementation.

Verification: all cumulative model/browser suites unchanged and required; new model validation/limits/import/history/selection/erase tests and tablet browser neutral pixels across all presets, distinct control results, deterministic replay, controls-only board invariance, per-preset isolation/reset, undo/redo/reload/import exact pixels, cancel and corrupt stored recipes. Source review by separate agent; no independent human merge approval claimed. Rollback: restore prior Pages source pin; retain exported custom recipe boards.

Independent review correction: effective nonparticle tips explicitly discard inherited particle metadata. Cloud scatter changed to solid round/flat counts one operation per dab, not 36. Boundary regression admits exactly 20,000 stamps and rejects the next. Browser size-number uses its real change event and asserts stored 20.11-unit width at 70%.

# Tablet gestures impact

Baseline 9942d7f57376d2f59929d74018aa7138ce4fd322: C04-B03 smudge, cumulative QA 38071117695 and Pages 38071676820 passed. Native main cb1d52089c5cdd159050dc375b92750eb84d8271 is outside scope.

Recognition previously required four points, rejected paths above 1024 CSS px and allowed only tight lines/circles; hold movement restarted at eight pixels. Touch picker had no magnifier. Transform numerical journeys worked but the selection action was buried, handles were 16 px and rotations used an absolute angle that jumped after edits.

Scope: bounded shape recognition and provisional gesture composition, shared-scratch magnifier, discoverable transform action and relative touch handles. Existing persisted stroke schema stays unchanged: geometry is stored as ordinary pressure-bearing points. No model/storage/selection admission changes. Renderer continues to use five backing surfaces / 80 MiB; magnifier reuses scratch at 128 square, never allocates a sixth canvas.

QA: 133 cumulative models; existing full Chromium suite remains required, plus actual CDP pen and touch journeys in portrait and landscape. Regression coverage is additive. GitHub CI runs on the exact candidate; current verification is self-review with real browser artifacts, not a separate reviewer. Public deployment is authorized only to the existing cumulative preview after verification; main is never merged.

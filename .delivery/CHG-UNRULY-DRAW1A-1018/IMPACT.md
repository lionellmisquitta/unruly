# DRAW1A usability impact and bounded plan

Date: 18 October 2026
Base: `7143f46fa8f4f521ceb4e8ab96e2750205012afd` (`main`)
Branch: `CHG-UNRULY-DRAW1-1018`
Requirement: GitHub issue #39, user feedback items 2, 4, 5 (touch redo discoverability, Layers/Brush walls of text, disabled reference control).

## Intended behavior
- In Layers, show the actual layer stack immediately after the title; place grouping, Virtual Groups, explanation and paper controls after it in collapsed/secondary sections.
- In Brush Library, show family and preset choices before explanatory and advanced controls; keep all existing control IDs and behaviors.
- Explain why Show reference is unavailable and point to the existing image-import/reference workflow. Keep it available when a reference is hidden and disabled when already visible or absent.
- Preserve existing visible Undo/Redo buttons and two-/three-finger gesture logic; this slice only improves discoverability and clarifies gesture help. Gesture timing behavior requires device reproduction and remains open.

## Allowed files
- `prototypes/browser-workspace/index.html`
- `prototypes/browser-workspace/style.css`
- `tests/browser-workspace/browser.test.cjs`
- `tests/browser-workspace/custom-tips.browser.cjs`
- `tests/browser-workspace/pen.browser.cjs`
- `tests/browser-workspace/curve.browser.cjs`
- `tests/browser-workspace/image-import.browser.cjs`
- `tests/browser-workspace/virtual-project.browser.cjs`
- `tests/browser-workspace/lset.browser.cjs`
- `tests/browser-workspace/timelapse.browser.cjs`
- `docs/delivery/PRODUCT_ROADMAP.md`
- `docs/delivery/CURRENT_CHECKPOINT.md`
- `docs/delivery/CONTINUATION_CONTRACT.md`
- `.delivery/CHG-UNRULY-DRAW1A-1018/**`

## Prohibited in this slice
No image/document limits, native schema, storage, renderer, recording lifecycle, palette extraction/dock, pose data/model, AI/image inference, gesture thresholds, dependency, knowledge graph, skill or unrelated checkpoint changes. Do not claim feedback issue #39 fully resolved.

## Focused verification
Add a browser check for DOM/visual order, collapsed secondary sections, reference-state explanation, visible Undo/Redo and no horizontal overflow. Update existing pressure-control tests to expand Brush dynamics and project tests to expand the collapsed organization/project controls; preserve every existing assertion. The Virtual Groups browser suite uses a shared helper and must open the section there too. The pen-mapping guard opens both nested disclosures before simulating an active curve draft. Physical touch-device redo remains unverified.

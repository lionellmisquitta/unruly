# RTEXT2 automatic wrapping and adjustable line spacing — candidate
- Base verified and published FONT2 merge: 6f1231278f217e66438c537d7e14157f9b1c60f5.
- Preserve legacy text payload exactly: unwrapped / default 1.4 spacing serializes the original v8 keys, same bounds and draw calls.
- Opt-in Wrap checkbox sets an explicit 100–1024px text box; content itself is never rewritten. 1.0–3.0× line spacing supported with optional v8 text fields (wrap=true and/or lineSpacing). Enforce 32 rendered lines, 2,048 characters, 1,024px height, 32 explicit source lines, safe Unicode grapheme wrapping.
- Existing text edit, font family fallback, alignment, colour, transforms, Undo/Redo, source clipboard/import, layers and IndexedDB remain unmodified.
- Device font substituted after reopen: render must fail safe within existing text clipping instead of crashing artwork; canvas geometry remains saved, not remeasured into storage.
- Protected paths: no model.js, storage.js, renderer-engine, CI runner, service worker, graph/skills, or whole-canvas rotation changes in engineering candidate.
- Acceptance: existing TEXT and FONT tests unchanged; RTEXT2M01–05 and RTEXT2B01–03 additional adversarial coverage plus entire cumulative six-shard CI.
- Do NOT merge/publish before full current-head CI and reviewed scope. Release SW identity bump and pinned Pages publication must follow as separate gated release step.
- Known limitation: new optional fields may not be readable by older published builds. Retain export backup and hosted migration warnings; never downgrade a new board blindly.
- Source recovery branch and earlier released main kept unchanged. Physical-device acceptance later.

## Offline release revision (only after candidate validation)
Bump the normal offline cache identity from FONT2 to RTEXT2 and change only the corresponding cache identity assertions in 15 existing browser suites plus the FONTM03 test; keep all test invocations and behavioral assertions untouched. The published `main` remains unchanged until fresh full cumulative CI and pinned Pages publication pass. If any test fails, do not merge or publish.

# UNRULY quarantined UX preview QA

Status: **BLOCKED — browser runtime unavailable**. Product behaviour is not verified. No native engine, production readiness, or native pen feel claims.

Source: `unruly-preview.html`

SHA256: `0d5fede8a9d53c5a16e35bd051fa496fd2b0b9f12f134f347884fa116d1fe2bc`

Independent adversary: fresh isolated same-model session; Claude on the local laptop unavailable from this chat. Builder source was not modified. Repair cycles: 0.

Executed commands:

1. `node whiteboard-preparation/prototypes/ux-preview/qa-preview.cjs`
   - Exit 1 before any browser scenario: Playwright could not find `/root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell`.
2. `find / -type f \( -name chrome -o -name chrome-headless-shell -o -name chromium \) 2>/dev/null`
   - Found no browser executable.
3. `node /opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/cli.js install chromium`
   - Browser download returned a 0 MiB/truncated ZIP; repeated `End of central directory record signature not found`. No installed browser was produced.
4. Explicit launch using `chromium.launch({headless:true, executablePath:chromium.executablePath()})`
   - Exit 1: `/root/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome` does not exist either.
5. `sha256sum whiteboard-preparation/prototypes/ux-preview/unruly-preview.html`
   - Returned the source identity above.

`qa-preview.cjs` was created as executable test infrastructure. It covers desktop 1440×1000, tablet 820×1180 and mobile 390×844; offline file initialization; mouse drawing and undo/redo; pan/zoom; layer addition, visibility, opacity, hidden-layer drawing guard; HSL wheel/sliders; paper; PNG signature/current-view dimensions; active-layer whole-stroke erasure; pressure pointer input via Chromium DevTools; mobile drawer; and intentional refresh reset with empty local/session storage. It collects page errors and non-file requests.

Execution counts: 0 passed, 0 product failures, all browser scenarios blocked. Screenshot outcome: none captured because browser launch failed. Static source inspection shows no network or persistent-storage API invocation; this is a source-only observation, not runtime proof.

Unverified interaction risk from source inspection: starting a stroke clears `future` in `checkpoint()`. Canceling the stroke removes only the last history entry, so the prior redo branch is lost even though the stroke is not committed. Reproduce once a browser is available: draw, undo, start a second stroke, dispatch `pointercancel` or blur, then attempt redo. Classify after runtime reproduction; do not claim a proven product failure from this inspection alone.

Next step: supply a usable Chromium executable/cache, set `executablePath` in the test harness if needed, rerun the exact command, and replace this blocked report with actual results. Browser tests cannot establish native-engine behaviour or native pen feel.

## Builder follow-up (not an independent retest)

After this assessment, the builder increased UI text smaller than 12px and changed stroke cancellation to restore the prior history and redo arrays, including a history entry dropped by the 50-entry cap. Final source SHA256: `52cca61f664d243dc6fd6dda7cc06544b813b9abaa46d516af74e3bb708bae7f`. `node --check` passed for extracted inline JavaScript. Independent browser QA remains BLOCKED; these changes have not been runtime-tested.

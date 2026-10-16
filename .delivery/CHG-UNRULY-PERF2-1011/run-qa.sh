#!/usr/bin/env bash
set -euo pipefail
qa_result_code=0
mkdir -p tests/browser-workspace/evidence
node --version > tests/browser-workspace/evidence/node-version.txt
node --test tests/browser-workspace/model.test.mjs tests/browser-workspace/selection.test.mjs tests/browser-workspace/u1.model.test.mjs tests/browser-workspace/u2.model.test.mjs tests/browser-workspace/u3.model.test.mjs tests/browser-workspace/pen.model.test.mjs tests/browser-workspace/curve.model.test.mjs tests/browser-workspace/lset.model.test.mjs tests/browser-workspace/press2.model.test.mjs tests/browser-workspace/g02.model.test.mjs tests/browser-workspace/g02.fit.model.test.mjs tests/browser-workspace/c04.model.test.mjs tests/browser-workspace/airbrush-size.model.test.mjs tests/browser-workspace/brush-size-percent.model.test.mjs tests/browser-workspace/recipe.model.test.mjs tests/browser-workspace/smudge.model.test.mjs tests/browser-workspace/tablet-ux.model.test.mjs tests/browser-workspace/layer-transform.test.mjs tests/browser-workspace/render-contract.model.test.mjs > tests/browser-workspace/evidence/model-output.txt 2>&1 || qa_result_code=1
node tests/browser-workspace/server.cjs > tests/browser-workspace/evidence/server.log 2>&1 &
qa_server_pid=$!
trap 'kill "$qa_server_pid" 2>/dev/null || true' EXIT
for attempt in $(seq 1 50); do
  if curl --fail --silent http://127.0.0.1:4173/unruly/ > /dev/null; then break; fi
  sleep 0.1
done
node tests/browser-workspace/browser.test.cjs > tests/browser-workspace/evidence/browser-output.txt 2>&1 || qa_result_code=1
kill "$qa_server_pid"
wait "$qa_server_pid" || true
node tests/browser-workspace/server.cjs >> tests/browser-workspace/evidence/server.log 2>&1 &
qa_server_pid=$!
for attempt in $(seq 1 50); do
  if curl --fail --silent http://127.0.0.1:4173/unruly/ > /dev/null; then break; fi
  sleep 0.1
done
node tests/browser-workspace/selection.browser.cjs > tests/browser-workspace/evidence/selection-browser-output.txt 2>&1 || qa_result_code=1
kill "$qa_server_pid"
wait "$qa_server_pid" || true
node tests/browser-workspace/server.cjs >> tests/browser-workspace/evidence/server.log 2>&1 &
qa_server_pid=$!
for attempt in $(seq 1 50); do
  if curl --fail --silent http://127.0.0.1:4173/unruly/ > /dev/null; then break; fi
  sleep 0.1
done
node tests/browser-workspace/performance.browser.cjs > tests/browser-workspace/evidence/performance-browser-output.txt 2>&1 || qa_result_code=1
node tests/browser-workspace/u1.browser.cjs > tests/browser-workspace/evidence/u1-browser-output.txt 2>&1 || qa_result_code=1
node tests/browser-workspace/u2.browser.cjs > tests/browser-workspace/evidence/u2-browser-output.txt 2>&1 || qa_result_code=1
node tests/browser-workspace/u3.browser.cjs > tests/browser-workspace/evidence/u3-browser-output.txt 2>&1 || qa_result_code=1
node tests/browser-workspace/pen.browser.cjs > tests/browser-workspace/evidence/pen-browser-output.txt 2>&1 || qa_result_code=1
node tests/browser-workspace/curve.browser.cjs > tests/browser-workspace/evidence/curve-browser-output.txt 2>&1 || qa_result_code=1
node tests/browser-workspace/lset.browser.cjs > tests/browser-workspace/evidence/lset-browser-output.txt 2>&1 || qa_result_code=1
node tests/browser-workspace/g02.browser.cjs > tests/browser-workspace/evidence/g02-browser-output.txt 2>&1 || qa_result_code=1
node tests/browser-workspace/fullscreen.browser.cjs > tests/browser-workspace/evidence/fullscreen-browser-output.txt 2>&1 || qa_result_code=1
node tests/browser-workspace/airbrush-size.browser.cjs > tests/browser-workspace/evidence/airbrush-size-browser-output.txt 2>&1 || qa_result_code=1
node tests/browser-workspace/size-percent.browser.cjs > tests/browser-workspace/evidence/size-percent-browser-output.txt 2>&1 || qa_result_code=1
node tests/browser-workspace/compare.browser.cjs > tests/browser-workspace/evidence/compare-browser-output.txt 2>&1 || qa_result_code=1
node tests/browser-workspace/recipe.browser.cjs > tests/browser-workspace/evidence/recipe-browser-output.txt 2>&1 || { tail -100 tests/browser-workspace/evidence/recipe-browser-output.txt; qa_result_code=1; }
node tests/browser-workspace/smudge.browser.cjs > tests/browser-workspace/evidence/smudge-browser-output.txt 2>&1 || { tail -100 tests/browser-workspace/evidence/smudge-browser-output.txt; qa_result_code=1; }
node tests/browser-workspace/tablet-ux.browser.cjs > tests/browser-workspace/evidence/tablet-ux-browser-output.txt 2>&1 || { tail -100 tests/browser-workspace/evidence/tablet-ux-browser-output.txt; qa_result_code=1; }
node tests/browser-workspace/layer-transform.browser.cjs > tests/browser-workspace/evidence/layer-transform-browser-output.txt 2>&1 || { tail -100 tests/browser-workspace/evidence/layer-transform-browser-output.txt; qa_result_code=1; }
node tests/browser-workspace/layered-baseline.browser.cjs > tests/browser-workspace/evidence/layered-baseline-output.txt 2>&1 || { tail -100 tests/browser-workspace/evidence/layered-baseline-output.txt; qa_result_code=1; }
node tests/browser-workspace/render-boundary.browser.cjs > tests/browser-workspace/evidence/render-boundary-output.txt 2>&1 || { tail -100 tests/browser-workspace/evidence/render-boundary-output.txt; qa_result_code=1; }
exit "$qa_result_code"

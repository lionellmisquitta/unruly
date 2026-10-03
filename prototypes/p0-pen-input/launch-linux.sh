#!/usr/bin/env bash
set -euo pipefail
UNRULY_PROBE_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
UNRULY_QT_PREFIX="${UNRULY_QT_PREFIX:-$HOME/.local/share/unruly/toolchains/ubuntu-26.04-qt6}"
UNRULY_PROBE_BUILD="$UNRULY_PROBE_DIR/build/native-wslg-2026-10-03"
export PATH="$UNRULY_QT_PREFIX/usr/bin:$PATH"
export LD_LIBRARY_PATH="$UNRULY_QT_PREFIX/usr/lib/x86_64-linux-gnu${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}"
export QT_PLUGIN_PATH="$UNRULY_QT_PREFIX/usr/lib/x86_64-linux-gnu/qt6/plugins"
export QT_QPA_PLATFORM="${QT_QPA_PLATFORM:-xcb}"
if [[ "${1:-}" == "--build" ]]; then
  cmake -S "$UNRULY_PROBE_DIR" -B "$UNRULY_PROBE_BUILD" -G Ninja \
    -DCMAKE_BUILD_TYPE=Release -DCMAKE_PREFIX_PATH="$UNRULY_QT_PREFIX/usr" \
    -DCMAKE_FIND_ROOT_PATH="$UNRULY_QT_PREFIX" '-DCMAKE_CXX_FLAGS=-Wall -Wextra -Werror'
  cmake --build "$UNRULY_PROBE_BUILD" --parallel 2
  exit 0
fi
if [[ ! -x "$UNRULY_PROBE_BUILD/unruly_pen_probe" ]]; then
  echo 'Build the quarantined probe first: bash prototypes/p0-pen-input/launch-linux.sh --build' >&2
  exit 1
fi
exec "$UNRULY_PROBE_BUILD/unruly_pen_probe"

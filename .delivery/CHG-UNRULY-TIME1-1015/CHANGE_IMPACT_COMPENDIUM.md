# TIME1 change map
| Future request | Authority/code | Tests | Reopen trigger |
|---|---|---|---|
| Retention or limits | timelapse.js timeLimits; timelapse-store.js admission | TIMEM08/14, TIMEB04/05/12 | Persistent schema/memory/storage budget change |
| Smooth stroke replay | new capture/reconstruction contract; app committed observer | TIMEB01/02/11 plus pressure/raster/custom-tip suite | Must design pointer-stream buffering; do not mutate renderer to approximate historical ink |
| Video/framing/export | separate export module consuming validated recordings; current pure timeline | exact pixels/frame geometry/codec cancellation | New output budgets/framing UX; no screen capture of toolbars |
| Sync/portable logs | timelapse-store CAS/budget; attachRecording | TIMEB04/07/09 | Multi-device identity/conflict protocol and credentials |
| Replay workflow | timelapse-ui lifecycle; app preview/read-only hooks | TIMEB02/03/08/10 | Artwork writes, navigation lock or restore semantics |
| New native feature/version | unchanged model validateBoard consumed by timelapse | TIMEM01/09, TIMEB03 | New reader must retain old log snapshot compatibility |

Logical flow: app committed change → validated board text → delta queue → atomic separate IDB append; replay → validated reconstruction → temporary app renderer input. h.board remains source for autosave/native export and Undo. Existing model/render/app hubs are shared; this map does not prove global acyclicity or CI-enforced path isolation.

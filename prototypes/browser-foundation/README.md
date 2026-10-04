# UNRULY browser foundation preview

Quarantined WEB-F1 preview; not a completed product checkpoint. Original code is MIT under the repository LICENSE.

Serve this directory using HTTP(S), then open index.html. It is designed for a repository-relative URL such as /unruly/. No runtime packages, account or installer are required. Pen and mouse draw; fingers navigate; choose a brush colour and size. The eraser removes a whole stroke. Undo/redo is session history. Boards are saved in this browser's IndexedDB after transaction completion. Export creates a JSON backup; importing is deferred.

Wait for **Ready for offline use** before relying on offline reopening. Browser data clearing or eviction can remove local boards. Keep exported backups. This preview has no Drive sync, AI calls or credential storage. Limits: 100 boards, 2,000 strokes, 100,000 points and 8 MiB per board. Update activation is an explicit button action after saving and finishing the current stroke.

Reported pen pressure is displayed; synthetic browser tests do not verify actual Surface/Xiaomi pressure, latency or drawing feel. Windows native and Android hardware verification remain separate. No production/main/release authorization is implied.

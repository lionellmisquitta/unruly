# CHAIN1 — bounded engineering acceptance matrix

Release candidate: 2e70554f7af0fb43a1a5c536485a16e81e3a82e8, tree5df1eeccf7a9effcf2054a8bf1fff7782b3f7059. Final cumulative run39022741922. Local evidence is self-verification, not independent review. Final CI artifact verified:542models,433structured browser scenarios plus2legacy checks,192source hashes. Engineering criteria below PASS within declared boundaries; publication still pending until hosted bytes verified. Physical acceptance remains open.

| Required behavior | Executable evidence | Demonstrated boundary |
| --- | --- | --- |
| One canvas / ordered context | CHAINCB1/2, CHAINF-B06 | Exact Canvas pixel oracles at DPR1/2; actual UI switching preserves output and viewport |
| One editable group | CHAINE-B02, CHAINF-B12 | One expanded native layer tree; imported hidden/locked state rejects native writes |
| Collapsed artwork remains visible | CHAINCB1/2, CHAINF-B06 | Authoritative source replay fallback above/below active source; no flattened proxy equivalence claimed |
| Reversible activation | CHAINE-B02, CHAINF-B06 | Switches preserve native source data, session Undo/Redo and view |
| Upstream edits preserve downstream source | CHAINC05, CHAINF-B06 | Upper native source exact JSON unchanged; Undo restores composed pixels |
| Masks/blends/clipping | CHAINCB1/2 + cumulative COMP1/CLIP1/filter suites | Source-local IDs remapped without changing native masks/clips; eight blends with folder mask/clipping oracles |
| Source identity / revision freshness | CHAINM/CHAINS/CHAINC tests, CHAIND-B01, CHAINF-B09 | Stale/missing/recovered/conflicting sources refuse, save failure keeps active context |
| Persistence / reopen | CHAINE-B02, CHAIND-B01 | Project and source updates atomically committed in existing IndexedDB stores |
| Offline project use | CHAINF-B03 | Full cached module graph; offline reload and activation |
| Backup / recovery | CHAINF-B03/04/07/08/10/11 | Full-project backup/import copies identities; native previous recovery retained; quota rolls back and preserves context; explicit Gallery recovery sources |
| Legacy standalone boards | CHAINF-B10 + complete existing cumulative suites | Original copied board still usable; no native schema/storage/renderer internals rewritten |
| Existing test strength | CIG01/02 and three mutation guards | Every model/browser file invoked; existing behavioral assertions retained; only15cache identities changed |
| Physical pen / larger-project performance | PHYSICAL_VERIFICATION.md | NOT EXECUTED; no latency, palm, long-session or unlimited-capacity acceptance claim |

## Scope and limitations retained

This is a bounded usable Virtual Groups engineering baseline with source replay, aggregate32layers/8MiB and existing renderer budgets. Reference companions, editable shared paper, cross-group selection/clipping, group reorder/removal, cached proxy optimization and increased capacity are not demonstrated. No original requirement is removed through omission; further scope requires its own bounded checkpoint. Device acceptance cannot be inferred from synthetic CI. Main's evaluate-for-reference.md remains an evaluation backlog, not implementation authorization.

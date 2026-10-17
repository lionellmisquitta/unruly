# Proprietary brush import feasibility — 17 October 2026

Status: source review completed; no runtime proprietary importer implemented or claimed. Existing PNG/JPEG image tips, grain, jitter, sections and library backup remain the verified interchange path. Full Procreate/Clip Studio brush-engine parity remains open, not removed from the roadmap.

| Format | Evidence | Bounded conclusion |
| --- | --- | --- |
| Procreate `.brush`, `.brushset`, `.brushlibrary` | Current official help lists these plus ABR as application inputs. | Product support in Procreate does not establish a public browser conversion contract. Need owned samples and verified extraction of actual tip/grain data, never assume a preview thumbnail is the tip. No full settings conversion claim. |
| Clip Studio `.sut`, `.sutg` | Official import documentation describes native tool/group files and ABR. | No browser decoder was established in this review. Native materials, tool dynamics and engine behavior need representative owned samples and explicit field mapping. |
| Photoshop `.abr` | Procreate/Clip Studio accept it; Krita documents tip-texture-only import. `ag-psd` contains an ABR reader. | Best next browser decoder experiment: extract sampled alpha tips into existing UNRULY image-tip controls, present unsupported settings explicitly. This does not reproduce wet-media/proprietary brush engines. |

Candidate technical reference: Agamnentzar/ag-psd `src/abr.ts`, blob `cbea0282277b004ec5385f5be311143247d84d8c`. Reviewed reader accepts ABR major6/7/9/10 with minor1/2; explicitly rejects major1/2. MIT code license reviewed at LICENSE blob `2e12d659a826dc5e68fe2ac1d916b2dd3af2137c`; its image/brush fixtures are explicitly excluded from that license. No fixture or dependency was copied into UNRULY. Bundle size, decoder resource use, malicious/truncated input handling and real-file fidelity are NOT measured here.

Next bounded experiment: isolated decoder worker with strict file/decompressed-pixel/time limits; synthetic malformed/version tests plus an owner-controlled real ABR sample; preview only decoded sampled tips; explicit alpha interpretation and settings mapping; reuse existing128px-tip/32brush/1MiBlibrary bounds; atomic confirmation and no library changes on refusal. Do not treat unsupported versions or empty/computed-only brushes as successful imports. Package/license/asset checks and actual browser/offline measurements precede any runtime inclusion. Real `.brush`/`.sut` fidelity cannot be accepted without representative inputs.

Primary sources reviewed:
- https://help.procreate.com/articles/daaqbd-importing-your-brushes — current native input types and application import workflow.
- https://help.clip-studio.com/en-us/manual_en/240_brushes/Adding_new_brushes.htm — Clip Studio tool import workflow.
- https://support.clip-studio.com/en-us/faq/articles/20200233 — accepted native/ABR formats.
- https://docs.krita.org/en/reference_manual/resource_management/resource_brushtips.html — ABR tip-only compatibility limitation.
- https://github.com/Agamnentzar/ag-psd/blob/master/src/abr.ts — concrete decoder/version/data contracts.
- https://github.com/Agamnentzar/ag-psd/blob/master/LICENSE — code versus fixture license boundary.

This assessment is documentation, not tested runtime capability or permission to weaken existing tests. No source art, knowledge graph or skills changed.

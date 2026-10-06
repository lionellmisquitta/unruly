# DUX1 independent planning readiness review

**Planning coverage is proportionate and substantially complete. IMPLEMENTATION REMAINS HELD.** I read the actual DRAWING_UX_BATCH_PLAN.md and current P01 public state/source. The thirteen requests are mapped to three dependent, runnable checkpoints and one combined preview publication. No application, test or workflow changes are authorized by this review. Current deployed source remains 5bfe786d8018200b89049d1a8073a0eb78ab6077; current supplied preview metadata head remains 994283217c2321c6de20913db8724f1a82cf4a60.

## Targeted pre-build contract corrections

1. **Make v2→v3 startup copying mechanically idempotent and resumable.** “Exactly once” plus “failed copy” is not yet a durable mapping contract. Record an immutable migration key per source namespace/board ID, target ID and durable copied/not-copied status, atomically with each successful board write. A restart after partial quota failure must retry only failed records, never duplicate completed copies or overwrite a v3 edit. Explain what appears in the gallery if only some records copied and when source selection cannot be restored. QA should prove two starts, a crash/restart after each transaction boundary, quota failure then recovery, existing v3 edits and an independently edited older v2 app. Choose these technical details without another user interview.

2. **Clarify the rollback artifact, not only its label.** “Re-pin known-good 5b source plus new uniquely named SW cache” changes the old source bytes; it cannot simultaneously be the exact old immutable source. Name either an exact previously reviewed 5b rollback with its original worker/update semantics, or a separately reviewed rollback candidate derived from 5b with the sole worker-cache change, its new identity and update smoke. In either route retain v3 storage and an exact reviewed compatible v3 recovery build; reverting to a v2-only UI is not v3 recovery. Correct the compressed “v3 boards only open in compatible v3 build” wording so incompatibility is unmistakable.

3. **Lock executable preset distinctions before U2 source.** Twelve named marks and qualitative descriptions are useful UX intent, but do not yet define their actual immutable serialized-ID→family/algorithm/parameter/pressure mapping. Add a compact original preset table with explicit defaults and bounded grain/dab budget/seed policy. Define which parameters are preset coverage versus user size/opacity, and how mean pressure in held shapes enters those mappings. QA must prove materially different marks at the same user settings without redefining the presets after test failure. Human pencil/inking feel remains the combined acceptance, not a pixel-difference proxy.

These are focused document corrections, not new features or broad gates. The plan may be surfaced for human UX confirmation now, but source must wait for both that confirmation and the named checkpoint's corrected contracts/QA handoff/readiness.

## Compatibility, rendering and performance safeguards

The independent v3 namespace and read-only legacy copying are appropriate because old v2 readers cannot preserve blend/preset meaning. Preserve absent-preset legacy drawing exactly, source arrays bottom-to-top, stable identities and active-layer semantics. New import/clipboard/eraser/transform validation must reject incompatible metadata atomically. Migration should never run on every pen frame or bypass the existing document/history/storage ceilings.

Eight native browser blend operations are bounded and specific. Scratch/paper/clear paths must reset source-over; apply layer blend/opacity once against accumulated lower content. Normal-blend/absent-preset output needs the frozen legacy reference in addition to a new full-render/cache comparison, avoiding a common-mode rewrite error. New blend cases need an independent compositing reference. Unsupported modes must fail visibly. Board identity invalidation, five surfaces/80 MiB at every setter and P01 warm-frame replay/performance criteria remain mandatory; faster new brush names cannot excuse a weakened P01 fixture. Test same-stroke start/end, layer reorder/opacity slider commits, and each sample/popover scratch use for cache invalidation.

The current retained acceleration is topmost-visible-only. Transform preview is a different board identity and may need full replay; acknowledge its measured cost rather than assuming the 1.7 ms live-ink result covers selected-point transforms. Bound preview work and test representative selection sizes against the inherited prototype envelope. No per-layer thumbnail, preset or colour-wheel canvases are permitted.

## UX lock and sequencing

The proposal makes primary controls discoverable, retains labels/keyboard alternatives and accounts for tablet width. One explicit human lock must cover the proposed layout, independent panels, top-first layers, twelve presets/HSL shade wheel, double-chord default with optional single mode, hold line/circle scope, and geometry-only uniform scaling with unchanged stroke width. Ordinary recognition thresholds and serialization choices belong to the architect; do not force the user to choose engineering parameters.

Reliable T/buttons rather than promised browser Ctrl+T override is correct. Before U3 implementation, distinguish its own transform handle/Apply/Cancel interactions from commands blocked while a preview is pending, and define the visible Apply/Cancel prompt for blocked board/update actions. Gesture timers and chord state must clear on mode/settings/board transitions as well as pointercancel/blur, and an active pen must suppress accidental palm navigation/history. The outlined independent QA categories can prove arbitration; device timing remains human feedback.

Each U1/U2/U3 handoff must bind source identity, requirement IDs, deterministic fixtures, regression, scope and current budget. Final combined QA must cover all three against the same actual candidate. Two repairs/three CI runs per checkpoint are explicit; a failed final combined regression returns to the responsible checkpoint's remaining allowance, never silently creates a fourth allowance or resets an exhausted one. Preserve all earlier P01/WB1/C06 budgets and records.

## Final hold

No implementation or deployment permission yet: the explicit human UX lock is pending, and the three targeted contracts above need resolution. Final publication still requires actual independent QA, code/security review, exact immutable Pages workflow review and hosted verification. Narrow public metadata only; historical root-state disclosure boundary remains. Main/production/G14 stay false; formal full-release count stays 0/14. A complete planning package is not a proven complete solution.

## Authoritative resolutions recheck

I read the added authoritative review resolutions. The atomic source-map/target transaction, completed-map no-overwrite rule, collision/selected-board behavior, explicit preset ID/pressure/coverage/default/work table, separately identified rollback package, compatible-v3 recovery and no-reset repair accounting resolve the three original contract gaps in principle. These are document refinements; no implementation cycle has begun and human UX lock remains pending.

Three precise consistency corrections remain before declaring the contracts fully ready:

- Current inspected v2 storage.js has **no persisted lineage/source mapping**. Its migrateLegacy skips existing IDs and preserves the foundation board ID in the v2 copy. The plan must not depend on nonexistent provenance fields. Explicitly use available stable source-board IDs to avoid duplicate foundation/v2 copies, with a stated damaged-v2/foundation fallback rule, or derive new provenance while disclosing its limits.
- Reset on “successful gesture completion” must mean the recognized history/navigation/pen action, **not the first qualifying chord's release**, whose pending all-up/count/centroid record must survive for the 350 ms double-chord window. Clear that pending record after recognition, timeout or the stated invalidators.
- The newly specified rollback recovery package introduces a scoped recovery-v3 app copy and independent worker/cache scope. Add its exact allowed path/worker metadata scope to the allowed-files section, bind its source/hash and final rollback smoke to U3's existing final QA budget, and prohibit extra unreviewed runtime behavior. Publication remains blocked if this required rollback is unproven.

These are ordinary architect-owned choices, not reasons for another user interview. Preset specificity is now sufficient for U2 contract planning; exact old pixels and physical preset feel still require the stated independent/human proof. Once the three consistency corrections are recorded, the remaining cross-batch hold is the explicit surfaced human UX lock and subsequent checkpoint-specific Gatekeeper authorization. This recheck itself authorizes neither implementation nor deployment.

## Final consistency pass

The three requested corrections are now present: dedup uses the actual stable legacy IDs with explicit previous-record/foundation recovery warnings; first-chord state has a named pending lifetime; recovery-v3 runtime/worker paths and separate immutable evidence are explicitly within U3's existing budget. These original blockers are resolved.

One concrete event-order detail must be corrected before U3 source: the current app captures touch pointers. Normal pointerup implicitly releases capture and produces lostpointercapture, so unconditional clearing on lost capture would erase the just-recorded first chord. Define unexpected capture loss while a contact is still active as cancellation; expected loss after an already processed pointerup must preserve the pending first chord. Include actual browser pointerup→lostpointercapture ordering in the gesture regression. This is an architect-owned clarification, not a user decision.

Subject to that precise correction, the complete planning contract is sufficient to surface and lock. The sole human decision remains explicit confirmation of the proposed UX; no code or deployment authorization is issued by this document. Checkpoint-specific readiness and handoff still precede each implementation slice.

## Final planning disposition

The authoritative gesture contract now distinguishes unexpected capture loss while a contact remains active from expected post-pointerup capture loss, preserving the first chord and requiring actual browser event-order regression. This closes the remaining concrete event-order concern.

**PLANNING READY FOR EXPLICIT HUMAN UX LOCK.** All identified material planning contract defects are resolved in the reviewed three-checkpoint proposal. Human confirmation remains pending; silence is not approval. No application, test, workflow or deployment changes are authorized by this disposition. After that lock, issue bounded checkpoint-specific handoffs/readiness before source implementation and retain independent QA/Gatekeeper publication review. Complete planning coverage remains distinct from proven implementation, hardware feel and full release; main/production/G14 stay false and full release count stays 0/14.

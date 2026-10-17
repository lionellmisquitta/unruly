# UNRULY — evaluate for reference

Created and last updated: 17-Oct-2026 (Asia/Kolkata).
Owner: Lionell Misquitta. Status: running evaluation register.

## How this register works

Paste repository links and ideas into the UNRULY conversation. Append each new candidate here with a stable REF ID; update existing entries rather than duplicating them. Preserve the original intent, source URL, evidence date, findings, unanswered questions and disposition. Record rejected approaches and rationale; do not silently delete candidates.

Flow: Captured → preliminary source review → bounded experiment → owner decision → approved implementation checkpoint (or hold/reject).

An evaluation roadmap item authorizes research, not integration, model hosting, extra dependencies, downloads of datasets/models, or a change to release scope. No candidate below is approved for implementation. This register does not advance CHAIN1, change its acceptance criteria, or reverse the existing deferral of BYOK AI. Independent local inference would need its own decision as well.

## Index

| ID | Reference | Owner's intended capability | Current disposition | Next evaluation |
| --- | --- | --- | --- | --- |
| REF-001 | [Pose Animator](https://github.com/yemount/pose-animator) | Animate drawn characters, including animals, from motion videos | Preliminary review; animal extension unproven | Rig/retargeting feasibility with one animal and one short licensed clip |
| REF-002 | [AnimeDrawingsDataset](https://github.com/dragonmeteor/AnimeDrawingsDataset) | Use the poses as drawing references | Hold asset ingestion pending rights clarification | Inspect pose schema and separate joint coordinates from reference images |
| REF-003 | [Anime2Sketch](https://github.com/Mukosame/Anime2Sketch) | Clean messy/freehand sketches | Candidate for a small quality experiment | Compare actual UNRULY rough sketches with extracted line art |
| REF-004 | [SC-FEGAN](https://github.com/run-youngjoo/SC-FEGAN) | Explore sketch-and-colour guided editing; exact use case undecided | Inspiration/research; reuse restricted | Pick one useful editing task and assess a permissive alternative |
| REF-005 | [Style2Paints](https://github.com/lllyasviel/style2paints) | Rapid assisted painting/colourization, inspired by Clip Studio | Candidate workflow; model/binary rights unresolved | Evaluate hint-guided flat colour and separate output layers |

Suggested evaluation order, not an approved build sequence: REF-003 and REF-005 for direct painting value; REF-002 for pose-reference usability/rights; REF-001 as a separate animation experiment; REF-004 after its use case is defined. Current delivery priorities remain authoritative in [PRODUCT_ROADMAP.md](docs/delivery/PRODUCT_ROADMAP.md).

## REF-001 — character and animal animation

**Owner intent:** Animate characters using a skeleton overlaid on the drawing. Explore animal characters: find movement videos in royalty-free libraries, extract a skeleton/motion track and import it into UNRULY for smooth movement.

**Observed from source:** The README describes browser-based TensorFlow.js animation of SVG paths using PoseNet and FaceMesh. Its predefined rig follows human pose/face keypoints. Custom illustrations must retain named joints; illustrated paths are flattened, and composite paths are unsupported. Repository metadata reports Apache-2.0 code licensing. This is evidence for a human-vector rig reference, not animal tracking or compatibility with UNRULY's native artwork.

**Proposed experiment, not demonstrated:** Yes, animal animation is technically plausible, but requires a different rig and tracking approach. Choose one species and a mostly side-on clip; identify species-appropriate keypoints; extract timed joints with confidence values; manually correct occlusions; normalize scale/orientation; smooth jitter without sliding planted feet; map the motion onto a compatible character rig. Preview a loop before considering integration. Human motion could drive a stylized biped animal, but should not be assumed to produce a natural quadruped gait.

**Candidate transfer contract:** species/rig version, joint names and parent bones, timestamps, normalized positions, confidence, rest pose, root motion, frame rate and source provenance. Decide local clip processing versus a separate preprocessing tool. No automatic video search/download or model selection has been performed.

**Acceptance questions:** How is a native raster/vector character bound to bones? What happens behind overlapping limbs? A single drawing cannot supply unseen surfaces or reliable 3D turns. Can one walk loop preserve anatomy, foot contact and proportions without damaging source art? How does skeletal deformation differ from published MOTION1 object translation? It is new scope, not existing Motion Trace functionality.

**Rights and cost checks:** Record each clip's exact license, attribution and reuse/derivative terms; royalty-free does not itself establish permission for every proposed use. Verify animal-model code, weights and training-data terms independently. Measure extraction speed, correction effort, playback latency and memory on intended devices.

Sources: [README](https://github.com/yemount/pose-animator/blob/master/README.md), README blob `d588eebdf7a2dd4f9c81779136d2676583a1d1ce`; repository metadata checked 17-Oct-2026. No prototype executed.

## REF-002 — anime pose references

**Owner intent:** Use the poses from this repository.

**Observed from source:** The README describes 2,000 annotated anime/manga examples with joint coordinates and a 1,400/100/500 train/validation/test split. Scripts download and process images using Ruby and ImageMagick; this is a dataset/tooling reference, not an animation engine. Some joint labels need mapping: `arm_left/right` mean shoulders, `leg_left/right` mean hips, and `tiptoe_left/right` mean shoe/foot tips. GitHub metadata reports no detected repository license; this is not a conclusion that every constituent asset has the same rights.

**Proposed evaluation:** Inspect coordinate conventions and coverage before building a pose-reference panel. Compare importing joint-only mannequins with displaying original images. Dataset code, annotations and downloaded artwork require separate permission checks; do not bundle images or assume coordinate redistribution is permitted. Static poses do not form a temporal motion sequence.

**Experiment acceptance:** With clearly usable samples, preview and mirror a pose, overlay a skeleton at the correct scale, and let the user draw on an independent layer. Keep pose references out of exported artwork unless explicitly included. Verify utility for the user's characters before committing to a pose-library feature.

Sources: [README](https://github.com/dragonmeteor/AnimeDrawingsDataset/blob/master/README.md), blob `524a7225ade58ed45b31121cb7bf0e9acc701058`; metadata checked 17-Oct-2026. Dataset not downloaded; licensing unresolved.

## REF-003 — messy-sketch cleanup

**Owner intent:** Clean messy sketches.

**Observed from source:** Anime2Sketch extracts sketches from illustrations/anime/manga, and its README includes freehand-sketch simplification and hand-drawn input examples. The implementation uses Python/PyTorch, CPU or NVIDIA GPU, externally downloaded weights, and a default 512-pixel input size. The README and metadata identify MIT licensing for the project. Browser-native inference, current dependency compatibility and separate weight provenance/terms have not been verified.

**Proposed evaluation:** Test rough UNRULY inputs, not just polished illustrations: repeated construction strokes, light pencil, textured brushes, crossings and small features. Compare cleanup with simpler threshold/edge/line simplification baselines. Measure unwanted line loss, invented edges, retained character identity, output resolution, CPU latency and model footprint.

**Potential integration boundary:** Create a separate candidate line-art layer with side-by-side preview, cancel and one Undo on apply. Preserve the original sketch, alpha, placement and scale. Do not overwrite source artwork. ONNX/WebGPU or a local preprocessing service is an option to investigate, not an established port or a hosted-service commitment.

Sources: [README](https://github.com/Mukosame/Anime2Sketch/blob/master/README.md), blob `32a4b6c617271681d77c977f07a435a225eead45`; metadata checked 17-Oct-2026. No weights downloaded or inference run.

## REF-004 — sketch-and-colour guided regional editing

**Owner intent:** Strong interest; precise UNRULY use case not yet defined.

**Observed from source:** SC-FEGAN demonstrates face editing/restoration using a masked region, sketch guidance and colour strokes. Its supplied interface uses Python, TensorFlow and PyQt5 with a downloaded checkpoint. The README states non-commercial educational/academic research use and describes the provided model and sample code as non-commercial. Do not infer general-purpose illustration editing or permission to ship it from the demo.

**Potential uses to choose between:** Repair a selected face region; redraw a facial detail using guiding lines; fill a small erased area using colour hints. These are suggestions, not owner-approved requirements. Animal/artwork generalization would need evidence; a face-trained model should not be assumed to work on arbitrary drawings.

**Disposition:** Keep as interaction inspiration. Before any incorporation, clarify the desired task and rights or identify an appropriately licensed alternative. If explored, generated output must remain a separate preview/layer, preserve the original, constrain changes to the selection and support cancel/Undo. No model/code reuse approved.

Sources: [README](https://github.com/run-youngjoo/SC-FEGAN/blob/master/README.md), blob `bbccb346f3469d542bb7f49395105dcacdd21220`; metadata checked 17-Oct-2026. No checkpoint executed; permission unresolved beyond stated research restrictions.

## REF-005 — rapid painting and hint-guided colourization

**Owner intent:** Rapid painting, inspired by the feature the owner uses/recognizes in Clip Studio. Exact Clip Studio feature parity is not established.

**Observed from source:** Style2Paints describes V4 line-art colourization using optional colour hints, style references and lighting, with separated colour/rendering outputs. The README distinguishes the V4.5 Windows release from a V5 preview; the preview is not proof of a released V5 implementation. It licenses code under Apache-2.0 while reserving rights in pretrained models and binary releases. The code license alone does not establish permission to embed or redistribute those weights/binaries.

**Proposed evaluation:** Start with hint-guided flat colours beneath preserved line art. Then separately evaluate shading/highlights and style-reference guidance. Compare quality and effort against UNRULY's existing gap-aware bucket/enclose-fill tools. Determine whether separated output layers can be imported directly; do not assume PSD import already exists.

**Experiment acceptance:** Preserve line art; minimize colour bleeding; keep thin-line detail and transparency; return editable separate layers within existing budgets; provide preview/cancel and atomic Undo. Measure resolution, latency, model/runtime size and processing cost before selecting browser inference, local helper or hosted inference. No AI hosting or new backend is authorized by this reference entry.

Sources: [README](https://github.com/lllyasviel/style2paints/blob/master/README.md), blob `41732edead103ec13f1f59c1ff19a67cbd56ed9d`; metadata checked 17-Oct-2026. No binary/model downloaded or tested.

## Common evaluation record for future additions

- REF ID, date, repository/reference URL and original owner idea.
- Actual capability versus requested behavior; source file/revision and observed limitations.
- Code, weights, datasets, sample assets and output rights considered separately.
- Fit with browser-first UNRULY; reuse versus adaptation versus concept-only reference.
- Smallest useful experiment, representative inputs and measurable acceptance.
- Original-art preservation, layers/masks/blends, Undo, persistence/recovery and offline behavior.
- Dependencies, latency, memory, device compatibility and recurring cost.
- Open questions, recommended next action and owner decision.
- Status and linked implementation checkpoint only after promotion; rejected alternatives retained.

## Decision log

- 17-Oct-2026: Owner requested a running evaluation register and roadmap visibility for all five references. Links and intended capabilities captured; preliminary README/metadata review completed. No feature implementation, training, dataset ingestion, knowledge-graph update or skill modification performed. No release order changed.

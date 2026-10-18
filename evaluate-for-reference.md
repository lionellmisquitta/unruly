# UNRULY — evaluate for reference

Created: 17-Oct-2026. Last evaluated: 18-Oct-2026 (Asia/Kolkata).
Owner: Lionell Misquitta. Status: running evaluation register.

## How this register works

Paste repository links and ideas into the UNRULY conversation. Append each new candidate here with a stable REF ID; update existing entries rather than duplicating them. Preserve the original intent, source URL, evidence date, findings, unanswered questions and disposition. Record rejected approaches and rationale; do not silently delete candidates.

Flow: Captured → preliminary source review → bounded experiment → owner decision → approved implementation checkpoint (or hold/reject).

An evaluation roadmap item authorizes research, not integration, model hosting, extra dependencies, downloads of datasets/models, or a change to release scope. No candidate below is approved for implementation. This register does not advance CHAIN1, change its acceptance criteria, or reverse the existing deferral of BYOK AI. Independent local inference would need its own decision as well.

## Index

| ID | Reference | Owner's intended capability | Current disposition | Next evaluation |
| --- | --- | --- | --- | --- |
| REF-001 | [Pose Animator](https://github.com/yemount/pose-animator) | Animate drawn characters, including animals, from motion videos | Source evaluation complete; separate rigging experiment, animal tracking unproven | Rig/retargeting feasibility with one animal and one short licensed clip |
| REF-002 | [AnimeDrawingsDataset](https://github.com/dragonmeteor/AnimeDrawingsDataset) | Use the poses as drawing references | Hold ingestion; joint/image permissions unresolved | Inspect pose schema and separate joint coordinates from reference images |
| REF-003 | [Anime2Sketch](https://github.com/Mukosame/Anime2Sketch) | Clean messy/freehand sketches | First external quality-trial candidate; browser integration unproven | Compare actual UNRULY rough sketches with extracted line art |
| REF-004 | [SC-FEGAN](https://github.com/run-youngjoo/SC-FEGAN) | Explore sketch-and-colour guided editing; exact use case undecided | Interaction reference only; supplied face model/research terms unsuitable for direct adoption | Pick one useful editing task and assess a permissive alternative |
| REF-005 | [Style2Paints](https://github.com/lllyasviel/style2paints) | Rapid assisted painting/colourization, inspired by Clip Studio | High-value workflow; hold direct embedding pending model terms and runtime trial | Evaluate hint-guided flat colour and separate output layers |

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

## Technical evaluation — 18-Oct-2026

**Status:** source/architecture evaluation completed for all five references. No model weights, datasets, sample-art corpus or binaries downloaded; no inference, model conversion, timing or output-quality benchmark executed. Findings distinguish observed source facts from engineering recommendations. No feature implementation, dependency installation, hosting, knowledge-graph change or release-order change.

### REF-003 — Anime2Sketch: first quality-trial candidate

**Observed beyond the README:** `test.py` defaults to512pixels and CPU; `data.py` converts inputs to RGB, resizes them to a square, then rescales the generated RGB image to original dimensions. Alpha is not retained by that path. Thus a returned2048px file can contain512px inference detail; output dimensions alone are not a quality metric. Wide artwork is distorted at model input unless an adapter crops/pads it. Output is grayscale line art, not editable native curves or a transparent UNRULY layer.

`model.py` builds an8-downsampling U-Net with64base channels. A static count of the default convolution weights/biases gives **54,405,505 parameters**, about **207.54MiB in float32 before activations/runtime**. This is an architecture estimate, not measured download size, converted-model size or peak RAM. The improved variant changes upsampling modules and is not covered by that count. `requirements.txt` points multiple packages at Git repositories rather than a reproducible pinned release set; installing it as-is would not be a controlled experiment.

**Fit:** promising for extracting candidate line art, but not proven to merge construction strokes, preserve eyes/fingers or improve a real rough drawing. Browser conversion is a separate project; no ONNX/WebGPU compatibility or tablet latency has been demonstrated. Project MIT terms are observed; confirm the exact external checkpoint's provenance/terms when selecting it.

**Smallest trial:** three owner-created crops: overdrawn construction lines, light/textured pencil, and crossings/small facial details, with a clean input as a preservation control. Compare original, default/improved candidate and a simple tonal/threshold baseline. Composite transparent inputs deliberately, preserve aspect ratio, retain an original-resolution reference and restore exact document placement. Owner judges missing/invented essential lines and actual cleanup effort; record CPU/GPU latency, checkpoint size and peak memory. Only if useful, design separate preview/cancel/one-Undo layer insertion. Do not port it to the live browser first.

### REF-005 — Style2Paints: valuable painting workflow, substantial integration gap

**Observed:** README describes V4 separated line-art, flat-colour, gradient and shading outputs/PSD. V4.5 source instructions require Python3.6, TensorFlow-GPU1.14, CUDA10/CuDNN7 and external model files. Its Python server loads several networks and exposes local HTTP routes such as `/upload_sketch` and `/request_result`; the client is a separate Cocos-based interface. The standalone Windows package avoids a manual Python install for that package, but does not turn the source into an Android/browser-only feature. V5 remains labelled preview/unreleased in the checked README.

Code is Apache-2.0; the README explicitly reserves rights in pretrained models and binary releases. Do not infer unrestricted embedding/redistribution from the code badge. No exact model package, output rights beyond source statements, deployment hardware or recurring price has been established.

**Fit:** assisted flat colouring is directly useful. Full rendering/style transfer adds another quality and control problem. Current UNRULY has no PSD import; standard PNG/JPEG import accepts sources up to2048px per side and resizes inserted artwork to at most1024px per side. Export's8192px limit does not change that import path. Native board budget remains8MiB/32layers. Blindly importing a large layered result can lose detail or exceed storage.

**Smallest trial:** same owner line-art sample, a fixed small set of colour hints, and an equal-effort comparison against existing bucket/enclose fill. Start with flat colours only. Require preserved line art, limited bleed and separate same-extent RGBA outputs with a coordinate/scale manifest. Record corrections, latency, RAM and output bytes. PSD-only output needs a separately scoped extraction/import bridge; do not assume compatibility. Prefer an isolated external trial before choosing browser conversion, desktop helper or hosted inference. Local inference may avoid per-call API fees, but hardware/setup cost is unmeasured.

### REF-002 — AnimeDrawingsDataset: useful pose idea; keep corpus on hold

**Observed:** static2D joint annotations and scripts for downloading/processing2,000images; not a motion sequence, pose generator or animation engine. Root listing has no LICENSE file and metadata provides no detected repository license. Existing README documents shoulder/hip/foot-tip naming differences. Code, annotations and constituent images need separate consideration; the absence of a license badge does not establish redistribution permission.

**Recommendation:** no bundled image/annotation ingestion yet. Existing UNRULY reference-image import can already use owner-created or otherwise usable pose images without this dataset. A later adjustable mannequin library should first use original/clearly usable poses. Prove mirror/scale/overlay utility on a handful, keep reference art separate from drawing/export, then decide whether the dataset adds enough value. Static poses cannot supply video timing.

### REF-001 — Pose Animator: useful human-rig reference; animal animation is separate scope

**Observed:** TensorFlow.js/PoseNet/FaceMesh with a predefined human rig and named SVG joints. README requires flattened illustration paths and disallows composite paths. `package.json` uses TensorFlow.js1.7-era packages and an old Parcel toolchain; direct inclusion would introduce another graphics/ML dependency stack. Browser execution is demonstrated by its source/demo, but compatibility with UNRULY's textured/raster strokes, masks, blend groups and target devices is not demonstrated.

**Recommendation:** first bind a simple owner-drawn character to a small manual rig and demonstrate one controlled loop without losing source artwork. A stylized biped can be a human-rig experiment. A natural quadruped needs species-specific joints, occlusion correction, foot-contact handling and separate tracking/retargeting; the repository does not establish these. Existing Motion Trace translates targets/cameras and is not skeletal deformation. Keep video extraction and animal animation as a separate experiment after rigging quality is proven; no automatic video/model ingestion.

### REF-004 — SC-FEGAN: retain the interaction concept, do not directly adopt this stack

**Observed:**512px face-region editing from a mask, sketch and colour guidance. Python/PyQt5/TensorFlow stack; requirements include TensorFlow1.13-era dependencies and an external checkpoint. README and LICENSE state non-commercial/research conditions for provided code/model. No arbitrary illustration/animal generalization is established.

**Recommendation:** use the interaction idea—selection + guide strokes + generated preview on a separate layer—as a reference. The exact desired task remains undecided. Do not spend on porting this face-specific legacy stack or bundle its supplied model. If a concrete task emerges, evaluate an appropriate implementation with suitable terms and preserve mask boundaries/cancel/Undo.

### Proposed decision order

1. First: external sketch-cleanup quality trial on owner artwork (REF-003). It has a simple input/output comparison and requires no live-app changes.
2. Second: hint-guided flat-colour trial (REF-005), contingent on selecting an appropriate model/runtime and resolving its stated model/binary terms.
3. Optional low-cost reference workflow: owner-created pose images using existing import; adjustable skeleton panel is a separate feature (REF-002).
4. Separate creative experiment: manual rigging, then human motion, then species-specific animal tracking (REF-001).
5. Keep SC-FEGAN as concept reference until its use case is chosen (REF-004).

These are recommendations, not approved build checkpoints. No candidate is declared production-ready. Required downstream preservation contract: source artwork unchanged; registered output placement/scale/alpha; editable separate layers within native budgets; preview/cancel/one Undo; no silent network processing.

### Evidence snapshot

Checked18-Oct-2026 against these repository heads:

| Repository | Head |
| --- | --- |
| yemount/pose-animator | `cb2be70a3501e57e66fe185daca44cc2afe18ce8` |
| dragonmeteor/AnimeDrawingsDataset | `1b79ae213280a4e5e9997d8d8722a85892e4657a` |
| Mukosame/Anime2Sketch | `50a6a128c5f66d3a25cf2a7aa67d1cb9669affd8` |
| run-youngjoo/SC-FEGAN | `1f9d47f9516f6121dc7da37aa2ffbc3013f67195` |
| lllyasviel/style2paints | `a0d164d6a8a69fa4a87139bcd193291057f4ca39` |

Files inspected: Pose Animator README/package.json/camera.js; AnimeDrawingsDataset README/root/data-directory metadata/index.html (no corpus fetched); Anime2Sketch README/LICENSE/test.py/data.py/model.py/requirements.txt; SC-FEGAN README/LICENSE/requirements.txt/demo.yaml; Style2Paints README and V4.5 README/server source. UNRULY image-import.js/model.js at `663427f5ce7eea70007aceec0f82c5a5c0205b27` supplied current import/native limits. Mutable repository URLs above can be replaced with these commit IDs for reproducible reads.

- 18-Oct-2026: owner requested evaluation of the saved links. Source evaluation completed and recommendations recorded; quality experiments remain pending actual owner inputs and an agreed runtime/checkpoint. Live application, knowledge graph and skills unchanged.

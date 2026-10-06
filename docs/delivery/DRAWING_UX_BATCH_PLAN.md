# DUX1 — Drawing workspace UX and tools batch (proposed)

6 October 2026. Planning-only continuation of hosted P01 preview v0.3.0. No app, tests, workflow, production/main or deployment change authorized by this document. Current application source: `5bfe786d8018200b89049d1a8073a0eb78ab6077`; metadata/preview head verified `994283217c2321c6de20913db8724f1a82cf4a60`. MIT, browser-first, offline/device-local remain governing decisions. This scoped document preserves prior public-state/disclosure boundaries; do not republish historical root state files.

## UX checkpoints A and B — proposed for one human lock

Dominant job: draw and edit with a pen while the canvas owns most screen space. Keep the existing canvas-workspace archetype; replace permanent multi-purpose sidebars with a narrow independently collapsible brush rail and an independently collapsible layer inspector plus contextual brush/colour popovers. Reject permanent three-wide panels because they consume drawing area; reject an icon-only radial command system because discovery and keyboard access matter. This is a reversible preview redesign, not a new navigation application.

| Region/view | Objective → primary action → arrangement |
|---|---|
| Top left | Manage board or edit artwork → Boards / Selection (Lasso) / Transform → named compact toolbar; New/Import/Export in Board menu |
| Top right | Pick active paint tool → Brush / Eraser / Layers / colour dot → compact labelled controls and anchored popovers |
| Left rail | Adjust current mark quickly → size / brush opacity / Undo / Redo → narrow rail; independent Hide/Show tools control always reachable |
| Right inspector | Organize stacking → select, drag or add layer → topmost-first compact list with selected-layer properties above it; independent Layers toggle always reachable |
| Brush library | Choose a recognizable mark → category then preset → categories alongside sample-stroke list; closes explicitly or on outside tap |
| Colour popover | Choose hue and shade → hue ring, saturation/lightness, shade swatches → wheel plus numeric/hex alternatives |
| Selection context | Manipulate selected strokes → move / scale / rotate / Apply / Cancel → compact canvas-adjacent controls, no gallery navigation |
| Paper | Choose background → Paper settings → small section in Board menu, not ahead of layers |
| Status strip | Know save, pressure, offline and recovery state → resolve named issue → unobtrusive but readable footer |

Proposed defaults: layers inspector open on wide desktop, closed on narrower/tablet canvas; left rail visible. Both toggles are independent at every breakpoint and restore within this device. Opening brush/colour popovers does not silently toggle the layer or rail state. On small phones popovers may overlay the canvas, but never cover their close control. Tool labels stay available; no placeholders for undelivered Smudge or other tools. Minimum primary touch targets44 CSS px, compact layer rows56 CSS px; a row can grow for large text. The canvas gets at least roughly70% of tablet landscape width with layers closed. Existing offline/save warnings remain visible.

Evidence sufficiency: canvas archetype, independent toggles, top-first layers, pencils/presets, lasso discoverability and hold assistance SUFFICIENT from user feedback. Exact spacing/timings and pencil feel CONDITIONAL prototype assumptions, subject to the one combined tablet test. Material layout movement is PROPOSED until explicit human lock. Do not claim that a model has approved a human-owned UX decision.

## Source inspection and all thirteen requests

| User item | Actual current behavior | Planned acceptance / slice |
|---|---|---|
| 1. New layer above Layer1 | New layers append to the model top, but rows display bottom-first | U1: display top-first; insert immediately above the active layer, select it; order survives save/reload/Undo/Redo |
| 2. Opacity + blending | Per-row opacity already exists; blending is Normal only | U1: selected-layer opacity slider+number at inspector top; Normal, Multiply, Screen, Overlay, Darken, Lighten, Difference, Exclusion |
| 3. Independent collapse | Desktop sidebars permanent; mobile one Panels toggle | U1: separate tools and layers toggles across desktop/tablet/phone; neither changes the other |
| 4. Pencil category | One sparse particle-based Pencil | U2: original HB,2B,6B presets with visibly different grain,density,pressure response; retain old Pencil rendering for old strokes |
| 5. Multiple other brushes | Ink, Pencil, Marker, Airbrush only | U2: Pen Fineliner/Technical/Brush pen; Marker Chisel/Round/Highlighter; Airbrush Soft/Firm/Mist;12 original presets,4 categories |
| 6. Compact layers | Every row repeats five action buttons and opacity | U1:56 px row with drag grip,name,status,visibility; selected properties once, rename/lock/delete/reorder alternatives in a menu |
| 7. Double tap Undo | Touch navigates only; gesture was not implemented | U3: two-finger double tap Undo,three-finger double tap Redo; optional single-chord-tap mode; recognizer cannot perform both |
| 8. Procreate-like controls | Tools/settings scattered down a wide rail | U1/U2: top-left editing,top-right painting,slim left size/opacity rail; persistent labelled Lasso/Transform and tested responsive discoverability |
| 9. Drag layer order | Up/Down buttons only | U1: drag grip works with mouse,pen,touch; insertion indicator; one completed drop=one undo; keyboard Up/Down retained as menu fallback |
| 10. Hold line/circle | Raw strokes only | U3: draw and hold pen/mouse650 ms to fit line or circle when recognition succeeds; preview before release,one stroke/undo; toggle available |
| 11. Select/transform,CtrlT | Lasso+whole-stroke move only | U3: move,uniform scale,rotate; box/corner/rotation handles,Apply/Cancel;T reliable; CtrlT only if browser delivers it,never a guarantee |
| 12. Lasso discoverability | Lasso exists on crowded rail | U1: top-left named Selection/Lasso control,visible mode indicator; existing whole-stroke active-layer scope retained |
| 13. Concepts-like wheel | Hex,HSL sliders,fixed eight swatches | U2: original hue ring + saturation/lightness controls,selected colour dot,12 current-hue shade swatches,recent8 colours,hex and numeric inputs |

## Three dependent checkpoints; one combined human review

U1 / preview candidate 0.4: layout and layers end-to-end including blend-safe schema migration. U2 / candidate 0.5 depends on U1: brush library and colour end-to-end. U3 / candidate 0.6 depends on U1+U2: gesture arbitration,held shapes,vector transforms. Each must be runnable and independently tested against its source identity. Publish ONE combined reviewed0.6 preview after all three pass; intermediate checkpoints are source snapshots, not automatically live releases. User tests once after combined deployment, using the same URL. If repair limits exhaust, stop with exact failure evidence; do not ship a partial batch as thirteen completed items.

No OPFS/scratch folder,workers/GPU rewrite,timelapse,AI,Drive,raster,smudge,watercolour,brush imports,mask,fill,blur,text or image feature sneaks into this batch. Those remain in the broader roadmap. No login/runtime packages/server added. Backend/API tests N/A; pure-engine contracts and IndexedDB/browser integration are mandatory. No paid external-model CLI/API calls.

## Shared domain, data and compatibility contract

Keep model layer arrays bottom→top; reverse only display. Add above current active index; never reverse saved arrays. Reorder references stable layer IDs and target side, validates duplicate/missing IDs and preserves active ID. Hidden/locked rows may be reordered; existing lock means drawing/erasing/transforming content prohibited, not a newly invented ban on naming/visibility/properties. No-op commands do not consume history.

Use explicit document version3 for blend/preset semantics rather than adding unknown v2 fields that old readers silently draw as Normal. New storage namespace `unruly-workspace-v3`; copy existing v2 workspace boards read-only and exactly once before creating an empty board. Preserve titles,geometry,layer order,active ID,pressure,brush/stroke opacity,paper and source identity/revision; do not rewrite or delete v2/foundation storage. Preserve selected board if it copied successfully. Failed copy leaves its source intact and visible recovery/export guidance; never mark failed durable writes Saved. Do not resync edits from an older cached app automatically over a new copy.

New readers import v1/v2/v3 with validation and new imported identities; v1/v2 become v3 with Normal blending and legacy brush behavior. v3 fields: layer `blend` whitelist; optional stroke `preset` drawn from the12 category-compatible IDs; absent preset means the frozen legacy brush behavior. Unknown presets/blends,nonfinite values,oversized or malformed documents rejected atomically. Existing32 layers/2,000 strokes/100,000 points/8 MiB board/100 boards/100 history states/16 MiB history cap remain. Clipboard/eraser fragments/transforms preserve valid brush / preset identity. All startup/save/import/recovery paths validate against the matching version. Cross-version rollback cannot display v3 effects in the old app: retains both namespaces; use the new build to recover v3 work,never silently flatten/downgrade/delete it. Explain this in update notes; JSON export is a backup,not a guarantee of old-reader compatibility.

## U1 rendering and interaction contracts

Composite each isolated layer onto the accumulated paper/lower-layer result using the selected Canvas2D blend operation and layer opacity exactly once; reset operation to source-over for all scratch/clear/paper/preview paths. Eight supported modes use original browser sRGB semantics,not a claim of bit-identical native app colour profiles. Verify operation availability; do not silently treat unsupported modes as Normal. Retained top-layer preview must match independent/full reference for every supported blend+opacity combination. If cache eligibility cannot be proved,use correct full replay and disclose performance; no approximation.

Five existing render canvases only; no canvas-per-layer/thumbnail/preset/colour wheel. UI samples use existing reusable scratch or staticSVG. Max 4096 dimension,DPR cap 2,80 MiB nominal RGBA total at every allocation assignment remain. No new per-penmove toolbar rebuilding,full-board validation or expensive sample rendering. Layer opacity previews may paint atRAF;commit once on change,avoid rebuilding the dragged slider midinput. Reorder grip drag starts after6 px displacement; tapping grip never reorder. Auto-scroll near list ends stays bounded; pointercancel/Escape restores original order. Touch list scroll works outside grip. Selection switches/reorders clear stale selections according to existing rules.

## U2 brushes and colour contracts

Presets must change the actual mark,not simply name the same brush. HB thin/light/sharp;2B denser/softer;6B broad/grainy; same colour,size,opacity,pressure test fixture distinguishes each. Fine/Technical pen prioritize clean consistent ink;Brush pen stronger pressure taper. Marker chisel uses directional broad tip,Round uses round coverage,Highlighter lower preset coverage without overwriting user's opacity control. Airbrush Soft/Firm/Mist varyfalloff/scatter. Brush family+immutablepreset ID serialized;original presets and grain algorithms only. Existing stroke with absentpreset retains exactoldpixels,not retroactivelyrestyled. Preset defaults selected explicitly; changing category is never a destructive recolour/restyle of paststrokes. Preview sample and live brush use the same renderer contract. Fixed seed/document-coordinate grain avoids sparkling between cached/full replay. Hold/shape outputs carry preset and real pressure policy.

Hue ring isSVG/CSS (not a sixthcanvas); hue,saturation,lightness andhex must stay synchronized,includingblack/white/greys. Numeric keyboard controls remain accessible when colour dragging impossible. Shades are our generated HSL tints/tones/shades; no copiedCOPIC palette/assets or proprietarybrushdata. Recent8colours stored as bounded local UIsettings,never secrets. No remote lookup tochoosecolour. Closingpopover keepschosenbrush/colour; Escape does not undo existingboardedits.

## U3 gesture,shape andtransform contracts

Gesture recognizer default = requestedDOUBLE mode. One chord:2 or3contacts overlap within120 ms; totalchord<=250 ms; eachcontactmovement<=8 CSS px; allcontactsreleased. Two qualifyingchords withsamecount within350 ms andcentroidswithin40 CSS px => one Undo/Redo. Firstchordalone doesNOTUndo. OptionalSINGLE mode firesonecommandperchord; recognizeddoubletap cannotdouble-fire inDOUBLEmode.4+contacts,slowholds,pinch/drag,pointercancel/blur,penactive or malformedchord mustnotUndo. Pencontact suppresses touchhistory/navigation topreventpalmcommands. Navigation begins once8px threshold exceeded; recognition cancelled and stored pregestureview used toavoid tap-pan drift. No boardgesture/selection commands whilea transformpreview ispending. NotificationsidentifyUndo/Redo or nohistory. Buttons/keyboardremainfallback; emptyhistorynofatalerror. Timingsnamedprototypeassumptions,devicefeelhumanverification.

Hold assistance650 ms since last movement beyond3 CSS px, minimum 4samplepoints and20 CSS px extent;fit boundedmaximum 1024arclengthresampledpoints. A line requires endpointdistance>=20 CSS px,pathlength/chord<=1.2 andmaximumperpendiculardeviation<=max(3 CSS px,3%chord). A circle requires12samples,closure<=20%diameter,radialRMS<=12%radius,maxradialerror<=25%radius,and>=300 degreesangularcoverage;reject reversals/scribbles anddegenerates;circle precedencelinesonlywhenclosedcriteriafit. Recognition usesfrozenview toconvertCSSlimits. Fitcirclecenter/radiususingboundedleast-squares,fallbackdeclineifill-conditioned. Outputcircle128segments+closure;line2points. Usemean of realreported pressure ifavailable,otherwise null; nofakehardwarepressureclaim. Shape preservescolour/preset/opacity. Showrecognizedkind; releasecommitsone shapedstroke; moving>8 CSS px afterrecognition restoresoriginalrawpath andcontinuesinking (nocomplexreshapemodeinthisslice). Escape/pointercancel/blur cancelsentiregesture withoutdocumentchange. Unrecognizedcurvesstayraw. Holdtoggle defaulton; all timersclearedonfinish/boardchange/blur. OneUndo removesthestroke,not an extra shaperepaircommand.

Transform usesexistingwhole-stroke activeeditable-layer selection. Draginsideboundsmoves;cornerhandleuniformscalesaroundoppositecorner;rotationhandle rotatesaroundboundscenter. NumericX/Ydelta, uniform scale percent, angle alternative; no skew/warp/mirroring/pointeditthisslice. Geometry-only scaling initiallykeepsstrokewidth (visible label);do notsilentlyclampwidth or promisebitmapresampling. Scale0.05..20,finite angle<=360degrees,all coordinatesremainwithinexistingdocumentlimits. Previewisnonpersistent,frozenoriginal+affinegeometry,RAFcoalesced;boundedvalidationoncommit,one Apply=one history entry. EnterApply/EscapeCancel;canceldoesnotalterrevision/save/history. Startingboardtransition,import,update ordelete whiletransformpending mustrequireApply/Cancel,not discardpreviewor silentlysaveit. Layerhidden/locked/staleselectionrejectsatomically. ClipboardandUndoRedo preservepressure,presets and layers. SelectionretainedafterApply whenstillvalid. ReliableunmodifiedT shortcut onlyoutsideeditablecontrols; buttonsalwaysaccessible. CtrlTtreatedasbest-effortonlywhenkeydownreceivedwithcanvasfocus;ChromeassignsCtrlTnewtab andwecannotclaimglobaloverride.

## Allowed file changes and executable proof

Builderappfiles: prototypes/browser-workspace/{index.html,style.css,app.js,model.js,render.js,selection.js,storage.js,sw.js,README.md}; add focused pure{brushes.js,gestures.js,shapes.js} onlywhere they own namedcontracts. Preserve existing modules; do not introduceframeworks. UpdateSWassetlist/version fornew files andexplicitSaved-update safety. QA owns tests/browser-workspace/{model.test.mjs,selection.test.mjs,browser.test.cjs,selection.browser.cjs,performance.browser.cjs,new drawing-ux test files,server.cjs onlyfixtures},independentdeterministicfixturesandworkflowtestcommands. BuildernevereditsQAverdicts. Existinglocks/frozenreferencefixtureunchanged;schema-related testexpectationsmaychangeonlywithQA justification/newlegacycompatibilitycases. No unrelatedgovernance/security/nativefiles allowed.

QA handoff perU1/U2/U3 mustbindactual sourceSHA+hashes,requirementsUXIDs,controlled fixtures,test plan/buildidentity/artifactandrepaircounts. Required categories: puremodelhistory/schema/import/limits; actualChromiumdesktop/tablet/phone journeys withmouse/pen/touchpointersequences; storage migration/recovery/quota/concurrent tabs/save-reload/offline/update; independentpixels for8blends+legacyfourbrushes+newpresets; allP01cacheinvalidations/zero-replaywarmframes/80 MiBeverysetter cap/pairedbenchmark/fastpathregression; keyboardfocus/accessibility/control discoverability; maliciousimportnotexecuted. Syntheticpenpressure isbrowsercontracttesting,not physicalpressure proof. RealbrowserChromeCtrlTdelivery is recordedseparately fromsynthetickeydown; testT asmandatory path. No backend inventedto tick achecklist.

Budget percheckpoint:max2source-repairbatches,3CIruns;isolatedsame-modelQA/Gatekeeper disclosed,zeroexternalpaidcalls. Everyfailure retained; applicationdefectsreturnBuilder. Readinessmustbeindependent BEFORE sourcechanges. Final QA mustverify combinedsource,not just individuallygreenbranches. Final Gatekeeper consumesactualresults/security+code review before immutable previewdeployment. Main/fullproduct/productionauthorizationremainfalse. Humanfeedback batchedonceafterall three or sooner onlyif instability forcesreplan.

## Versioning, deployment androllback

Plan-onlysourcecommit first;independentreadinessreport next,thenexplicitUXhumanlock andbuildscopeauthorization. RecordU1/U2/U3 versionledger,parent/sourceSHA,alltestidentities and append-onlyrepair/developmentnotes; maintainincrementalknowledgedelta. Connector-backedrepository lacks tag-writecapability: createverifiedcheckpointversionbranches,never callthem annotatedtags. OnefinalPagesworkflowpins exacttestedcombinedcommit+HEADassertion,deploysonownerallowed existingpreviewbranch,prototype-onlyartifact. Verifyhostedruntimehashes and draw/save/reload+updatepreservation. Publishhuman testcard: compactindependentpanels/layers;HB2B+penpresets/colourwheel;doubletap/history/holdshapes/lasso/transform. PhysicalWindows/Android pen feel awaitsuser,never certifiedbydesktopautomation.

Rollback:re-pin Pages known-good5bfe source plusnew uniquelynamedSWcache for explicit update;preservebothv2/v3localstores. v3boardsonlyopenincompatiblev3build;keepthemrecoverable and exportable,noautomaticdowngrade. Do notpurgecaches orstorage tofixrelease. If schema migration orframe budgetfails,holdpublication andstopboundedrepair/replan.

## External pattern evidence (official docs, retrieved6October2026)

- Procreate Interface: https://help.procreate.com/en/procreate/handbook/interface-gestures/interface — painting top-right,editingtop-left,leftsize/opacity/UndoRedo,canvasfocus.
- Procreate Gestures: https://help.procreate.com/procreate/handbook/interface-gestures/gestures — defaulttwofingerSINGLEtapUndo/threefingerSINGLEtapRedo,draw-and-hold. Our DOUBLEdefault followsuser preference;not falselycalledexactdefaultProcreate.
- Procreate Layers Interface: https://help.procreate.com/procreate/handbook/layers/layers-interface — layerprimaryselection/thumbnail/controlroles.
- Procreate QuickShape: https://help.procreate.com/procreate/handbook/guides/quickshape — recognizeheldshape;nativeeditshape broaderthanourinitialline/circle scope.
- Clip Studio Layers: https://help.clip-studio.com/en-us/manual_en/180_layers/Using_layers.htm — propertiesbar forselectedlayer,stackedrows,tabletgripreorder.
- Clip Studio Blend Modes: https://help.clip-studio.com/en-us/manual_en/180_layers/Blending_modes.htm — modesoperateagainstlowerlayercontent.
- Concepts Colors: https://concepts.app/en/manual/colors — colourdotopenswheel,HSL/RGBmodels,dynamicshadepalettes. OurHSLwheel/shadesoriginal andbrowseradapted.
- HiPaint officialmanual landing: https://www.aige-hipaint.com/support/manual — surfacedbroadbrush/layercapabilities;no detailedinteractionpage verified,so no unsupportedclaimofexactHiPaintcontrolparity.
- Chrome officialshortcuts: https://support.google.com/chrome/answer/157179?hl=en — Ctrl+Topensnewtab;do notpromisebrowserreservedshortcutoverride.

These are pattern references,not permission tocopy source/assets/brushes orproofthattheir performance automaticallyapplieshere. Currentstateiscode-inspected;device screenshotnotavailable,thisisnot a completedtabletusabilitystudy.


## Independent review resolutions — authoritative contract precisions

These precisions resolve the independent readiness/QA findings above; they supersede any shorthand in earlier sections. They do not lock the UX or authorize code.

### Resumable, non-destructive migration

`unruly-workspace-v3` owns a persistent migration map keyed by source namespace + source board ID. Each map entry records source revision, source database revision, target board ID and completed-copy identity. The map entry and target board write must commit in ONE IndexedDB transaction. Restart retries only unmapped source boards; a completed mapping never overwrites later v3 edits. A failed transaction leaves neither a completion marker nor a partial target. Preserve source IDs within the isolated namespace when available; resolve a target collision using a new identity recorded in the map, never replacing existing data. Preserve last-selected source board through its map only if the copied target exists; otherwise show the partial-copy warning and recoverable board list.

If v2 storage exists, migrate its boards first. If only `unruly-foundation` exists, read v1 directly and convert into v3 without creating/writing an intermediate v2 database. If both exist, use actual stable source IDs: a foundation ID present in a valid v2 board is already copied and is skipped; there is no existing persisted v2 migration map. Unmatched valid foundation boards may be copied with their own new v3 migration keys. For damaged v2 current records, validate the previous record first and mark recovery explicitly. If both are invalid but a same-ID foundation source is valid, copy that older source with a visible warning that newer v2 edits were not recovered; preserve every source record unchanged. Source stores are read-only. Test empty, partial, quota-denied, interrupted, restart, repeated, collision, selected-board and damaged-source cases. Failed copy never causes an empty new board to be presented as successful migration.

### Gesture anchors and layout safety

Double-tap350ms means first chord's ALL-UP timestamp to second chord's FIRST-DOWN timestamp. Overlap120ms is first-to-last contact down within each chord;250ms is first down to final up; centroids are calculated from the contact start positions. Every contact must be released before another chord qualifies. Single mode and double mode are mutually exclusive.

Reset chord state and shape timers on pointercancel, blur, tool-mode change, board transition, or UNEXPECTED lost pointer capture while that contact is still active. Normal lostpointercapture after its recorded pointerup must preserve the pending first chord. U3 includes an actual-browser captured-touch pointerup → lostpointercapture → second-chord ordering regression; do not use a synthetic sequence that omits normal release. Reset shape state after a completed pen stroke. A first qualifying tap chord retains its pending state until the second chord, a disqualifying event or the350ms timeout; only the completed Undo/Redo gesture clears that pending pair. Mode changes cannot take effect during an active gesture. Rail/layer toggles, popovers that change canvas geometry, and layer mutations are disabled or deferred while a pen gesture/held-shape/reorder drag is active; never change document coordinates underneath a captured pen. A pending transform allows only its own handles, numeric transform controls, Apply and Cancel; toggles and board-affecting actions are disabled with an Apply/Cancel hint. Tool changes after Apply/Cancel work normally. No indefinite hidden deferred command is replayed later without another user action.

Rows use44px targets inside a56px minimum row, increasing height at200% text zoom. Long names truncate visually with accessible full names; rename fields and action menus provide the full text. A compact row does not squeeze six buttons into unusable icons. A grip supports explicit dragging, while the remainder allows scrolling. The independent toggles remain reachable from the top toolbar when their panels are hidden.

### Immutable preset mapping before U2

The IDs below are the complete initial set, matched to the stored family. Common pressure width rule is `minWidth + (1 - minWidth) * pressure^exponent`, with null pressure giving full nominal width. All footprint radii stay within nominal size/2 so selection bounds do not understate brush extent. Presets never mutate old strokes. Coverage is intrinsic brush coverage multiplied by the user's opacity once, not a replacement for that control. Grain uses the existing deterministic document-coordinate hash with fixed seed173.

| Family | Immutable ID / displayed name | Mark parameters | Default size / opacity |
|---|---|---|---|
| Pencil | pencil-hb / HB | Grain12 particles/dab, coverage0.35, hard dot0.55units, step max(0.5,size*0.18); pressure min0.25, exponent1 | 3 /100% |
| Pencil | pencil-2b /2B | Grain20 particles/dab, coverage0.55, dot0.75units, same step; pressure min0.20, exponent1 | 5 /100% |
| Pencil | pencil-6b /6B | Grain28 particles/dab, coverage0.75, dot1.0units, same step; pressure min0.18, exponent1 | 9 /100% |
| Pen | ink-fineliner / Fineliner | Round continuous ink, coverage1; pressure min0.65, exponent1 | 3 /100% |
| Pen | ink-technical / Technical | Round continuous ink, coverage1; pressure min0.85, exponent1 | 2 /100% |
| Pen | ink-brush / Brush pen | Round continuous ink, coverage1; pressure min0.10, exponent1.5 | 6 /100% |
| Marker | marker-chisel / Chisel | Directional rectangular tip within circular footprint, coverage1; pressure min0.60, exponent1 | 12 /100% |
| Marker | marker-round / Round | Round dabs, coverage0.85, step max(0.5,size*0.2); pressure min0.50, exponent1 | 10 /100% |
| Marker | marker-highlighter / Highlighter | Directional broad chisel, coverage0.25, same step; pressure min0.80, exponent1 | 16 /100% |
| Airbrush | airbrush-soft / Soft | Radial stops0:coverage0.25,0.5:0.10,1:0; step max(0.5,size*0.3); pressure min0.25, exponent1 | 20 /100% |
| Airbrush | airbrush-firm / Firm | Radial stops0:coverage0.45,0.6:0.30,1:0; same step; pressure min0.25, exponent1 | 14 /100% |
| Airbrush | airbrush-mist / Mist | Deterministic24 scatter particles/dab, coverage0.15, step max(0.5,size*0.3); pressure min0.25, exponent1 | 28 /100% |

These are prototype mark parameters, subject to the single human brush-feel review. Clamp individual grain particle placement inward so its full footprint remains inside the nominal radius. Shared brush definitions own category validation, sampling step, pressure response, footprint and replay work accounting; model and renderer must not disagree on the replay budget. Maximum20,000 dabs per stroke remains; additionally cap particle operations at600,000 per stroke. Unknown IDs reject atomically. First selection loads the listed defaults; subsequently restore the user's last size/opacity for that preset on this device. Show the loaded settings and provide Reset preset defaults. Settings changes affect future strokes only and do not consume board history. Every preset has a visible original sample; HB/2B/6B require human feel acceptance as well as deterministic distinction.

### Exact rollback identity and v3 recovery

The old rollback source is5bfe, but a safety cache-version change creates a NEW rollback commit. Never claim this modified package has the immutable5b identity. Prepare it from exactly5b plus the reviewed SW cache-version adjustment and a separately scoped `/recovery-v3/` copy of the immutable combined v3 build. Record all files/hashes and the resulting rollback commit before final publication. The recovery copy accesses the same v3 IndexedDB namespace on this origin, but uses its own SW registration scope and cache-name prefix; neither SW may delete the other's caches. No third-party storage writes or lossy downgrade. QA must prove that both v2 and v3 work remain accessible after rollback and that recovery reload/offline works. If this artifact is not proven, Gatekeeper must hold publication rather than claim a ready rollback.

### Repair accounting

Final combined regression is part of U3's maximum3 CI runs and2 source repairs, not a new budget. Findings attributable to U1/U2 also count against the responsible checkpoint's remaining source-repair allowance. Do not reset consumed P01/WB1/C06 allowances. Record the exact attribution, consumed budgets and stop condition in the batch development notes. Documentation-only planning corrections are not source repairs; no implementation cycle has begun.

### Human lock and change control

The user receives the layout mockup plus three-checkpoint summary. One explicit confirmation locks only these surfaced choices: top-left Lasso/Transform, top-right Brush/Eraser/Layers/Colour, narrow independent left rail, compact top-first layers with selected properties, category presets/colour wheel, requested double-tap default and geometry-only initial vector scaling. Native reserved CtrlT parity is not promised. Do not treat silence as final UX lock. After the human lock, independent Gatekeeper records the bounded implementation authorization. Ordinary implementation details and independently reviewed repairs then proceed without asking the user after every checkpoint. Human physical testing remains one combined card at the end.


### Recovery artifact scope clarification

The rollback candidate alone may add `prototypes/browser-workspace/recovery-v3/` with the exact final v3 runtime files and a separately reviewed SW scope/cache-prefix adjustment, and may change its top-level old-source SW cache version. The recovery candidate is a different immutable source from both5b and the final normal v3 source. No runtime dependency, privileged API or native executable is introduced. Bind the entire rollback artifact's hashes and run its update/offline/source-store-preservation/recovery browser checks in U3's existing CI/repair budget. The final combined normal source and the separate rollback source require their own exact test evidence; neither is assumed proven by the other. This path is a rollback safety artifact, not an extra feature checkpoint or budget reset.


## User-selected reference update —6October2026

The user selected the Procreate Fundamentals PDF UI/icons/layers/behaviour. `PROCREATE_REFERENCE_UX_UPDATE.md` now supersedes the earlier visual mockup and conflicting visual contracts. The old mockup is historical. Independent readiness must review the bounded reference additions; the single-vs-double gesture default awaits the user. App/test/workflow unchanged; no implementation or deployment occurred.

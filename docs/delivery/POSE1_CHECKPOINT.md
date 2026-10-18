# POSE1 — Editable drawing pose references

Owner-requested checkpoint, 18 October 2026. Status: scope and source shortlist recorded; application implementation and source-data imports not yet built or published. EXPORT1 remains the live release. This advances pose references ahead of the earlier ML-cleanup trial recommendation; all existing roadmap requirements and explicit deferrals remain.

## Outcome
Reusable movable skeleton references for drawing human/cartoon/anime characters and zoo animals. Extract permitted joint annotations or motion frames; do not require the source ML application, training, inference, subscriptions or runtime AI calls.

## Required behavior
- Separate Pose mode (move joints while preserving bone lengths) and Proportions mode (head/body ratio, torso, neck, shoulder/hip width and limb lengths). Save character profiles independently of poses; support adult, child, chibi and custom proportions.
- Retarget joint angles to profiles, with visible handling of changed hand/foot endpoints. Optional endpoint pins must report unreachable targets without stretching silently.
- Adjustable line of action, chest/shoulder and pelvis guides, hip shift and torso twist. Curved, angular, neutral and exaggerated styling are available to every character. Gender does not impose shoulder tilt, hip tilt or an S-curve.
- Move, rotate in 2D, scale, mirror, hide, lock and set opacity; save variants and import/export versioned pose sets. Front, side and three-quarter references are separate views; 2D rotation does not synthesize a new camera view.
- Skeletons are drawing references, with explicit exclusion from final artwork exports by default. Define persistence, backup, Undo and recording behavior before implementation; preserve original artwork and existing export behavior.
- Sword reference attachment at the hand, with editable length/orientation. Starter actions: guard, overhead and diagonal swing, thrust, lunge, follow-through, airborne strike, landing, dodge, running and jumping. These are requested authored starter poses, not a claim that every source contains them. Two-hand grip needs a specified pin/conflict policy.
- Animal rig families: quadruped, primate, bird and reptile, with species profiles and optional appendage chains such as trunk, tail and wings. Do not force animals onto a human skeleton. Standing, walking, sitting, sleeping, eating, looking toward and interacting with a child remain required starter categories.

## Delivery slices
1. POSE1A: shared validated pose/profile format, human editor and authored action starters, proportions/retargeting, reference transforms and save/reopen.
2. POSE1B: animal family rigs, species profiles and zoo starter poses. A quadruped importer must not be presented as complete bird/reptile/appendage support.
3. POSE1C: permitted external annotation/motion conversion, source attribution and curated searchable packs.
These slices retain the whole requested feature; none is cancelled or deferred. Bound pack sizes and measure interaction performance before selecting limits.

## Source register — reviewed 18 October 2026
| Source | Located material | Integration status |
| --- | --- | --- |
| [CMU subject 02, trial 07](https://mocap.cs.cmu.edu/search.php?subjectnumber=2) | Official catalog lists swordplay with AMC/C3D motion resources | Coordinate/motion candidate. Verify exact file, skeleton, terms and attribution before conversion; sample frames and project to named 2D views. Catalog indexed successfully; direct page fetch timed out in this review. No motion downloaded. |
| [POSEMANIACS sword, female](https://www.posemaniacs.com/tools/viewer/poses/01HRXSD7S9RBMJGNN16S9AZWY1) / [male](https://www.posemaniacs.com/tools/viewer/poses/01HRXSD7S8EZMK69RVS334RZTD) | Same wide-stance sword pose 0000978 on two models | Useful drawing references. Exportable joint coordinates/model redistribution permission not established; do not scrape or bundle. |
| [POSEMANIACS jumping knee](https://www.posemaniacs.com/tools/viewer/poses/01GBVYJ0MACCT1BFW4YW891BN3) / [twisting jump](https://www.posemaniacs.com/tools/viewer/poses/01GBVYHM55Z4ZG6NT7Q0JHG1E1) | Dynamic action and torso-twist references | Visual references; same unresolved joint/model redistribution boundary. |
| [PoseMy.Art anime](https://posemy.art/anime-character-poses/) / [sword fight](https://posemy.art/sword-fight-poses/) | Stylized pose collections; official homepage advertises OpenPose export | Investigate whether export is coordinates or a rendered pose map, and exact usage terms, before writing an importer or redistributing a pack. |
| [AP-10K](https://github.com/AlexTheBad/AP-10K) | 10,015 annotated images, 54 species, 17 keypoints; COCO-style annotations; repository states CC-BY-4.0 | Strong animal annotation candidate. Preserve attribution and source IDs; review actual annotation package before bundling. Only tail root, no complete tail/trunk/wing chain. Some standardized limb labels differ from anatomical joints across species; map explicitly. No dataset/model downloaded. |
| [AnimeDrawingsDataset](https://github.com/dragonmeteor/AnimeDrawingsDataset) | Previously reviewed static annotated anime drawings | Dataset redistribution terms remain unresolved. Keep evaluation entry; do not bundle coordinates assuming extraction removes rights requirements. |

## Import contract and acceptance
Version, rig family/species, named view, normalized coordinate convention, semantic joint IDs, parent links, visibility/missing status, rest lengths, profile, tags and source URL/ID/license/attribution are required. Missing/occluded coordinates must not become real joints at zero. Motion conversion must preserve original provenance and distinguish sampled versus authored poses.

Reject malformed/nonfinite coordinates, cycles, duplicate joints, incompatible rigs and invalid lengths atomically. Verify fixed-length dragging, unreachable pins, left/right mirroring and mirror twice, profile round trips, pose retargeting, species-specific chains, backup/reopen and offline use. Browser checks cover pen/phone selection, reference/artwork separation and default export exclusion. Preserve existing cumulative assertions and native recovery behavior.

## Next engineering action
Pin fresh main and create a bounded POSE1A change record with impact, allowed files and regression obligations; inspect canvas/reference, persistence and export callers before implementation. This document is a checkpoint definition, not passing tests or a released pose editor. Owner artwork trial, physical/long-session validation and all other roadmap gaps remain open. No graph or skill changes.

# VIDEO1 UX baseline

## UX baseline — scoped existing-panel extension
Evidence sufficient: user approved video/framing/codec/cancellation/storage-budget checkpoint. Single progressive section inside Timelapse, no new navigation or wizard. Options: all-content default, current selection crop, recorded navigation;360p/720p;auto/MP4/WebM;reuse idle/speed. Preparing -> exporting/progress -> ready/download (explicit click) or cancelled/error with retry. Prior ready file cleared on new attempt, close releases it. Cancel/Escape/hidden tab/blur abort and release frames/encoder/surfaces; no partial download. Close blocked only while preparing/exporting; Cancel always reachable, fieldset disables conflicting controls, keyboard focus on Cancel then progress/download. Export pauses capture/replay and never mutates live preview. Browser without WebCodecs keeps recording/replay/backup working. Bounded existing styles reused; no visual redesign. Prototype/browser validation on320px and desktop before publication. Continuous stroke animation/audio remain open. No silent duration truncation.


Revision2: active-source replay over current other Virtual Group sources. Existing styled Download button; no visual redesign. Owner-approved checkpoint; focused phone/desktop/keyboard/cancel/offline tests passed.

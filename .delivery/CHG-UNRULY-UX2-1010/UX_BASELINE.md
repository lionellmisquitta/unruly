# Locked interaction scope

Normal layer selection sets drawing layer and exclusive transform scope. Ctrl/Cmd-click or checkbox toggles inclusion without switching the drawing layer; at least one layer remains included. Selection IDs clear when scope changes. Layer inclusion and drawing activation are distinct visible states.

Lasso selects whole intersected strokes on all included layers. Transform opens an Apply/Cancel draft with shared centre. Two-finger movement over 8 CSS pixels admits pinch, twist and translation relative to initial finger midpoint; single finger outside handles does not navigate during draft. Two/three-finger taps retain local history. Any third touch during an active two-finger edit rolls it back. Preserve the earlier second-finger handle takeover fix.

All included layers must be visible and unlocked before lasso/write admission. No implicit layer merge. Paste uses active drawing layer. Board switching resets ephemeral scope. No whole-canvas rotation.

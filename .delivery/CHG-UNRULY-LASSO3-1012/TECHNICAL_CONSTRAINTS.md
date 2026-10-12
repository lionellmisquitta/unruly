# Locked repair constraints

- Selected window <=1024 per side and1MP at original document scale
- Complement <=16 occupied1024 tiles; sequential readback and existing8MiB document/16MiB history/80MiB renderer limits
- No schema migration or graph/native/storage changes
- Atomic Apply and one Undo; selecting/Cancel preserve original editable strokes
- No silent fallback to Whole objects or downsampling

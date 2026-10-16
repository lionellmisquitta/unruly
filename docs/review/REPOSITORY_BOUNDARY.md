# Repository boundary

Confirmed personal destination: https://github.com/lionellmisquitta/unruly.git
Visibility: private. Default branch: main.

Use a separate checkout/folder in VS Code. Existing organizational GitLab projects retain their own remotes. Do not modify global Git routing or the existing work repository.

Required future controller preflight: inspect every fetch and push URL, including explicit pushurl settings; require an allowlisted personal GitHub destination; fail before a write on an unexpected remote. Account for Git URL rewrite configuration and hooks. Use named branches and explicit destinations; never choose a remote by proximity to the active VS Code workspace. Credentials remain outside version control.

This is a required controller contract. No executable push guard or local laptop configuration has been installed or tested yet.

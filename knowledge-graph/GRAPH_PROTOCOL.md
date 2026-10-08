# Graph-aware continuation protocol

Canonical JSONL lives on knowledge/unruly-kgp. Read CURRENT_GRAPH.json + HANDOVER + manifest before work; verify revision and hash. Retrieve anchor → bounded traversal → supporting evidence. Avoid rescanning unchanged source or whole conversations.

Accumulate small deltas during work; merge after a meaningful decision/checkpoint closeout or explicit user request. Preserve original IDs/created_at; update changed records’ updated_at, append prior values to changelog, preserve superseded/rejected/unknown states. Never promote passing source tests to hardware or successful hosted update without corresponding evidence.

Use UTC ISO8601 canonical timestamps plus Asia/Kolkata display timestamps. Do not invent the time of historical decisions. New versions retain package created_at and advance updated_at/revision_id. Regenerate both viewers only at export milestones, validate KGP + scope + inlineJS, then update current pointer with content/package/manifest hashes.

Repo originals are project evidence only. Never store private user boards, credentials or API keys. Graph is a decision/context memory, not a merge authority. Main/build branches change only under source-bound delivery scope.

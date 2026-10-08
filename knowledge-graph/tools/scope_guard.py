#!/usr/bin/env python3
import argparse
import json
import re
import sys
from pathlib import Path

SAMPLE_FILES = {"main.py", "service.py", "models.py", "repository.py"}
SAMPLE_COMMUNITIES = {"application greeting service", "user model definition", "user repository access"}
TEST_WORDS = {"test", "smoke", "sample", "demo", "example", "pilot"}
STOP = {"knowledge", "graph", "application", "system", "project", "package", "the", "and", "for", "of"}


def read_jsonl(path: Path):
    if not path.exists():
        return []
    rows = []
    for line in path.read_text(encoding="utf-8").splitlines():
        if line.strip():
            rows.append(json.loads(line))
    return rows


def tokens(text):
    return [x for x in re.findall(r"[a-z0-9]+", str(text).lower()) if len(x) >= 3 and x not in STOP]


def main():
    ap = argparse.ArgumentParser(description="Check whether a KGP's sources plausibly match its declared topic and reject known sample-graph leakage.")
    ap.add_argument("package_dir")
    ap.add_argument("--strict", action="store_true", help="Treat weak topic/source overlap as a failure instead of a warning.")
    args = ap.parse_args()

    root = Path(args.package_dir).resolve()
    manifest_path = root / "manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8")) if manifest_path.exists() else {}
    entities = read_jsonl(root / "graph/entities.jsonl")
    sources = read_jsonl(root / "evidence/source_inventory.jsonl")

    name = str(manifest.get("name") or root.name)
    name_tokens = set(tokens(name))
    is_test_package = bool(name_tokens & TEST_WORDS)

    source_names = []
    source_files = []
    community_names = []
    searchable = []
    for s in sources:
        for key in ("original_name", "locator", "package_path", "origin"):
            if s.get(key):
                source_names.append(str(s.get(key)))
                searchable.append(str(s.get(key)))
    for e in entities:
        searchable.extend([str(e.get("name") or ""), str(e.get("entity_type") or ""), str(e.get("description") or "")])
        attrs = e.get("attributes") or {}
        for key in ("source_file", "graphify_source_file"):
            if attrs.get(key):
                sf = Path(str(attrs.get(key))).name
                source_files.append(sf)
                searchable.append(str(attrs.get(key)))
        if attrs.get("community_name"):
            community_names.append(str(attrs.get("community_name")))
            searchable.append(str(attrs.get("community_name")))

    sf_set = {x.lower() for x in source_files}
    comm_set = {x.lower() for x in community_names}
    known_sample = (
        len(entities) <= 30
        and len(SAMPLE_FILES & sf_set) >= 3
        and len(SAMPLE_COMMUNITIES & comm_set) >= 1
    )

    corpus = " ".join(searchable).lower()
    matched_tokens = sorted(t for t in name_tokens if t in corpus)
    explicit_expected = manifest.get("scope", {}).get("expected_terms") if isinstance(manifest.get("scope"), dict) else None
    expected_terms = [str(x).lower() for x in explicit_expected or [] if str(x).strip()]
    expected_hits = [x for x in expected_terms if x in corpus]

    status = "PASS"
    reasons = []
    warnings = []

    if known_sample and not is_test_package:
        status = "FAIL"
        reasons.append("Known Graphify smoke-test fingerprint detected in a package whose name is not marked as test/sample/demo.")

    if expected_terms and not expected_hits:
        msg = "None of manifest.scope.expected_terms were found in graph/source metadata."
        if args.strict:
            status = "FAIL"
            reasons.append(msg)
        else:
            warnings.append(msg)

    if name_tokens and not matched_tokens and len(entities) > 0 and not is_test_package:
        warnings.append("Declared package topic has no obvious lexical overlap with source inventory or graph metadata. Verify that the correct graph was supplied.")
        if args.strict:
            status = "FAIL"
            reasons.append("Strict mode requires topic/source overlap.")

    result = {
        "status": status,
        "package_name": name,
        "entity_count": len(entities),
        "source_count": len(sources),
        "known_sample_fingerprint": known_sample,
        "topic_tokens": sorted(name_tokens),
        "topic_matches": matched_tokens,
        "expected_terms": expected_terms,
        "expected_term_matches": expected_hits,
        "reasons": reasons,
        "warnings": warnings,
    }
    print(json.dumps(result, indent=2))
    if status == "FAIL":
        sys.exit(2)


if __name__ == "__main__":
    main()

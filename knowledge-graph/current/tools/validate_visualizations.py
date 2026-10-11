#!/usr/bin/env python3
import argparse, json, re, shutil, subprocess, tempfile
from pathlib import Path

SCRIPT_RE = re.compile(r"<script(?:\\s[^>]*)?>(.*?)</script>", re.I|re.S)

def check_html(path: Path):
    text = path.read_text(encoding="utf-8", errors="replace")
    scripts = SCRIPT_RE.findall(text)
    if not scripts:
        return {"file": str(path), "scripts": 0, "status": "failed", "error": "No inline script found"}
    node = shutil.which("node") or shutil.which("nodejs")
    if not node:
        # Still ensure obvious unresolved placeholders are absent.
        bad = [x for x in ("__DATA__", "__TITLE__") if x in text]
        if bad:
            return {"file": str(path), "scripts": len(scripts), "status": "failed", "error": f"Unresolved placeholders: {bad}"}
        return {"file": str(path), "scripts": len(scripts), "status": "warning", "warning": "Node.js unavailable; full JavaScript syntax check skipped"}
    for i, script in enumerate(scripts):
        # Skip pure external/import-only tags; current viewers use inline scripts.
        with tempfile.NamedTemporaryFile("w", suffix=".js", encoding="utf-8", delete=False) as f:
            f.write(script)
            temp = Path(f.name)
        try:
            r = subprocess.run([node, "--check", str(temp)], text=True, capture_output=True)
        finally:
            temp.unlink(missing_ok=True)
        if r.returncode:
            return {"file": str(path), "scripts": len(scripts), "status": "failed", "script_index": i, "error": (r.stderr or r.stdout).strip()}
    return {"file": str(path), "scripts": len(scripts), "status": "passed", "engine": Path(node).name}

def main():
    ap=argparse.ArgumentParser(description="Smoke-check generated graph HTML and inline JavaScript syntax.")
    ap.add_argument("files", nargs="+")
    args=ap.parse_args()
    results=[check_html(Path(x).resolve()) for x in args.files]
    print(json.dumps({"results":results}, indent=2))
    if any(r["status"]=="failed" for r in results):
        raise SystemExit(1)

if __name__=="__main__": main()

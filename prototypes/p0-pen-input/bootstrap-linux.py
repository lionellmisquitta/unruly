#!/usr/bin/env python3
"""Extract verified Ubuntu Qt/CMake packages into a user-owned tool prefix.

No sudo, apt install, maintainer scripts, system writes or global PATH changes.
Run on Ubuntu 26.04 with an already configured official Ubuntu package index.
"""
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import sys
from datetime import datetime, timezone

PREFIX = Path.home()/'.local/share/unruly/toolchains/ubuntu-26.04-qt6'
CACHE = PREFIX.parent/'downloads-ubuntu-26.04-qt6'
ROOT = Path(__file__).resolve().parents[2]
EV = ROOT/'prototypes/p0-pen-input/evidence/native-wslg-2026-10-03'

def command(argv, cwd=ROOT):
    p = subprocess.run(argv, cwd=cwd, capture_output=True, text=True, timeout=600)
    return {'argv':argv,'exit_code':p.returncode,'stdout':p.stdout,'stderr':p.stderr}

def main():
    EV.mkdir(parents=True, exist_ok=True)
    if PREFIX.exists():
        raise SystemExit(f'Prefix exists; inspect the saved manifest before reusing: {PREFIX}')
    simulation = command(['apt-get','-s','install','--no-install-recommends',
                          'qt6-base-dev','qt6-qpa-plugins','cmake','ninja-build'])
    (EV/'dependency-simulation.json').write_text(json.dumps(simulation,indent=2)+'\n')
    if simulation['exit_code']:
        raise SystemExit('APT simulation failed')
    packages = re.findall(r'^Inst (\S+) \((\S+) ',simulation['stdout'],re.M)
    if not packages or any(not re.fullmatch(r'[a-zA-Z0-9+.:~_-]+',p+v) for p,v in packages):
        raise SystemExit('Unexpected package list')
    metadata = []
    for package, version in packages:
        p = command(['apt-cache','show',package+'='+version])
        records = p['stdout'].split('\n\n')
        candidates = [r for r in records if f'Version: {version}\n' in r+'\n']
        if p['exit_code'] or not candidates:
            raise SystemExit('Missing official package metadata: '+package)
        record = candidates[0]
        expected = re.search(r'^SHA256: (\w+)$',record,re.M)
        filename = re.search(r'^Filename: (.+)$',record,re.M)
        if not expected or not filename:
            raise SystemExit('Missing package checksum')
        metadata.append({'package':package,'version':version,
                         'sha256':expected.group(1),'archive_filename':filename.group(1)})
    CACHE.mkdir(parents=True,exist_ok=True)
    print(f'Downloading {len(packages)} official Ubuntu packages into user-owned cache',flush=True)
    download = command(['apt-get','download']+[p+'='+v for p,v in packages],cwd=CACHE)
    (EV/'dependency-download.json').write_text(json.dumps(download,indent=2)+'\n')
    if download['exit_code']:
        raise SystemExit('Download failed; see dependency-download.json')
    by_hash = {hashlib.sha256(p.read_bytes()).hexdigest():p for p in CACHE.glob('*.deb')}
    for item in metadata:
        path = by_hash.get(item['sha256'])
        if path is None:
            raise SystemExit('Downloaded package checksum mismatch: '+item['package'])
        item['downloaded_filename'] = path.name
    PREFIX.mkdir(parents=True)
    for item in metadata:
        result = command(['dpkg-deb','--extract',str(CACHE/item['downloaded_filename']),str(PREFIX)])
        if result['exit_code']:
            (EV/'dependency-extract-failure.json').write_text(json.dumps(result,indent=2)+'\n')
            raise SystemExit('Package extraction failed')
    manifest = {'recorded_at_utc':datetime.now(timezone.utc).isoformat(),
                'prefix':str(PREFIX),'source':'Configured official Ubuntu APT indexes; every archive matched index SHA256',
                'system_installation':False,'maintainer_scripts_executed':False,
                'employer_policy_changes':False,'packages':metadata}
    (PREFIX/'unruly-packages.json').write_text(json.dumps(manifest,indent=2)+'\n')
    (EV/'toolchain-packages.json').write_text(json.dumps(manifest,indent=2)+'\n')
    print('Verified and extracted tools: '+str(PREFIX),flush=True)

if __name__=='__main__':
    main()

#!/usr/bin/env python3
"""Run retained Linux model and independent native Qt fixtures in a named phase."""
import datetime
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import sys

ROOT=Path(__file__).resolve().parents[2]
PROBE=Path(__file__).resolve().parent
PREFIX=Path.home()/'.local/share/unruly/toolchains/ubuntu-26.04-qt6'
EV=PROBE/'evidence/native-wslg-2026-10-03'
phase=sys.argv[1]
if not re.fullmatch(r'[a-z0-9-]+',phase):raise SystemExit('Invalid evidence phase')
RUN=EV/phase
RUN.mkdir(exist_ok=False)
BUILD=PROBE/'build/native-wslg-2026-10-03'/phase
BUILD.mkdir(parents=True,exist_ok=True)
lib=PREFIX/'usr/lib/x86_64-linux-gnu'
headers=PREFIX/'usr/include/x86_64-linux-gnu/qt6'
env=os.environ.copy()
env.update(LD_LIBRARY_PATH=str(lib),QT_PLUGIN_PATH=str(lib/'qt6/plugins'),QT_QPA_PLATFORM='xcb')

def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def command(name,argv):
    started=datetime.datetime.now(datetime.timezone.utc).isoformat()
    p=subprocess.run(argv,cwd=ROOT,env=env,capture_output=True,text=True,timeout=90)
    r={'argv':argv,'cwd':'<repository>','exit_code':p.returncode,'stdout':p.stdout,
       'stderr':p.stderr,'started_at_utc':started,
       'completed_at_utc':datetime.datetime.now(datetime.timezone.utc).isoformat()}
    (RUN/(name+'.json')).write_text(json.dumps(r,indent=2)+'\n')
    print(name,'exit',p.returncode,flush=True)
    return r

paths=['main.cpp','CMakeLists.txt','model_tests.cpp','qa-claude/adversarial_tests.cpp',
       'qa-claude/capacity_regression.cpp','qa-native-wslg/native_tests.cpp',
       'qa-native-wslg/tablet_tracking_diagnostic.cpp']
before={p:digest(PROBE/p) for p in paths}
(RUN/'source-before.json').write_text(json.dumps(before,indent=2)+'\n')
if phase=='diagnostic':
    suites=[('diagnostic','qa-native-wslg/tablet_tracking_diagnostic.cpp',0,True)]
else:
    suites=[('existing10','model_tests.cpp',10,False),
            ('adversarial9','qa-claude/adversarial_tests.cpp',9,False),
            ('capacity2','qa-claude/capacity_regression.cpp',2,False),
            ('native8','qa-native-wslg/native_tests.cpp',8,True)]
results=[]
for label,path,count,qt in suites:
    binary=BUILD/label
    argv=['g++','-std=c++17','-Wall','-Wextra','-Werror','-pedantic']
    if qt:argv+=['-fPIC']+['-I'+str(headers/p) for p in ['', 'QtWidgets','QtGui','QtCore']]
    argv+=[str(PROBE/path),'-o',str(binary)]
    if qt:argv+=['-L'+str(lib),'-lQt6Widgets','-lQt6Gui','-lQt6Core']
    compiled=command(label+'-compile',argv)
    ran=command(label+'-run',[str(binary)]) if compiled['exit_code']==0 else None
    cases=re.findall(r'^PASS (.+)$',ran['stdout'],re.M) if ran else []
    if label=='capacity2' and ran and 'RESULT PASS, 0 failed checks' in ran['stdout']:
        cases=re.findall(r'^DONE (QA-CAP-\d+) .+$',ran['stdout'],re.M)
    results.append({'suite':label,'compile_exit':compiled['exit_code'],
                    'run_exit':ran['exit_code'] if ran else None,
                    'passed_cases':len(cases),'planned_cases':count,'case_ids':cases,
                    'binary_sha256':digest(binary) if binary.exists() else None,
                    'diagnostic_only':phase=='diagnostic'})
    if ran:print(ran['stdout'],flush=True)
after={p:digest(PROBE/p) for p in paths}
assert before==after, 'Source changed while tests executed'
(RUN/'source-after.json').write_text(json.dumps(after,indent=2)+'\n')
(RUN/'results.json').write_text(json.dumps({'phase':phase,'suites':results,
    'source_unchanged_during_execution':True,'scope':'Linux model + synthetic native Qt adapter; no hardware/Windows/Android claim'},indent=2)+'\n')

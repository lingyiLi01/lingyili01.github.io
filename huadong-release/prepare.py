"""Reproduce the tested release, verify every file, and preserve it in Pages."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import hashlib,json,shutil,subprocess,tempfile

source=Path(__file__).resolve().parent
manifest=json.loads((source/'baseline.json').read_text())
expected=json.loads((source/'expected-output.json').read_text())
destination=Path('site/huadong-game')
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
if destination.exists():
    for name,sha in expected.items():
        assert digest(destination/name)==sha, 'Unexpected existing release: '+name
    print('Existing complete release verified.')
else:
    with tempfile.TemporaryDirectory() as tmp:
        work=Path(tmp)
        for folder in ['original','out','tools']:(work/folder).mkdir()
        def fetch(item):
            name,sha=item;p=work/'original'/name;p.parent.mkdir(parents=True,exist_ok=True)
            if name=='index.html':shutil.copy2(source/'baseline-index.html',p)
            else:subprocess.run(['curl','-fLsS','--retry','3','--max-time','90',manifest['url']+name,'-o',str(p)],check=True)
            assert digest(p)==sha,'Online baseline changed: '+name
        with ThreadPoolExecutor(max_workers=6) as pool:list(pool.map(fetch,manifest['files'].items()))
        shutil.copytree(work/'original',work/'out',dirs_exist_ok=True)
        for name in ['build_fix.py','ui-fix.js']:shutil.copy2(source/name,work/'tools'/name)
        shutil.copy2(source/'experience-fix.css',work/'out/experience-fix.css')
        subprocess.run(['python3',str(work/'tools/build_fix.py')],check=True)
        for name,sha in expected.items():assert digest(work/'out'/name)==sha,'Release mismatch: '+name
        shutil.copytree(work/'out',destination)
        print('All 66 release files match the tested local build.')

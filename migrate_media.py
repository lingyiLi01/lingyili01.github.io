import concurrent.futures, hashlib, json, pathlib, subprocess, zipfile
root=pathlib.Path('site')
with zipfile.ZipFile('website.zip') as z:
    z.extractall(root)
manifest=json.loads(pathlib.Path('media-index.json').read_text())
def fetch(item):
    key,meta=item
    p=root/key
    def valid():
        return p.exists() and p.stat().st_size==meta['size'] and hashlib.sha256(p.read_bytes()).hexdigest()==meta['sha256']
    if not valid():
        p.parent.mkdir(parents=True,exist_ok=True)
        subprocess.run(['curl','-fL','--retry','5','--retry-all-errors','--max-time','180','-sS','https://li-lingyi-portfolio.zesty-grape-2908.chatgpt.site/'+key,'-o',str(p)],check=True)
    if not valid(): raise RuntimeError('Media integrity check failed: '+key)
    return key
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
    for i,key in enumerate(pool.map(fetch,manifest.items()),1):
        if i%25==0: print(f'Verified {i}/{len(manifest)} media files',flush=True)
print('All media verified',flush=True)

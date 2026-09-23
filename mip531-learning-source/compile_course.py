from pathlib import Path
import json, hashlib
ROOT=Path(__file__).resolve().parent

def parse(path):
    out=[];u=None;q=None
    for raw in path.read_text().splitlines():
        if not raw.strip():continue
        tag,line=raw[0],raw[1:]
        vals=line.split('|')
        if tag=='@':
            if u:out.append(u)
            ident,title,case,pages,scope=vals
            u=dict(id=ident,title=title,case=case,pages=pages,scope=scope,nodes=[],evidence=[],questions=[]);q=None
        elif tag=='!':u['role'],u['scenario']=vals
        elif tag=='=':u['summary']=line
        elif tag=='#':u['nodes'].append(dict(zip(['label','text','fact'],vals)))
        elif tag=='$':u['evidence'].append(dict(zip(['label','text'],vals)))
        elif tag=='~':u['variation']={'labels':vals[::2],'results':vals[1::2]}
        elif tag=='>':u['worked']=line
        elif tag=='?':
            q={'id':u['id']+'-q'+str(len(u['questions'])+1),'stem':line,'options':[]};u['questions'].append(q)
        elif tag in '+-':
            text,why=vals;q['options'].append({'id':str(len(q['options'])),'text':text,'why':why,'correct':tag=='+'})
        else:raise ValueError(raw)
    if u:out.append(u)
    return out

units=[]
for path in sorted((ROOT/'content').glob('*.txt')):units+=parse(path)
for u in units:
    assert len(u['questions'])==5,u['id']
    if not u['id'].startswith('F'):
        assert len(u['nodes'])==3,u['id']
        assert len(u['evidence'])>=2,u['id']
    for q in u['questions']:
        assert len(q['options']) in (4,5),q['id']
        assert 2<=sum(o['correct'] for o in q['options'])<len(q['options']),q['id']
        q['options'].sort(key=lambda o:hashlib.sha256((q['id']+o['text']).encode()).hexdigest())
meta=json.loads((ROOT/'course_meta.json').read_text())
meta['lessons']=[u for u in units if not u['id'].startswith('F')]
meta['finalQuestions']=[dict(q,sourceUnit=u['id'],scope=u['scope'],pages=u['pages']) for u in units if u['id'].startswith('F') for q in u['questions']]
meta['finalGroups']=[{k:u[k] for k in ('id','title','scope','pages')} for u in units if u['id'].startswith('F')]
(ROOT/'site').mkdir(exist_ok=True)
(ROOT/'site'/'course.js').write_text('window.COURSE = '+json.dumps(meta,ensure_ascii=False,separators=(',',':'))+';\n')
print('Compiled:',len(meta['lessons']),'lessons,',sum(len(u['questions']) for u in meta['lessons']),'core questions,',len(meta['finalQuestions']),'final questions')

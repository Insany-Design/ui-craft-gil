#!/usr/bin/env python3
import json,re,shutil
from pathlib import Path
ROOT=Path(__file__).resolve().parent
CONTENT=ROOT/'source'/'content'
ORDER=['fundamentos','arquitetura-informacao','principios-visuais','cores','tipografia','design-mobile','tipos-telas','usabilidade-acessibilidade','construcao-completa']
modules=[]
for f in sorted(CONTENT.glob('part-*.json')):
    d=json.loads(f.read_text()); modules.extend(d['modules'])
modules.sort(key=lambda m:ORDER.index(m['id']) if m['id'] in ORDER else 999)
ids=set()
for m in modules:
    assert m['id'] in ORDER, ('Unknown module',m['id'])
    for l in m['lessons']:
        assert l['id'] not in ids, ('Duplicate',l['id']);ids.add(l['id'])
        for k in ['title','summary','objectives','sections','examples','exercise','sources']: assert k in l,(l['id'],k)
        assert l['sections'] and l['examples'] and l['sources'],l['id']
        for s in l['sections']:
            assert '<script' not in s['body'].lower() and not re.search(r'\bon\w+\s*=',s['body'],re.I),l['id']
            assert '<details' not in s['body'].lower(), l['id']
        for e in l['examples']:
            assert e['url'].startswith('https://'),l['id']
            if e.get('visualHtml'):
                assert '<script' not in e['visualHtml'].lower() and not re.search(r'\bon\w+\s*=',e['visualHtml'],re.I),l['id']
                assert not re.search(r'<(?:button|input|a|iframe|details|style)\b', e['visualHtml'], re.I),l['id']
            if e.get('localImagePath'):
                name=Path(e['localImagePath']).name
                assert (ROOT/'source'/'real-assets'/name).exists(),name
                e['originalImageUrl']=e.get('image')
                e['image']='real-assets/'+name
                del e['localImagePath']
        for s in l['sources']:assert s['url'].startswith('https://'),l['id']
        text=' '.join(s['body'] for s in l['sections'])+' '.join(e['analysis'] for e in l['examples'])
        # Reading estimate reflects prose, not exercise execution.
        words=len(re.findall(r'\S+',re.sub('<[^>]+>',' ',text)))
        l['minutes']=max(4,round(words/180))
        l['wordCount']=words
course={'title':'UI mobile — Do fundamento à interface','edition':'2026-10','modules':modules}
(ROOT/'dist').mkdir(exist_ok=True)
for name in ['index.html','styles.css','examples.css','app.js']:shutil.copy2(ROOT/'source'/name,ROOT/'dist'/name)
(ROOT/'dist'/'course.js').write_text('window.COURSE = '+json.dumps(course,ensure_ascii=False).replace('</','<\\/')+';\n')
(ROOT/'dist'/'course.json').write_text(json.dumps(course,ensure_ascii=False,indent=2))
if (ROOT/'source'/'real-assets').exists():shutil.copytree(ROOT/'source'/'real-assets',ROOT/'dist'/'real-assets',dirs_exist_ok=True)
print(json.dumps({'modules':len(modules),'lessons':len(ids),'words':sum(l['wordCount'] for m in modules for l in m['lessons']),'files':len(list((ROOT/'dist').rglob('*')))},ensure_ascii=False))

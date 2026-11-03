#!/usr/bin/env python3
import json,re,shutil
from pathlib import Path
ROOT=Path(__file__).resolve().parent
GUIDE_DIST=ROOT/'guide-dist'
CONTENT=ROOT/'source'/'content'
ORDER=['fundamentos','principios-visuais','percepcao-acao-memoria','densidade-espacamento','design-mobile','tipografia','cores','profundidade-superficies','refinamento-optico','identidade-interface','arquitetura-informacao','tipos-telas','usabilidade-acessibilidade','construcao-completa']
modules=[]
for f in sorted(CONTENT.glob('part-*.json')):
    d=json.loads(f.read_text()); modules.extend(d['modules'])
modules.sort(key=lambda m:ORDER.index(m['id']) if m['id'] in ORDER else 999)
ids=set()
for m in modules:
    assert m['id'] in ORDER, ('Unknown module',m['id'])
    for l in m['lessons']:
        assert l['id'] not in ids, ('Duplicate',l['id']);ids.add(l['id'])
        for k in ['title','summary','objectives','sections','examples','sources']: assert k in l,(l['id'],k)
        assert l['sections'] and l['examples'] and l['sources'],l['id']
        for s in l['sections']:
            assert '<script' not in s['body'].lower() and not re.search(r'\bon\w+\s*=',s['body'],re.I),l['id']
            assert '<details' not in s['body'].lower(), l['id']
        for e in l['examples']:
            e.pop('designNote',None)
            if e.get('url'): assert e['url'].startswith('https://'),l['id']
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
glossary_path=CONTENT/'glossary.json'
glossary=json.loads(glossary_path.read_text())['glossary'] if glossary_path.exists() else []
course={'title':'Fundamentos de UI para iniciantes','edition':'2026-10-craft','modules':modules,'glossary':glossary}
(GUIDE_DIST).mkdir(exist_ok=True)
for name in ['index.html','styles.css','examples.css','realistic-examples.css','app.js']:shutil.copy2(ROOT/'source'/name,GUIDE_DIST/name)
(GUIDE_DIST/'course.js').write_text('window.COURSE = '+json.dumps(course,ensure_ascii=False).replace('</','<\\/')+';\n')
(GUIDE_DIST/'course.json').write_text(json.dumps(course,ensure_ascii=False,indent=2))
# Restrict published output to referenced assets and their required licenses.
asset_source=ROOT/'source'/'real-assets'
asset_dist=GUIDE_DIST/'real-assets'
asset_dist.mkdir(exist_ok=True)
public_names=['index.html','styles.css','examples.css','realistic-examples.css','app.js','course.js','course.json']
asset_text='\n'.join((GUIDE_DIST/name).read_text() for name in public_names)
asset_names=set(re.findall(r'real-assets/([A-Za-z0-9._-]+)',asset_text))
asset_names.update(['AlignUI-MIT.txt','Inter-OFL.txt'])
for name in asset_names:
    assert (asset_source/name).is_file(),('Missing published asset',name)
    shutil.copy2(asset_source/name,asset_dist/name)
expected=set(public_names)|{'real-assets/'+name for name in asset_names}
for output in (GUIDE_DIST).rglob('*'):
    if output.is_file() and output.relative_to(GUIDE_DIST).as_posix() not in expected:
        output.unlink() # Derived output only; source originals remain untouched.
for directory in sorted((GUIDE_DIST).rglob('*'),reverse=True):
    if directory.is_dir() and not any(directory.iterdir()):directory.rmdir()
assert len(expected)==12,('Unexpected public output count',expected)
print(json.dumps({'modules':len(modules),'lessons':len(ids),'words':sum(l['wordCount'] for m in modules for l in m['lessons']),'publicFiles':len(expected)},ensure_ascii=False))

#!/usr/bin/env python3
"""Build only the current craft edition. Previous editorial sources remain in source/."""
import json,re,shutil
from pathlib import Path
ROOT=Path(__file__).resolve().parent
OUT=ROOT/'guide-dist'
course=json.loads((ROOT/'source/content/craft.json').read_text())
videos=json.loads((ROOT/'source/content/videos.json').read_text())
for chapter in course['chapters']:
 chapter['videos']=videos.get(chapter['id'],[])
 for video in chapter['videos']:
  assert re.fullmatch(r'[A-Za-z0-9_-]{11}',video['id']),video
  assert video['source'].startswith('https://'),video
ids=set()
for c in course['chapters']:
 assert c['id'] not in ids,c['id']
 ids.add(c['id'])
 text=c['introduction']+' '.join(' '.join([v['title'],v['context'],v['observation'],v['application']]) for v in c['concepts'])
 c['minutes']=max(2,round(len(re.sub('<[^>]+>',' ',text).split())/180))
for alias,target in course['aliases'].items():assert target in ids,(alias,target)
OUT.mkdir(exist_ok=True)
expected={'index.html','styles.css','atlas.css','app.js','atlas.js','course.js','course.json'}
for name in ['index.html','styles.css','atlas.css','app.js','atlas.js']:shutil.copy2(ROOT/'source'/name,OUT/name)
(OUT/'course.js').write_text('window.COURSE = '+json.dumps(course,ensure_ascii=False).replace('</','<\\/')+';\n')
(OUT/'course.json').write_text(json.dumps(course,ensure_ascii=False,indent=2)+'\n')
assets=['insany-logo.svg','inter-regular.woff2','inter-medium.woff2','inter-semibold.woff2','Inter-OFL.txt']
(OUT/'real-assets').mkdir(exist_ok=True)
for name in assets:
 shutil.copy2(ROOT/'source/real-assets'/name,OUT/'real-assets'/name)
 expected.add('real-assets/'+name)
for f in OUT.rglob('*'):
 if f.is_file() and f.relative_to(OUT).as_posix() not in expected:f.unlink()
for d in sorted(OUT.rglob('*'),reverse=True):
 if d.is_dir() and not any(d.iterdir()):d.rmdir()
print(json.dumps({'chapters':len(ids),'files':len(expected),'edition':course['edition']}))

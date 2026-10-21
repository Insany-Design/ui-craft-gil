#!/usr/bin/env python3
"""Independent structural/editorial regression checks, not visual certification."""
import json,re
from pathlib import Path
from html.parser import HTMLParser
ROOT=Path(__file__).resolve().parent
ORDER=['fundamentos','principios-visuais','densidade-espacamento','design-mobile','tipografia','cores','profundidade-superficies','refinamento-optico','identidade-interface','arquitetura-informacao','tipos-telas','usabilidade-acessibilidade','construcao-completa']
NEW={'profundidade-superficies','refinamento-optico','identidade-interface','densidade-espacamento'}
VOID={'area','base','br','col','hr','img','input','link','meta','param','source','track','wbr'}
class Markup(HTMLParser):
 def __init__(self,label):super().__init__(convert_charrefs=True);self.stack=[];self.label=label;self.figures=0
 def handle_starttag(self,tag,attrs):
  assert tag not in {'script','iframe','object','embed','style','base','link','meta'},(self.label,'executable markup',tag)
  for key,value in attrs:
   assert not key.lower().startswith('on'),(self.label,'event attribute',key)
   if value and key.lower() in {'href','src','xlink:href','action','formaction'}:
    assert not re.match(r'\s*(javascript|vbscript|data)\s*:',value,re.I),(self.label,'unsafe URL',value)
   if value and key.lower()=='style':assert not re.search(r'expression\s*\(|javascript\s*:|@import',value,re.I),(self.label,'unsafe style')
  self.figures+=tag=='figure'
  if tag not in VOID:self.stack.append(tag)
 def handle_startendtag(self,tag,attrs):
  self.handle_starttag(tag,attrs)
  if tag not in VOID:self.handle_endtag(tag)
 def handle_endtag(self,tag):
  assert self.stack and self.stack[-1]==tag,(self.label,'unbalanced HTML',tag,self.stack)
  self.stack.pop()
def markup(text,label):
 p=Markup(label);p.feed(text);p.close();assert not p.stack,(label,p.stack)
def criteria(items,label):
 assert isinstance(items,list) and 3<=len(items)<=5,(label,'expected 3–5 observable criteria')
 for item in items:
  assert isinstance(item,str) and len(item.strip())>=20,(label,item)
  assert not re.match(r'^(?:entende|compreende|conhece|aprende|sabe)(?:\s|$)',item,re.I),(label,'unobservable criterion',item)
def prose(value):
 if isinstance(value,dict):return ' '.join(prose(v) for k,v in value.items() if k not in {'id','url','visualHtml','image','localImagePath'})
 if isinstance(value,list):return ' '.join(map(prose,value))
 return str(value)
modules=[]
for f in sorted((ROOT/'source/content').glob('part-*.json')):modules.extend(json.loads(f.read_text())['modules'])
assert len(modules)==13 and len({m['id'] for m in modules})==13,'Exactly 13 unique modules required'
assert set(m['id'] for m in modules)==set(ORDER),'Unexpected/missing module IDs'
lessons=[];examples=0
for m in modules:
 assert isinstance(m.get('objective'),str) and len(m['objective'])>=30,(m['id'],'objective')
 assert isinstance(m.get('rationale'),str) and len(m['rationale'])>=30,(m['id'],'rationale')
 criteria(m.get('criteria'),m['id'])
 refs=m.get('references');assert isinstance(refs,list) and 2<=len(refs)<=4,(m['id'],'references count')
 for ref in refs:assert ref.get('title') and ref.get('url','').startswith('https://'),(m['id'],ref)
 assert len({r['url'] for r in refs})==len(refs),(m['id'],'duplicate references')
 if m['id'] in NEW:assert 3<=len(m['lessons'])<=4,(m['id'],'new lesson count')
 for l in m['lessons']:
  lessons.append(l);assert l['title'] and l['summary'] and l['objectives'],l['id']
  if m['id'] in NEW:assert ':' in l['title'],(l['id'],'title must state concept and purpose')
  assert l['sections'] and l['examples'] and l['sources'],l['id']
  ex=l['exercise'];assert ex['brief'] and ex['steps'] and ex['deliverable'],l['id'];criteria(ex['criteria'],l['id'])
  for section in l['sections']:assert section['title'];markup(section['body'],l['id']+' section')
  for e in l['examples']:
   examples+=1;assert e.get('scenario') and e.get('comparisonFocus') and e.get('analysis'),l['id']
   markup(e['analysis'],l['id']+' analysis')
   if e.get('visualHtml'):markup(e['visualHtml'],l['id']+' figure')
   # Runtime-generated figures are checked after rendering by test-app.cjs.
   assert not e.get('url') or e['url'].startswith('https://'),l['id']
  for s in l['sources']:assert s.get('url','').startswith('https://'),l['id']
  text=prose(l)
  forbidden=r'\b(?:Figma|microcopy|UX writing|design systems?|tokens?|métricas de uso|analytics)\b'
  assert not re.search(forbidden,text,re.I),(l['id'],'out-of-scope topic',re.search(forbidden,text,re.I).group() if re.search(forbidden,text,re.I) else '')
  # Gestalt's established shared-motion perceptual demonstration is deliberately retained.
  if l['id']!='gestalt-agrupamento':assert not re.search(r'\b(?:motion|microinteraç(?:ão|ões)|animaç(?:ão|ões))\b',text,re.I),(l['id'],'out-of-scope motion teaching')
ids=[l['id'] for l in lessons];assert len(ids)==len(set(ids)),'Duplicate lesson IDs'
built=json.loads((ROOT/'guide-dist/course.json').read_text())
assert [m['id'] for m in built['modules']]==ORDER,'Published progression differs from approved sequence'
assert {l['id'] for m in built['modules'] for l in m['lessons']}==set(ids),'Build/source mismatch'
print(json.dumps({'modules':len(modules),'lessons':len(lessons),'examples':examples,'checks':['13 unique ordered blocks','4 new blocks with 3–4 lessons each','objectives, rationale, 3–5 observable criteria and 2–4 references','lesson exercise criteria','balanced nonexecutable HTML','no forbidden curriculum topics outside preserved Gestalt demonstration','source/build IDs match'],'limits':['Observable criteria still require editorial judgment.','Runtime figures and progress are checked by test-app.cjs.','No visual, AA contrast or real-browser certification.']},ensure_ascii=False,indent=2))

#!/usr/bin/env python3
import json, subprocess,re
from pathlib import Path
from html.parser import HTMLParser
ROOT=Path(__file__).resolve().parent
class Markup(HTMLParser):
 def __init__(self):super().__init__();self.stack=[];self.phones=0
 def handle_starttag(self,tag,attrs):
  attrs=dict(attrs)
  assert tag not in ['button','input','a','iframe','script','style'],tag
  if 'demo-phone' in attrs.get('class','').split() or 'phone' in attrs.get('class','').split():self.phones+=1
  if tag not in ['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']:self.stack.append(tag)
 def handle_startendtag(self,tag,attrs):pass
 def handle_endtag(self,tag):
  assert self.stack and self.stack[-1]==tag,(tag,self.stack)
  self.stack.pop()
lessons=0;phones=0
for f in (ROOT/'source/content').glob('part-*.json'):
 current=json.loads(f.read_text())
 prior=json.loads(subprocess.check_output(['git','show','HEAD:'+str(f.relative_to(ROOT))],cwd=ROOT))
 for m,oldm in zip(current['modules'],prior['modules']):
  assert m['id']==oldm['id']
  for l,old in zip(m['lessons'],oldm['lessons']):
   lessons+=1
   for k in old:
    if k!='examples':assert l[k]==old[k],(l['id'],'changed theory/metadata',k)
   for e in l['examples']:
    assert e.get('scenario') and e.get('comparisonFocus'),(l['id'],'missing teaching framing')
    q=Markup();q.feed(e['visualHtml']);assert not q.stack,(l['id'],q.stack)
    assert q.phones>=2,(l['id'],'needs a comparison or sequence of screens')
    phones+=q.phones
    assert any(x in e['analysis'].lower() for x in ['teste','testar','peça','pergunte']),l['id']
assert lessons==40,lessons
print(json.dumps({'lessons':lessons,'phoneFrames':phones,'checks':['theory/IDs/order/exercises unchanged','all scenarios and comparison focus present','balanced noninteractive HTML','2+ UI screens per lesson','test guidance present']},ensure_ascii=False,indent=2))

#!/usr/bin/env python3
"""Structural checks rebuilt after recovery; no browser-validation claims."""
import json,re
from pathlib import Path
from html.parser import HTMLParser
ROOT=Path(__file__).resolve().parent
class Markup(HTMLParser):
 def __init__(self):super().__init__();self.stack=[];self.phones=0
 def handle_starttag(self,tag,attrs):
  attrs=dict(attrs)
  assert tag not in ['button','input','a','iframe','script','style'],tag
  if 'rx-phone' in attrs.get('class','').split():self.phones+=1
  if tag not in ['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']:self.stack.append(tag)
 def handle_startendtag(self,tag,attrs):pass
 def handle_endtag(self,tag):
  assert self.stack and self.stack[-1]==tag,(tag,self.stack)
  self.stack.pop()
lessons=0;phones=0;controls=0
for f in (ROOT/'source/content').glob('part-*.json'):
 current=json.loads(f.read_text())
 prior={'modules':json.loads((ROOT/'RESTORATION-STRUCTURE.json').read_text())['parts'][f.name]}
 assert {m['id'] for m in current['modules']}=={m['id'] for m in prior['modules']},f.name
 old_ids={l['id'] for m in prior['modules'] for l in m['lessons']}
 current_ids=[l['id'] for m in current['modules'] for l in m['lessons']]
 assert old_ids<=set(current_ids),f.name
 assert len(current_ids)==len(set(current_ids)),f.name
 assert set(current_ids)-old_ids<= {'icones-imagens-significado'},f.name
 for m in current['modules']:
  for l in m['lessons']:
   lessons+=1;assert l['title'],l['id']
   for e in l['examples']:
    assert e.get('scenario') and e.get('comparisonFocus'),l['id']
    q=Markup();q.feed(e['visualHtml']);assert not q.stack,(l['id'],q.stack)
    assert q.phones==1,(l['id'],'requires one applied screen');phones+=q.phones
    assert any(x in e['analysis'].lower() for x in ['teste','testar','peça','pergunte']),l['id']
    assert not re.search('A · PROBLEMA|B · AJUSTE|O que mudou|versão B',e['visualHtml']+e['analysis']),l['id']
    controls+=int('data-demo-control=' in e['visualHtml'])
assert (lessons,phones,controls)==(41,41,4),(lessons,phones,controls)
print(json.dumps({'lessons':lessons,'phoneFrames':phones,'controlledExamples':controls,'checks':['all 40 legacy IDs preserved; only approved icon/image lesson added','balanced noninteractive product markup','one applied screen per lesson','scenarios and test guidance present','no stale universal A/B wording']},ensure_ascii=False,indent=2))

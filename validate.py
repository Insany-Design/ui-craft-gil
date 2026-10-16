from html.parser import HTMLParser
from pathlib import Path
import re,xml.etree.ElementTree as ET
p=Path(__file__).parent/'dist';text=(p/'index.html').read_text()
class Check(HTMLParser):
 def __init__(self):super().__init__();self.ids=[];self.refs=[];self.imgs=[];self.links=[];self.topic=0
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.append(a['id'])
  if tag=='a':self.links.append(a.get('href',''))
  if tag=='img':self.imgs.append(a)
  if tag=='section' and 'topic' in a.get('class','').split():self.topic+=1
c=Check();c.feed(text)
assert c.topic==37
assert len(c.ids)==len(set(c.ids))
for a in [a for a in c.imgs if a.get('id')!='zoom-image']:assert a.get('alt') and (p/a['src']).is_file()
for link in c.links:
 if link.startswith('#'):assert link[1:] in c.ids,link
 assert 'notion' not in link and not any(x in link for x in ['{','}',"'"]),link
for img in (p/'assets').glob('*.svg'):ET.parse(img)
assert len(list((p/'assets').glob('*.svg')))==37
assert all(x not in text for x in ['sourceNotionUrl','mainNotionUrl','<page','app.notion.com'])
print(f'PASS: {c.topic} topics, 37 valid SVGs, {len(c.imgs)} images with alt and local files, unique IDs, valid internal anchors, public-only reference links, no private Notion metadata.')

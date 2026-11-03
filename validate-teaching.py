#!/usr/bin/env python3
"""Independent structural/editorial regression checks, not visual certification."""
import json,re
from pathlib import Path
from html.parser import HTMLParser
ROOT=Path(__file__).resolve().parent
ORDER=['fundamentos','principios-visuais','percepcao-acao-memoria','densidade-espacamento','design-mobile','tipografia','cores','profundidade-superficies','refinamento-optico','identidade-interface','arquitetura-informacao','tipos-telas','usabilidade-acessibilidade','construcao-completa']
EXPECTED_IDS={'densidade-ritmo-escaneabilidade', 'typography-adaptation-localization-writing', 'kerning-tracking-curvas', 'expressividade-contexto', 'cor-percepcao-paleta', 'marca-legibilidade', 'organizacao-taxonomia-rotulos', 'navegacao-encontrabilidade', 'materiais-blur-translucidez', 'camadas-ordem-superficies', 'whitespace-relacoes', 'usabilidade-modelos-mentais', 'typography-anatomy-selection-reading', 'mapa-estrutura-fluxo', 'cor-acessibilidade-verificacao', 'safe-areas-insets-edge-to-edge', 'navegacao-tabs-back-home', 'acessibilidade-plano-verificacao', 'consistencia-ritmo', 'contraste-visual-legibilidade', 'ux-ui-problema-objetivos', 'menus-sidebar-drawer', 'tela-detalhe', 'icones-imagens-significado', 'alinhamento-optico', 'busca-filtros', 'typography-scale-hierarchy-rhythm', 'teclado-toque-gestos', 'grid-responsividade-densidade', 'listas-cards', 'hierarquia-visual', 'cor-semantica-estados-temas', 'icones-peso-optico', 'heuristicas-estado-linguagem-controle', 'pixels-densidades', 'projeto-estrutura-componentes', 'projeto-prototipo-estados', 'splash-onboarding', 'composicao-grid-espacamento', 'sheets-modais-dialogos', 'header-top-app-bar', 'ilustracao-coerencia', 'heuristicas-consistencia-prevencao-reconhecimento', 'home-dashboard', 'elevacao-sombras', 'estados-interface', 'heuristicas-eficiencia-recuperacao-ajuda', 'projeto-revisar-entregar', 'gestalt-agrupamento', 'projeto-enquadrar-problema', 'formularios'}
EXPECTED_IDS.update({'lei-fitts-alvos','miller-memoria-agrupamento','hick-hyman-escolhas'})
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
def prose(value):
 if isinstance(value,dict):return ' '.join(prose(v) for k,v in value.items() if k not in {'id','url','visualHtml','image','localImagePath'})
 if isinstance(value,list):return ' '.join(map(prose,value))
 return str(value)
modules=[]
for f in sorted((ROOT/'source/content').glob('part-*.json')):modules.extend(json.loads(f.read_text())['modules'])
assert len(modules)==14 and len({m['id'] for m in modules})==14,'Exactly 14 unique modules required'
assert set(m['id'] for m in modules)==set(ORDER),'Unexpected/missing module IDs'
lessons=[];examples=0
for m in modules:
 assert isinstance(m.get('objective'),str) and len(m['objective'])>=30,(m['id'],'objective')
 assert isinstance(m.get('rationale'),str) and len(m['rationale'])>=30,(m['id'],'rationale')
 assert not m.get('criteria'),(m['id'],'evaluative module checklist should be removed')
 refs=m.get('references');assert isinstance(refs,list) and 2<=len(refs)<=4,(m['id'],'references count')
 for ref in refs:assert ref.get('title') and ref.get('url','').startswith('https://'),(m['id'],ref)
 assert len({r['url'] for r in refs})==len(refs),(m['id'],'duplicate references')
 if m['id'] in NEW:assert 3<=len(m['lessons'])<=4,(m['id'],'new lesson count')
 for l in m['lessons']:
  lessons.append(l);assert l['title'] and l['summary'] and l['objectives'],l['id']
  assert l['sections'] and l['examples'] and l['sources'],l['id']
  assert not l.get('exercise'),(l['id'],'exercises removed by explicit request')
  titles=[x['title'].strip().casefold().rstrip('?:') for x in l['sections']]
  assert len(titles)==4,(l['id'],'exactly four didactic sections required',titles)
  assert titles[:2]==['o que é','para que serve'],(l['id'],'definition and purpose must lead',titles)
  assert any(t in ['onde usar','onde se usa','onde usa'] for t in titles),(l['id'],'usage context missing')
  assert any(t in ['melhores práticas','boas práticas'] for t in titles),(l['id'],'best practices missing')
  assert all(len(re.sub('<[^>]+>',' ',x['body']).strip())>=40 for x in l['sections']),(l['id'],'empty didactic section')
  assert not re.search(r'Exercício orientado|O que entregar|ficha obrigatória|checklist de domínio',prose(l),re.I),(l['id'],'retired exercise text')
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
assert set(ids)==EXPECTED_IDS and len(ids)==54,'Revision must preserve all 54 current lesson IDs'
opening=next(l for l in lessons if l['id']=='ux-ui-problema-objetivos')
opening_text=prose(opening).casefold()
for concept in ['ux','ui','problema','público','requisit']:assert concept in opening_text,('opening must explain UX/problem/audience/requirements',concept)
built=json.loads((ROOT/'guide-dist/course.json').read_text())
assert [m['id'] for m in built['modules']]==ORDER,'Published progression differs from approved sequence'
assert {l['id'] for m in built['modules'] for l in m['lessons']}==set(ids),'Build/source mismatch'
print(json.dumps({'modules':len(modules),'lessons':len(lessons),'examples':examples,'checks':['14 unique ordered blocks','4 new blocks with 3–4 lessons each','clear objectives, rationale and 2–4 references','definition, purpose, usage and best practices without exercises','51 existing IDs preserved and 3 new lessons','opening addresses UX, problem, audience and requirements','balanced nonexecutable HTML','no forbidden curriculum topics outside preserved Gestalt demonstration','source/build IDs match'],'limits':['Clarity and didactic quality still require editorial judgment.','Runtime figures and progress are checked by test-app.cjs.','No visual, AA contrast or real-browser certification.']},ensure_ascii=False,indent=2))

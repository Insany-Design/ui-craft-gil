/* Content, navigation, progress and import regressions. Browser layout is checked separately. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const course=JSON.parse(fs.readFileSync('guide-dist/course.json','utf8'));
const code=fs.readFileSync('guide-dist/app.js','utf8');
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('\"','&quot;').replaceAll("'",'&#39;');
const KEY='ui-craft-study-v1',OLD='ui-mobile-study-v2';
function setup(hash='#inicio',storage=new Map()){
 const handlers={},elements=new Map(),downloads=[];let blob;
 const make=id=>{const classes=new Set();return {id,innerHTML:'',textContent:'',value:'',hidden:false,style:{},dataset:{},attributes:{},classList:{add:x=>classes.add(x),remove:x=>classes.delete(x),contains:x=>classes.has(x)},setAttribute(k,v){this.attributes[k]=v},getAttribute(k){return this.attributes[k]},removeAttribute(k){delete this.attributes[k]},focus(){},click(){},querySelectorAll(){return[]},addEventListener(t,fn){handlers[id+':'+t]=fn}};};
 const doc={hidden:false,title:'',body:make('body'),querySelector(sel){if(!elements.has(sel))elements.set(sel,make(sel));return elements.get(sel)},querySelectorAll(){return[]},getElementById(){return {scrollIntoView(){}}},addEventListener(t,fn){handlers['document:'+t]=fn},createElement(){return {click(){downloads.push({href:this.href,download:this.download})}}}};
 const ctx={console,document:doc,location:{hash},innerWidth:1440,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},requestAnimationFrame:cb=>cb(),setTimeout:()=>0,clearTimeout(){},Blob,URL:{createObjectURL(b){blob=b;return'blob:test'},revokeObjectURL(){}},Map,Set,Date,JSON,Number,String,Array,Error,SyntaxError};
 ctx.window={COURSE:course,scrollY:0,scrollTo(){},addEventListener(t,fn){handlers['window:'+t]=fn}};vm.createContext(ctx);vm.runInContext(code,ctx);
 return {ctx,elements,handlers,storage,downloads,getBlob:()=>blob};
}
const go=(app,id)=>{app.ctx.location.hash='#'+id;app.handlers['window:hashchange']();return app.elements.get('#main').innerHTML};
const click=(app,selector,node={})=>app.handlers['document:click']({target:{closest:s=>s===selector?node:null},preventDefault(){}});
const importFile=(app,data,size=100)=>app.handlers['document:change']({target:{id:'progress-file',files:[{size,text:async()=>typeof data==='string'?data:JSON.stringify(data)}],value:'x'}});
(async()=>{
 assert.equal(course.chapters.length,14);const ids=new Set(course.chapters.map(c=>c.id));assert.equal(ids.size,14);
 const fontApp=setup();const initialProgress=fontApp.storage.get(KEY);for(let n=0;n<10;n++)click(fontApp,'#font-increase');assert.equal(fontApp.storage.get('ui-craft-font-size-v1'),'20');assert.equal(fontApp.elements.get('#font-increase').disabled,true);assert.equal(fontApp.storage.get(KEY),initialProgress);const fontReload=setup('#inicio',fontApp.storage);assert.equal(fontReload.elements.get('html').style.fontSize,'20px');for(let n=0;n<10;n++)click(fontReload,'#font-decrease');assert.equal(fontReload.storage.get('ui-craft-font-size-v1'),'14');assert.equal(fontReload.elements.get('#font-decrease').disabled,true);
 const app=setup();let html=app.elements.get('#main').innerHTML;assert(html.includes('O detalhe'));
 assert.equal(course.chapters.reduce((n,c)=>n+c.concepts.length,0),120);
 const rendered=[];
 for(const c of course.chapters){
  html=go(app,c.id);rendered.push([c.id,html]);
  for(const text of [c.title,c.subtitle,c.callout,c.introduction])assert(html.includes(text),c.id);
  assert.equal((html.match(/<h1\b/g)||[]).length,1);assert.equal((html.match(/<figure\b/g)||[]).length,c.concepts.length);for(const item of c.concepts){for(const text of [item.title,item.context,item.observation,item.application])assert(html.includes(escape(text)),c.id+' / '+item.title);assert(html.includes(item.visualHtml),'Missing concept visual '+item.title);assert(item.context.split(/\s+/).length>=25,'Missing context '+item.title);assert(item.observation.split(/\s+/).length>=15,'Missing observation '+item.title);assert(item.application.split(/\s+/).length>=15,'Missing application '+item.title);}assert(html.includes('<figcaption>'));assert(html.includes('Continue estudando'));
  assert(!/O assunto desta lição|O roteiro deste bloco|Nesta lição|undefined|NaN|Exercício orientado/.test(html),c.id);
  assert(c.concepts.length>=8);assert.equal(new Set(c.concepts.map(i=>i.id)).size,c.concepts.length);assert(c.sources.length>=2);assert(new Set(c.sources.map(r=>r.url)).size===c.sources.length);
  assert(c.sections.reduce((n,s)=>n+s.body.replace(/<[^>]*>/g,' ').split(/\s+/).length,0)>250,c.id+' lacks explanation');
  for(const r of c.sources)assert(/^https:\/\//.test(r.url));
  for(const match of html.matchAll(/href="#([^"]+)"/g))assert(ids.has(match[1].split('--')[0])||['inicio','biblioteca','progresso'].includes(match[1]),c.id+' broken route');
 }
 for(const [alias,target] of Object.entries(course.aliases))assert(go(app,alias).includes(course.chapters.find(c=>c.id===target).subtitle),alias);
 assert(go(app,'%E0%A4%A').includes('O detalhe'));assert(go(app,'glossario').includes('Referências'));
 app.handlers['#course-search:input']({target:{value:'TÍPOGRAFIA'}});assert(app.elements.get('#course-nav').innerHTML.includes('#tipografia'));
 app.handlers['#course-search:input']({target:{value:'xxxxxxxxxxx'}});assert(app.elements.get('#search-status').textContent.includes('Nenhum'));
 go(app,'cor');click(app,'[data-complete]',{dataset:{complete:'cor'}});assert(JSON.parse(app.storage.get(KEY)).completed.includes('cor'));
 const reload=setup('#cor',app.storage);assert(reload.elements.get('#main').innerHTML.includes('Capítulo lido'));click(reload,'[data-complete]',{dataset:{complete:'cor'}});assert(!JSON.parse(app.storage.get(KEY)).completed.includes('cor'));
 go(app,'progresso');await importFile(app,{schemaVersion:1,course:'ui-craft',completed:['tipografia','invalid','<img src=x onerror=alert(1)>'],positions:{tipografia:350,cor:-2},lastChapter:'tipografia'});assert.deepEqual(JSON.parse(app.storage.get(KEY)).completed,['cor','tipografia']);assert.equal(JSON.parse(app.storage.get(KEY)).positions.tipografia,350);
 for(const bad of ['{oops',{schemaVersion:99,course:'ui-craft',completed:[]},{schemaVersion:1,course:'else',completed:[]},{schemaVersion:1,course:'ui-craft',completed:'invalid'}]){const before=app.storage.get(KEY);await importFile(app,bad);assert.equal(app.storage.get(KEY),before);}
 {const before=app.storage.get(KEY);await importFile(app,{},1024*1024+1);assert.equal(app.storage.get(KEY),before);}
 const previous={schemaVersion:2,course:'ui-mobile',completed:['gestalt-agrupamento','cor-percepcao-paleta'],positions:{'gestalt-agrupamento':220},lastLesson:'gestalt-agrupamento',archived:{completed:['pesquisa-hipotese-teste'],positions:{'pesquisa-hipotese-teste':100},lastLesson:'pesquisa-hipotese-teste'}};
 const storage=new Map([[OLD,JSON.stringify(previous)]]);const migrated=setup('#progresso',storage);click(migrated,'#export-progress');const exported=JSON.parse(await migrated.getBlob().text());assert.deepEqual(exported.completed,[]);assert.deepEqual(exported.previousEdition,previous);assert.equal(storage.get(OLD),JSON.stringify(previous),'Original progress overwritten');
 const fresh=setup('#progresso');await importFile(fresh,exported);click(fresh,'#export-progress');assert.deepEqual(JSON.parse(await fresh.getBlob().text()).previousEdition,previous);
 const blocked={get(){throw Error('unavailable')},set(){throw Error('unavailable')}};const ephemeral=setup('#cor',blocked);click(ephemeral,'[data-complete]',{dataset:{complete:'cor'}});assert.equal(ephemeral.elements.get('#storage-warning').hidden,false);go(ephemeral,'progresso');click(ephemeral,'#export-progress');assert(JSON.parse(await ephemeral.getBlob().text()).completed.includes('cor'));
 const allVideos=course.chapters.flatMap(c=>c.videos||[]);assert.equal(allVideos.length,8);for(const v of allVideos){assert(/^[A-Za-z0-9_-]{11}$/.test(v.id));assert(v.source.startsWith('https://'));}for(const c of course.chapters.filter(c=>c.videos?.length)){const vhtml=go(app,c.id);assert(!vhtml.includes('<iframe'));assert(vhtml.includes('data-video='));assert(vhtml.includes('Abrir no YouTube'));}assert(go(app,'progresso').includes('localStorage'));
 const {spawnSync}=require('node:child_process');const check=spawnSync('python3',['-c',`import sys,json
from html.parser import HTMLParser
class Check(HTMLParser):
 def __init__(self):super().__init__();self.stack=[];self.ids=set()
 def handle_starttag(self,t,a):
  assert t not in {'script','iframe','object','embed','style'},t
  assert not any(k.startswith('on') for k,v in a),a
  for k,v in a:
   if k=='id':assert v not in self.ids,v;self.ids.add(v)
  if t not in {'area','br','col','hr','img','input','link','meta','source','track','wbr','path','circle'}:self.stack.append(t)
 def handle_endtag(self,t):
  if t in {'path','circle'}:return
  assert self.stack and self.stack[-1]==t,(t,self.stack)
  self.stack.pop()
for label,html in json.load(sys.stdin):
 p=Check()
 try:p.feed(html);assert not p.stack,p.stack
 except AssertionError as e:raise AssertionError((label,str(e)))
`],{input:JSON.stringify(rendered),encoding:'utf8'});assert.equal(check.status,0,check.stderr);
 console.log(JSON.stringify({chapters:14,concepts:120,legacyLinks:Object.keys(course.aliases).length,checks:['120 distinct concepts render their context, visual, observation and application','valid markup and unique IDs','legacy deep links','accent-insensitive search and no-results state','mark/unmark and reload','imports reject malformed, foreign and oversized files','older progress remains untouched and survives export/import','session export works when storage is unavailable']}));
})().catch(e=>{console.error(e);process.exit(1)});

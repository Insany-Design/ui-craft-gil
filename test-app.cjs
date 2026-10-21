/* Independent structural/behavioral QA. Deliberately not a real DOM/layout test. */
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const course=JSON.parse(fs.readFileSync(__dirname+'/guide-dist/course.json','utf8'));
const code=fs.readFileSync(__dirname+'/guide-dist/app.js','utf8');
const lessons=course.modules.flatMap(m=>m.lessons), ids=new Set(lessons.map(l=>l.id));
const KEY='ui-mobile-study-v2',storage=new Map();
function setup(hash='#inicio',profile=storage){
 const handlers={},elements=new Map(),downloads=[];let blob;
 const make=(id)=>{const classes=new Set();return {id,innerHTML:'',textContent:'',value:'',hidden:false,style:{},dataset:{},attributes:{},classList:{add:x=>classes.add(x),remove:x=>classes.delete(x),toggle(x,force){const on=force===undefined?!classes.has(x):force;on?classes.add(x):classes.delete(x);return on},contains:x=>classes.has(x)},setAttribute(k,v){this.attributes[k]=v},removeAttribute(k){delete this.attributes[k]},focus(){},click(){},querySelectorAll(){return[]},addEventListener(type,fn){handlers[id+':'+type]=fn}}};
 const doc={hidden:false,title:'',body:make('body'),querySelector(sel){if(!elements.has(sel))elements.set(sel,make(sel));return elements.get(sel)},querySelectorAll(){return[]},getElementById(){return {scrollIntoView(){}}},addEventListener(t,fn){handlers['document:'+t]=fn},createElement(){return {click(){downloads.push({href:this.href,download:this.download})},append(){},setAttribute(){}}}};
 const ctx={console,document:doc,location:{hash},innerWidth:1440,localStorage:{getItem:k=>profile.get(k)||null,setItem:(k,v)=>profile.set(k,v)},requestAnimationFrame:cb=>cb(),setTimeout:()=>0,clearTimeout(){},confirm:()=>false,Blob,URL:{createObjectURL(b){blob=b;return'blob:test'},revokeObjectURL(){}},Map,Set,Date,JSON,Number,String,Array,Error,SyntaxError};ctx.window={COURSE:course,scrollY:0,scrollTo(){},removeEventListener(){},addEventListener(t,fn){handlers['window:'+t]=fn}};
 vm.createContext(ctx);vm.runInContext(code,ctx);return {ctx,doc,elements,handlers,downloads,getBlob:()=>blob};
}
const click=(app,selector,node={})=>app.handlers['document:click']({target:{closest:s=>s===selector?node:null},preventDefault(){}});
const go=(app,route)=>{app.ctx.location.hash='#'+route;app.handlers['window:hashchange']();return app.elements.get('#main').innerHTML};
const importFile=(app,data,size=100)=>app.handlers['document:change']({target:{id:'progress-file',files:[{size,text:async()=>typeof data==='string'?data:JSON.stringify(data)}],value:'x'}});
const saved=()=>JSON.parse(storage.get(KEY));
(async()=>{
 assert.equal(course.modules.length,13);assert.equal(ids.size,lessons.length);
 let app=setup();const overview=app.elements.get('#main').innerHTML;assert(overview.includes('class="overview"'));for(const m of course.modules){assert(overview.includes('#inicio--module-'+m.id),'Missing roadmap block '+m.id);assert(overview.includes(m.objective),'Missing objective '+m.id);}
 const out=__dirname+'/qa-rendered';fs.mkdirSync(out,{recursive:true});
 for(const m of course.modules)for(const l of m.lessons){const html=go(app,l.id);assert(html.includes(l.title),l.id);assert(html.includes('Exercício orientado'),l.id);const visible=html.replace(/<details\b[^>]*>[\s\S]*?<\/details>/g,'');assert(visible.includes(l.title)&&visible.includes('Exercício orientado'),'Required study content hidden: '+l.id);assert(/<figure\b|perception-atlas/.test(visible),'Primary figure hidden: '+l.id);assert(!/\bundefined\b|\bNaN\b/.test(html),l.id);if(html.includes('class="craft-figure"'))assert(!html.includes('class="craft-example"'),'Text fallback must not duplicate or contradict real figure: '+l.id);assert(/<figure\b|perception-atlas/.test(html),'Missing teaching figure: '+l.id);assert(!/href=["'](?:undefined|null)?["']/.test(html),'Empty/invalid link: '+l.id);for(const match of html.matchAll(/href="#([^"]+)"/g)){const route=match[1].split('--')[0];assert(ids.has(route)||['inicio','biblioteca','glossario','progresso','pesquisa-hipotese-teste','teste-usabilidade-evidencia'].includes(route),'Broken lesson route '+route+' in '+l.id);}fs.writeFileSync(out+'/'+l.id+'.html',html);}
 const [first,second]=lessons.map(l=>l.id);go(app,first);
 await click(app,'[data-complete]',{dataset:{complete:first}});assert(saved().completed.includes(first));
 app=setup('#'+first);assert(app.elements.get('#main').innerHTML.includes('Lição estudada'));
 await click(app,'[data-complete]',{dataset:{complete:first}});assert(!saved().completed.includes(first));
 await click(app,'[data-complete]',{dataset:{complete:first}});assert(saved().completed.includes(first));
 assert(go(app,'progresso').includes('1 de '+lessons.length));
 await importFile(app,{schemaVersion:2,course:'ui-mobile',completed:[second,first,'invalid'],lastLesson:second,positions:{[second]:123}});
 assert.equal(saved().completed.length,2);assert.equal(saved().lastLesson,second);assert.equal(saved().positions[second],123);
 for(const invalid of ['{bad',{schemaVersion:99,completed:[]},{course:'other',completed:[]},{completed:'wrong'}]){const before=storage.get(KEY);await importFile(app,invalid);assert.equal(storage.get(KEY),before,'Invalid import mutated progress');}
 {const before=storage.get(KEY);await importFile(app,{completed:[]},1024*1024+1);assert.equal(storage.get(KEY),before);}
 await importFile(app,{completed:[first,'<img src=x onerror=alert(1)>'],positions:{[first]:-1,[second]:Infinity},lastLesson:'<script>alert(1)</script>'});
 assert.equal(saved().completed.length,2);assert(!JSON.stringify(saved()).includes('<img'));assert.equal(saved().positions[second],123);
 go(app,'progresso');await click(app,'#export-progress');assert.equal(app.downloads.length,1);const exported=JSON.parse(await app.getBlob().text());assert.deepEqual(exported.completed,saved().completed);assert.deepEqual(exported.positions,saved().positions);assert.equal(exported.course,'ui-mobile');
 {const before=storage.get(KEY);await click(app,'#reset-progress');assert.equal(storage.get(KEY),before,'Cancelled reset must preserve storage');}
 assert(go(app,'%E0%A4%A').includes('class="overview"'));
 for(const route of ['biblioteca','glossario','progresso']){const html=go(app,route);assert(!html.includes('undefined'));fs.writeFileSync(out+'/'+route+'.html',html);}
 const glossary=go(app,'glossario');for(const term of ['Kerning','Tracking','Whitespace','Blur'])assert(glossary.toLowerCase().includes(term.toLowerCase()),'Missing glossary term '+term);
 app.handlers['#course-search:input']({target:{value:'HÍERARQUIA'}});assert(app.elements.get('#course-nav').innerHTML.includes('hierarquia-visual'));assert(app.elements.get('#search-status').textContent.includes('encontrada'));
 const legacy=JSON.parse(fs.readFileSync(__dirname+'/RESTORATION-STRUCTURE.json','utf8'));const legacyIds=Object.values(legacy.parts).flatMap(ms=>ms.flatMap(m=>m.lessons.map(l=>l.id)));
 const positions=Object.fromEntries(legacyIds.map((id,i)=>[id,100+i]));const legacyLast=legacyIds.at(-1);
 // Seed authentic old data, never erase real or test progress to make migration pass.
 storage.set(KEY,JSON.stringify({schemaVersion:2,course:'ui-mobile',completed:legacyIds,lastLesson:legacyLast,positions}));
 app=setup('#progresso');await click(app,'#export-progress');const migrated=JSON.parse(await app.getBlob().text());
 const allValues=(v)=>v&&typeof v==='object'?Object.entries(v).flatMap(([k,x])=>[k,...allValues(x)]):[v];const retained=allValues(migrated);
 for(const id of legacyIds){assert(retained.includes(id),'Legacy completion lost instead of migrated/archived: '+id);assert(retained.includes(positions[id]),'Legacy reading position lost: '+id);}
 assert(migrated.completed.every(id=>ids.has(id)),'Archived IDs must not inflate active completion');
 // Reload the export and ensure the archive also survives import, not only initial loading.
 await importFile(app,migrated);await click(app,'#export-progress');const roundTrip=JSON.parse(await app.getBlob().text());for(const id of legacyIds)assert(allValues(roundTrip).includes(id),'Legacy ID lost on round trip: '+id);
 const removed=['pesquisa-hipotese-teste','teste-usabilidade-evidencia'];
 const archivedOnly=new Map([[KEY,JSON.stringify({schemaVersion:2,course:'ui-mobile',completed:removed,positions:{[removed[0]]:231,[removed[1]]:456},lastLesson:removed[1]})]]);
 const archivedApp=setup('#progresso',archivedOnly);await click(archivedApp,'#export-progress');const history=JSON.parse(await archivedApp.getBlob().text());
 assert.deepEqual(history.completed,[],'Removed lessons must not auto-complete replacements');assert.deepEqual(history.archived.completed,removed);assert.equal(history.archived.positions[removed[0]],231);assert.equal(history.archived.positions[removed[1]],456);assert.equal(history.archived.lastLesson,removed[1]);
 assert(go(archivedApp,removed[0]).includes(lessons.find(l=>l.id==='ux-ui-problema-objetivos').title),'Old task route must redirect');
 assert(go(archivedApp,removed[1]).includes(lessons.find(l=>l.id==='acessibilidade-plano-verificacao').title),'Old evaluation route must redirect');
 const freshImport=setup('#progresso',new Map());await importFile(freshImport,history);await click(freshImport,'#export-progress');const importedHistory=JSON.parse(await freshImport.getBlob().text());assert.deepEqual(importedHistory.archived,history.archived,'Import into another browser must preserve archive');assert.deepEqual(importedHistory.completed,[]);
 const blockedStorage={get(){const e=new Error('Blocked');e.name='SecurityError';throw e},set(){throw new Error('Quota exceeded')}};
 const ephemeral=setup('#'+first,blockedStorage);await click(ephemeral,'[data-complete]',{dataset:{complete:first}});go(ephemeral,'progresso');await click(ephemeral,'#export-progress');assert(JSON.parse(await ephemeral.getBlob().text()).completed.includes(first),'Unavailable localStorage must still allow session export');assert.equal(ephemeral.elements.get('#storage-warning').hidden,false);
 const markupCheck=require('child_process').spawnSync('python3',['-c',`import sys,json
from html.parser import HTMLParser
class Check(HTMLParser):
 def __init__(self):super().__init__();self.stack=[]
 def handle_starttag(self,t,a):
  assert t not in {'script','iframe','object','embed'},t
  assert not any(k.lower().startswith('on') for k,v in a),a
  if t not in {'area','br','col','hr','img','input','link','meta','source','track','wbr'}:self.stack.append(t)
 def handle_endtag(self,t):
  assert self.stack and self.stack[-1]==t,(t,self.stack)
  self.stack.pop()
 def handle_startendtag(self,t,a):
  self.handle_starttag(t,a)
  if self.stack and self.stack[-1]==t:self.handle_endtag(t)
for label,html in json.load(sys.stdin):
 p=Check()
 try:p.feed(html);assert not p.stack,p.stack
 except AssertionError as e:raise AssertionError((label,str(e)))
`],{input:JSON.stringify(lessons.map(l=>[l.id,fs.readFileSync(out+'/'+l.id+'.html','utf8')])),encoding:'utf8'});
 assert.equal(markupCheck.status,0,markupCheck.stderr);
 console.log(JSON.stringify({renderedLessons:lessons.length,modules:course.modules.length,legacyLessonsChecked:legacyIds.length,pass:['all lesson templates and teaching figures','mark/unmark and reload','progress totals','merge import and export','invalid/oversized import rejection','XSS-shaped progress input rejection','cancelled reset preserves state','malformed route fallback','library/glossary/progress','accent-insensitive search','legacy completion and reading positions survive load/export/import'],note:'DOM stub, not visual, browser, accessibility or layout certification.'},null,2));
})().catch(e=>{console.error(e);process.exit(1)});

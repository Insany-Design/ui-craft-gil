const fs=require('fs'),vm=require('vm'),assert=require('assert');
const course=JSON.parse(fs.readFileSync(__dirname+'/guide-dist/course.json','utf8'));
const code=fs.readFileSync(__dirname+'/guide-dist/app.js','utf8');
const storage=new Map();
function setup(hash='#inicio'){
 const handlers={}, elements=new Map();
 const make=(id)=>({id,innerHTML:'',textContent:'',value:'',hidden:false,style:{},dataset:{},classList:{add(){},remove(){},toggle(){},contains(){return false}},setAttribute(){},removeAttribute(){},focus(){},querySelectorAll(){return[]},addEventListener(type,fn){handlers[id+':'+type]=fn}});
 const doc={hidden:false,title:'',body:make('body'),querySelector(sel){if(!elements.has(sel))elements.set(sel,make(sel));return elements.get(sel)},querySelectorAll(){return[]},getElementById(){return {scrollIntoView(){}}},addEventListener(t,fn){handlers['document:'+t]=fn},createElement(){return {click(){},append(){},setAttribute(){}}}};
 const ctx={console,document:doc,location:{hash},innerWidth:1440,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},requestAnimationFrame:cb=>cb(),setTimeout,clearTimeout,confirm:()=>false,Blob,URL,Map,Set,Date,JSON,Number,String,Array,Error,SyntaxError};ctx.window={COURSE:course,scrollY:0,scrollTo(){},removeEventListener(){},addEventListener(t,fn){handlers['window:'+t]=fn}};
 vm.createContext(ctx);vm.runInContext(code,ctx);return {ctx,doc,elements,handlers};
}
(async()=>{
 let app=setup();assert(app.elements.get('#main').innerHTML.includes('Aprenda a decidir'));
 const out=__dirname+'/qa-rendered';fs.mkdirSync(out,{recursive:true});
 for(const m of course.modules)for(const l of m.lessons){app.ctx.location.hash='#'+l.id;app.handlers['window:hashchange']();let html=app.elements.get('#main').innerHTML;assert(html.includes(l.title));assert(html.includes('Exercício orientado'));assert(!html.includes('<details'));assert(!html.includes('undefined'));fs.writeFileSync(out+'/'+l.id+'.html',html);}
 const first=course.modules[0].lessons[0].id;
 app.ctx.location.hash='#'+first;app.handlers['window:hashchange']();
 await app.handlers['document:click']({target:{closest:s=>s==='[data-complete]'?{dataset:{complete:first}}:null}});
 assert(JSON.parse(storage.get('ui-mobile-study-v2')).completed.includes(first));
 app=setup('#'+first);assert(app.elements.get('#main').innerHTML.includes('Lição estudada'));
 app.ctx.location.hash='#progresso';app.handlers['window:hashchange']();assert(app.elements.get('#main').innerHTML.includes('1 de '+course.modules.flatMap(m=>m.lessons).length));
 const second=course.modules.flatMap(m=>m.lessons)[1].id;
 const importTarget={id:'progress-file',files:[{size:100,text:async()=>JSON.stringify({schemaVersion:2,course:'ui-mobile',completed:[second,first,'invalid'],lastLesson:second,positions:{[second]:123}})}],value:'x'};
 await app.handlers['document:change']({target:importTarget});let saved=JSON.parse(storage.get('ui-mobile-study-v2'));assert.equal(saved.completed.length,2);assert.equal(saved.lastLesson,second);assert.equal(saved.positions[second],123);
 const before=storage.get('ui-mobile-study-v2');await app.handlers['document:change']({target:{id:'progress-file',files:[{size:100,text:async()=>'{bad'}],value:'x'}});assert.equal(storage.get('ui-mobile-study-v2'),before);
 app.ctx.location.hash='#%E0%A4%A';app.handlers['window:hashchange']();assert(app.elements.get('#main').innerHTML.includes('Aprenda a decidir'));
 for(const route of ['biblioteca','glossario','progresso']){app.ctx.location.hash='#'+route;app.handlers['window:hashchange']();assert(!app.elements.get('#main').innerHTML.includes('undefined'));fs.writeFileSync(out+'/'+route+'.html',app.elements.get('#main').innerHTML);}
 const legacy=JSON.parse(fs.readFileSync(__dirname+'/RESTORATION-STRUCTURE.json','utf8'));const legacyIds=Object.values(legacy.parts).flatMap(ms=>ms.flatMap(m=>m.lessons.map(l=>l.id)));assert.equal(legacyIds.length,40);const legacyLast=legacyIds.at(-1);storage.set('ui-mobile-study-v2',JSON.stringify({schemaVersion:2,course:'ui-mobile',completed:legacyIds,lastLesson:legacyLast,positions:{[legacyLast]:123}}));const upgraded=setup('#progresso');assert(upgraded.elements.get('#main').innerHTML.includes('40 de 41'));assert.equal(JSON.parse(storage.get('ui-mobile-study-v2')).completed.length,40);
 console.log(JSON.stringify({renderedLessons:course.modules.flatMap(m=>m.lessons).length,pass:['overview','all lesson templates','no accordions','mark/unmark state serialization','reload persistence','progress totals','import merges valid IDs','reject malformed JSON','malformed route fallback','library/glossary/progress routes'],note:'DOM stub test; visual and real-browser interaction tests remain separate.'},null,2));
})().catch(e=>{console.error(e);process.exit(1)});

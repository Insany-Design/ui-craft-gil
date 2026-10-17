const fs=require('fs'),vm=require('vm'),assert=require('assert');
const code=fs.readFileSync(__dirname+'/source/app.js','utf8');const start=code.indexOf('  function mountComponentControls('),end=code.indexOf('  function renderRoute',start);
assert(start>=0&&end>start);
function el(width=390){const classes=new Set();return {closest(){return null},clientWidth:width,style:{setProperty(k,v){this[k]=v}},classList:{contains:x=>classes.has(x),toggle(x){if(classes.has(x)){classes.delete(x);return false}classes.add(x);return true}},insertBefore(child){child.parentElement=this;child.clientWidth=this.clientWidth},appendChild(child){child.parentElement=this},setAttribute(){},addEventListener(_,f){this.click=f}}}
function make(width){const slot=el();slot.parentElement=el(width);return slot;}
for(const observer of [false,true]){
 const a=make(252),b=make(390);let disconnected=0,removed=0;
 const ctx={document:{querySelectorAll:()=>[a,b],createElement:()=>el()},window:{addEventListener(){},removeEventListener(){removed++}},console};
 if(observer){ctx.ResizeObserver=class{constructor(fn){this.fn=fn}observe(){}disconnect(){disconnected++}};ctx.window.ResizeObserver=ctx.ResizeObserver;}
 vm.createContext(ctx);vm.runInContext(code.slice(start,end)+'\nmountRealisticExamples();',ctx);
 assert.equal(a.style['--rx-scale'],String(252/390));assert(Math.abs(parseFloat(a.style.height)-844*252/390)<.001);assert.equal(b.style.height,'844px');assert.equal(b._zoom.hidden,true);assert.equal(a._zoom.hidden,false);
 a._zoom.click();assert.equal(a.style['--rx-scale'],'1');assert.equal(a.style.height,'844px');assert.equal(a._hint.hidden,false);assert(a._zoom.parentElement!==a.parentElement);a._zoom.click();assert.equal(a.style['--rx-scale'],String(252/390));assert.equal(a._hint.hidden,true);
 vm.runInContext('mountRealisticExamples();',ctx);assert(observer?disconnected===1:removed===1);
}
console.log('PASS: rebuilt test checks uniform viewport, desktop no-op hidden, external zoom control, pan hint, toggle, fallback and observer cleanup. DOM stub, not visual QA.');

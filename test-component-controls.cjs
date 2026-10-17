const fs=require('fs'),vm=require('vm'),assert=require('assert');
const source=fs.readFileSync(__dirname+'/source/app.js','utf8');const start=source.indexOf('  function mountComponentControls('),end=source.indexOf('  let exampleObserver;',start);assert(start>=0&&end>start);
function element(tag){return {tag,children:[],attributes:{},appendChild(child){this.children.push(child)},insertBefore(child){this.children.unshift(child)},setAttribute(key,value){this.attributes[key]=value},addEventListener(type,fn){this[type]=fn},querySelectorAll(tag){return this.children.flatMap(child=>[...(child.tag===tag?[child]:[]),...child.querySelectorAll(tag)])}}}
for(const mode of ['width','type-width','grid']){
 const properties={},classes=new Set(),study={dataset:{demoControl:mode},style:{setProperty(k,v){properties[k]=v}},classList:{toggle(k,state){if(state)classes.add(k);else classes.delete(k)}}};
 const column=element('div'),ctx={document:{createElement:element},study,column};vm.createContext(ctx);vm.runInContext(source.slice(start,end)+'\nmountComponentControls(study,column);',ctx);
 const buttons=column.querySelectorAll('button');assert.equal(buttons.length,mode==='type-width'?4:2);
 buttons[1].click();if(mode==='grid')assert(classes.has('rx-grid-hidden'));else assert.equal(properties['--rx-component-width'],'260px');assert.equal(buttons[1].attributes['aria-pressed'],'true');assert.equal(buttons[0].attributes['aria-pressed'],'false');
 if(mode==='type-width'){buttons[3].click();assert.equal(properties['--rx-type-scale'],'1.3');buttons[2].click();assert.equal(properties['--rx-type-scale'],'1');}
}
console.log('PASS: rebuilt test checks external width/type/grid controls and mutually exclusive states. DOM stub, not layout measurement.');

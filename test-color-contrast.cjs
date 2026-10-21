/* Solid-color arithmetic audit, not computed-style or whole-screen AA certification. */
const fs=require('fs'),assert=require('assert');
function luminance(hex){const c=hex.replace('#','').match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2]}
function contrast(a,b){const x=luminance(a),y=luminance(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
const pairs=[
 ['body','#1d1d1f','#ffffff'],['body muted','#626268','#ffffff'],['muted on soft','#626268','#f5f5f7'],['link','#0066cc','#ffffff'],['selected navigation','#0066cc','#eef6ff'],
 ['craft body','#171717','#f5f6f8'],['craft heading','#394150','#f5f6f8'],['craft caption','#434b59','#f5f6f8'],['craft support','#525866','#ffffff'],['craft support on light blue','#525866','#eef2ff'],['craft primary action','#ffffff','#335cff'],['craft dimension','#2547d0','#ffffff'],['craft blue annotation','#2448a8','#e9efff'],['craft brand','#792846','#ffffff'],['craft inverse brand','#ffffff','#792846'],
 ['Rota support','#5c5c5c','#ffffff'],['Rota selected','#2547d0','#ebefff']
];
const rows=pairs.map(([label,text,bg])=>({label,text,bg,ratio:contrast(text,bg)}));for(const p of rows)assert(p.ratio>=4.5,`${p.label}: ${p.ratio} < 4.5`);
for(const[a,b,label,precision]of [['#525866','#ffffff',7.13,2],['#ffffff','#335cff',5.10,2],['#a3a3a3','#ffffff',2.52,2],['#5c5c5c','#ffffff',6.6869,4]])assert(Math.abs(contrast(a,b)-label)<=.5*10**(-precision)+1e-6,`Wrong teaching ratio ${a}/${b}: ${contrast(a,b)} vs ${label}`);
const app=fs.readFileSync(__dirname+'/guide-dist/app.js','utf8');assert(app.includes('2,52:1')&&app.includes('7,13:1')&&app.includes('5,10:1'),'Contrast teaching values missing');assert(app.includes('Transcrição: Galeria Horizonte'),'Deliberately failing example needs accessible transcription');
assert(contrast('#777777','#ffffff')<4.5);assert(contrast('#767676','#ffffff')>=4.5);
console.log(JSON.stringify({solidColorPairs:rows.map(x=>({...x,ratio:+x.ratio.toFixed(4)})),pass:['17 selected normal-text pairs meet 4.5:1','four teaching ratios recalculate correctly','failing contrast specimen has readable transcription','threshold boundary examples are not rounded into compliance'],limits:'Selected solid foreground/background pairs only. No screenshot/computed-style audit; overlays, gradients, image backgrounds and browser rendering remain unverified.'},null,2));

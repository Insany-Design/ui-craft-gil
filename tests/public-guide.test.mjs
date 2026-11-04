import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createPublicGuide} from '../server/public-guide.mjs';
const assets={'/index.html':{type:'text/html',base64:Buffer.from('GUIA').toString('base64')},'/app.js':{type:'application/javascript',base64:Buffer.from('APP').toString('base64')}};
const handle=createPublicGuide(assets);
const req=(path,options)=>new Request('https://example.com'+path,options);
test('fresh visitors and old session cookies can read the guide without login',async()=>{
 for(const headers of [{},{cookie:'__Host-course_session=old-session'}])for(const path of ['/','/index.html','/app.js']){
  const r=handle(req(path,{headers}));assert.equal(r.status,200);assert.equal(r.headers.get('set-cookie'),null);assert.equal(r.headers.get('location'),null);assert.match(await r.text(),/GUIA|APP/);
 }
 assert.equal(await handle(req('/',{method:'HEAD'})).text(),'');
});
test('old access links redirect, administrative routes and unlisted files stay unavailable',()=>{
 for(const path of ['/login','/logout']){const r=handle(req(path));assert.equal(r.status,303);assert.equal(r.headers.get('location'),'/');}
 for(const path of ['/admin/password','/server/private-assets.mjs','/source/content/craft.json','/toString','/app.js.map'])assert.equal(handle(req(path)).status,404);
 assert.equal(handle(req('/login',{method:'POST',body:'password=unused'})).status,405);
});
test('navigation has no logout or password prompt, and keeps local progress',()=>{
 const html=readFileSync('source/index.html','utf8');assert(!html.includes('href="/logout"'));assert(!html.includes('type="password"'));assert(html.includes('href="#progresso"'));
 const app=readFileSync('source/app.js','utf8');assert(app.includes('localStorage'));assert(app.includes('Marcar como lido'));
});

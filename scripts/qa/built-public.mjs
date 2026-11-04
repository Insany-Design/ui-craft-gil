// Exercise the built Worker without identity headers, cookies or database migrations.
import {Miniflare} from 'miniflare';
import {readFileSync,readdirSync} from 'node:fs';
import assert from 'node:assert/strict';
import assets from '../../server/private-assets.mjs';
const origin='https://fundamentos-ui-mobile.insany-team-1573.chatgpt.site';
const modules=['index.js',...readdirSync('dist/server',{recursive:true}).filter(p=>p.endsWith('.js')&&p!=='index.js')].map(path=>({type:'ESModule',path:'dist/server/'+path,contents:readFileSync('dist/server/'+path,'utf8')}));
const mf=new Miniflare({modules,modulesRoot:'dist/server',compatibilityDate:'2026-05-15',compatibilityFlags:['nodejs_compat'],assets:{directory:'dist/client',routerConfig:{has_user_worker:true}}});
try{
 for(const path of ['/',...Object.keys(assets)]){
  const r=await mf.dispatchFetch(origin+path,{redirect:'manual'});assert.equal(r.status,200,path);assert.equal(r.headers.get('set-cookie'),null);assert.equal(r.headers.get('location'),null);
  const expected=Buffer.from(assets[path==='/'?'/index.html':path].base64,'base64');assert.deepEqual(Buffer.from(await r.arrayBuffer()),expected,path);
 }
 const head=await mf.dispatchFetch(origin+'/',{method:'HEAD'});assert.equal(head.status,200);assert.equal(await head.text(),'');
 for(const path of ['/login','/logout']){const r=await mf.dispatchFetch(origin+path,{redirect:'manual'});assert.equal(r.status,303);assert.equal(r.headers.get('location'),'/');}
 for(const path of ['/admin/password','/server/private-assets.mjs','/source/course.js','/dist/course.json'])assert.equal((await mf.dispatchFetch(origin+path)).status,404,path);
 assert.equal((await mf.dispatchFetch(origin+'/login',{method:'POST',body:'password=unused'})).status,405);
 console.log(JSON.stringify({anonymousAssetsVerified:Object.keys(assets).length+1,passwordRequired:false,databaseRequired:false,legacyLinksRedirect:true,sourceFilesUnavailable:true}));
}finally{await mf.dispose();}

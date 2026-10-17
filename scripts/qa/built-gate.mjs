// Local-only built Worker test, D1 exclusively in memory. Does not call live Site.
import {Miniflare} from 'miniflare';
import {readFileSync,readdirSync} from 'node:fs';
import assert from 'node:assert/strict';
const origin='https://fundamentos-ui-mobile.insany-team-1573.chatgpt.site';
const modules=['index.js',...readdirSync('dist/server',{recursive:true}).filter(p=>p.endsWith('.js')&&p!=='index.js')].map(path=>({type:'ESModule',path:'dist/server/'+path,contents:readFileSync('dist/server/'+path,'utf8')}));
const mf=new Miniflare({modules,modulesRoot:'dist/server',compatibilityDate:'2026-05-15',compatibilityFlags:['nodejs_compat'],d1Databases:['DB'],assets:{directory:'dist/client',routerConfig:{has_user_worker:true}}});
try{
 const db=await mf.getD1Database('DB');
 for(const migration of readdirSync('drizzle').filter(p=>p.endsWith('.sql')).sort())for(const statement of readFileSync('drizzle/'+migration,'utf8').split('--> statement-breakpoint'))if(statement.trim())await db.prepare(statement.trim()).run();
 const login=await mf.dispatchFetch(origin+'/login',{redirect:'manual'});const loginHtml=await login.text();assert(loginHtml.includes('Acesso em preparação'));assert(!loginHtml.includes('<form'));assert.equal(login.headers.get('set-cookie'),null);
 const route=readdirSync('dist/server/_next/static').find(p=>p.startsWith('route-'));
 for(const path of ['/','/login','/course.js','/course.json','/index.html','/app.js','/real-assets/inter-regular.woff2','/source/course.js','/dist/course.json','/server/private-assets.mjs','/_next/static/'+route]){
  const r=await mf.dispatchFetch(origin+path,{redirect:'manual'});assert.equal(r.status,path==='/'?303:path==='/login'?200:401);assert(r.headers.get('cache-control')?.includes('no-store'));console.log(JSON.stringify({path,status:r.status,noStore:true}));
 }
 assert.equal((await mf.dispatchFetch(origin+'/admin/password',{redirect:'manual'})).status,303);
 // Direct Worker trusts dispatch headers. This is deliberately a trust-boundary probe,
 // NOT a production authorization test. Never expose a bypass hostname.
 const identity={'oai-authenticated-user-email':'gilberto@insany.com.br','oai-authenticated-user-id':'local-ephemeral-probe'};
 const admin=await mf.dispatchFetch(origin+'/admin/password',{headers:identity});assert.equal(admin.status,200);const html=await admin.text();assert(html.includes('<form'));assert(html.includes('Nova senha compartilhada'));assert(html.includes('Não use a senha da sua conta ChatGPT.'));assert(/name="csrf" value="[a-f0-9]{64}"/.test(html));const cookie=admin.headers.get('set-cookie');assert(cookie?.includes('__Host-course_csrf='));for(const flag of ['HttpOnly','Secure','SameSite=Strict'])assert(cookie.includes(flag));
 const other=await mf.dispatchFetch(origin+'/admin/password',{headers:{'oai-authenticated-user-email':'other@example.com','oai-authenticated-user-id':'other-local-probe'},redirect:'manual'});assert.equal(other.status,403);
 // Read-only probe: no password submission or administrator/configuration creation.
 for(const table of ['course_config','course_sessions','course_rate'])assert.equal((await db.prepare('SELECT count(*) c FROM '+table).first()).c,0);
 console.log(JSON.stringify({anonymousAdmin:303,differentUser:403,directWorkerOwnerForm:200,csrfCookieSecure:true,configurationRows:0,sessionRows:0,rateRows:0,dispatchStrippingProven:false,adminPostAttempted:false}));
}finally{await mf.dispose();}

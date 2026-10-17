// Read-only HTTP smoke test. Run only AFTER root confirms the intended deployment.
// No credentials, cookies, passwords, request-body logging or admin setup.
// Usage from repo root: node scripts/smoke-hosted-stage1.mjs
import assert from 'node:assert/strict';
import {readdirSync} from 'node:fs';
const origin='https://fundamentos-ui-mobile.insany-team-1573.chatgpt.site';
const request=async(path,method='GET',headers={})=>{
 const response=await fetch(origin+path,{method,headers:{'Cache-Control':'no-cache',...headers},redirect:'manual',signal:AbortSignal.timeout(20000)});
 const text=method==='HEAD'?'':await response.text();
 // Never print bodies or cookies; summary contains only path/method/status.
 console.log(JSON.stringify({method,path,status:response.status}));
 return {response,text};
};
const paths=['/course.js','/course.json','/index.html','/app.js','/styles.css','/examples.css','/realistic-examples.css','/real-assets/inter-regular.woff2','/source/content/part-foundations.json','/dist/course.json','/guide-dist/course.json','/server/private-assets.mjs'];
try{for(const file of readdirSync('dist/server/_next/static').filter(f=>f.startsWith('route-')&&f.endsWith('.js')))paths.push('/_next/static/'+file);}catch{throw new Error('Run from the matching built checkout to test private chunk paths.');}
for(const path of paths)for(const method of ['GET','HEAD']){
 const {response,text}=await request(path,method);
 assert.equal(response.status,401,`${method} ${path}: private asset must not be delivered`);
 assert(response.headers.get('cache-control')?.includes('no-store'),`${path}: no-store missing`);
 assert(!text.includes('window.COURSE')&&!text.includes('password_hash'),'Unexpected private marker');
}
const home=await request('/');assert.equal(home.response.status,303);assert.equal(home.response.headers.get('location'),'/login');
const login=await request('/login');assert.equal(login.response.status,200);assert(login.text.includes('Use a senha compartilhada pelo professor para continuar.'));assert(login.response.headers.get('cache-control')?.includes('no-store'));
for(const headers of [{},{'oai-authenticated-user-email':'gilberto@insany.com.br','oai-authenticated-user-id':'untrusted-smoke-probe'}]){
 const result=await request('/admin/password','GET',headers);
 assert([303,401,403].includes(result.response.status),'Anonymous/spoofed caller reached administrator diagnostics');
 if(result.response.status===303)assert(result.response.headers.get('location')?.startsWith('/signin-with-chatgpt'),'Unexpected administrator redirect');
 assert(!result.text.includes('Sua identidade administrativa foi verificada'),'Dispatch identity boundary failed');
}
console.log('PASS: anonymous/direct-asset HTTP checks and forged-header rejection. No password or administrator created.');
console.log('Still required: real owner and different-user browser checks, no alternate Worker hostname, no pre-existing DB config, historical URLs/cache review and hosted resource/cost review.');

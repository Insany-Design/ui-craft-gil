import {randomToken,digest,equal,validPassword,hashPassword,verifyPassword} from './password.mjs';
export const ORIGIN='https://fundamentos-ui-mobile.insany-team-1573.chatgpt.site';
const OWNER_EMAIL='gilberto@insany.com.br'; // Verified by root using Sites get_site.
const SESSION='__Host-course_session',CSRF='__Host-course_csrf',TTL=8*60*60;
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
function cookie(req,name){
 const matches=(req.headers.get('cookie')||'').split(';').map(v=>v.trim()).filter(v=>v.startsWith(name+'='));
 return matches.length===1?matches[0].slice(name.length+1):'';
}
const setCookie=(name,value,age)=>`${name}=${value}; Path=/; Max-Age=${age}; HttpOnly; Secure; SameSite=Strict`;
export function response(body,status=200,extra={}){
 return new Response(body,{status,headers:{
  'Content-Type':'text/html; charset=utf-8','Cache-Control':'private, no-store, max-age=0',
  'CDN-Cache-Control':'no-store','Cloudflare-CDN-Cache-Control':'no-store','Pragma':'no-cache',
  'Vary':'Cookie','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer',
  'X-Robots-Tag':'noindex, nofollow, noarchive',
  'Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
  ...extra,
 }});
}
const redirect=path=>response(null,303,{Location:path});
const page=(title,content)=>`<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(title)}</title><style>body{font:18px system-ui;max-width:460px;margin:10vh auto;padding:24px;background:#fafafa;color:#1d1d1f}label,input,button{display:block;width:100%;box-sizing:border-box;margin:12px 0}input,button{padding:14px;font:inherit}button{background:#0a0a0a;color:white;border:0;border-radius:8px}input[type=checkbox]{width:auto;display:inline}a{color:#b90055}</style><main><svg role="img" aria-label="Insany" xmlns="http://www.w3.org/2000/svg" width="150" height="20" fill="none"><path fill="#040404" d="M112.99.42v12.263h-.644l-3.477-6.129L105.386.42H93.602v18.39h6.355V6.554h.663l3.476 6.128 3.479 6.129h11.769V.42zm-84.524 0v12.263h-.644l-3.479-6.129L20.86.42H9.078v18.39h6.355V6.554h.66l3.48 6.128 3.476 6.129h11.77V.42zm113.291.002-6.596 11.619L128.585.422h-8.241l6.931 12.258h7.523l-3.478 6.128h8.247L150 .422zm-135.4 0H0v18.389h6.357z"/><path fill="#FF0074" d="m77.762 12.681-3.064 3.065 3.064 3.064 3.064-3.064z"/><path fill="#040404" d="M84.36 18.808h8.243L82.17.422h-8.247l3.48 6.128h-7.54l-6.939 12.258h8.243l6.591-11.631zm-20.664-5.262v.052c.053 1.43-.337 2.539-1.176 3.379C60.303 19.2 55.123 19.2 50.1 19.2c-4.666 0-7.527-.298-9.572-1.003-2.465-.846-3.722-2.351-3.85-4.599v-.913h8.136l.098.898c.306 2.195 3.378 2.175 4.853 2.175h.218c2.06 0 4.194 0 5.033-.89a1.4 1.4 0 0 0 .366-1.13c-.12-1.088-2.426-1.401-5.924-1.867-3.228-.435-7.179-.944-9.813-2.262-1.934-.87-3.29-2.089-3.372-3.872v-.12c-.052-1.432.337-2.539 1.175-3.379C39.667 0 44.858 0 49.869 0c4.667 0 7.527.3 9.572 1.005 2.465.846 3.722 2.352 3.85 4.599v.922h-8.133l-.098-.898c-.307-2.195-3.379-2.176-4.854-2.176h-.217c-2.06 0-4.194 0-5.034.892a1.4 1.4 0 0 0-.365 1.131c.12 1.088 2.425 1.401 5.923 1.865 3.229.435 7.18.944 9.814 2.262 1.934.87 3.289 2.09 3.372 3.874z"/></svg><h1>${escape(title)}</h1>${content}</main></html>`;
const passwordNotice='Crie uma senha exclusiva para este material. Não use a senha da sua conta ChatGPT.';
const preparation=()=>response(page('Acesso em preparação','<p>O professor está preparando o acesso ao material. Aguarde a senha compartilhada por ele.</p><a href="/login">Verificar novamente</a>'));
function errorPage(message,status,back='/login',extra={}){return response(page('Não foi possível continuar',`<p role="alert">${escape(message)}</p><a href="${back}">Voltar e tentar novamente</a>`),status,extra);}
function form(admin){
 const token=randomToken();
 return response(page(admin?'Definir acesso dos alunos':'Seu guia de UI mobile',
 `<p>${admin?passwordNotice+' Use pelo menos 8 caracteres. A alteração encerra os acessos existentes.':'Use a senha compartilhada pelo professor para continuar.'}</p><form method="post" action="${admin?'/admin/password':'/login'}"><input type="hidden" name="csrf" value="${token}"><label>${admin?'Nova senha compartilhada':'Senha compartilhada'}<input type="password" name="password" autocomplete="${admin?'new-password':'current-password'}" required minlength="8" maxlength="256"></label>${admin?'<label>Confirme a nova senha compartilhada<input type="password" name="confirm" autocomplete="new-password" required minlength="8" maxlength="256"></label><label><input type="checkbox" name="acknowledge" value="yes" required>Confirmo definir a senha compartilhada dos alunos e vincular esta conta ChatGPT como administradora deste acesso.</label>':''}<button>${admin?'Salvar senha':'Entrar'}</button></form>`),200,{'Set-Cookie':setCookie(CSRF,token,1800),'Referrer-Policy':'same-origin'});
}
async function readForm(req){
 if(!req.headers.get('content-type')?.startsWith('application/x-www-form-urlencoded')||Number(req.headers.get('content-length'))>2048)return null;
 const reader=req.body?.getReader();if(!reader)return null;
 let size=0;const chunks=[];
 while(true){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>2048){await reader.cancel();return null}chunks.push(value)}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length}
 const data=new URLSearchParams(new TextDecoder().decode(bytes));
 for(const key of ['csrf','password','confirm','acknowledge'])if(data.getAll(key).length>1)return null;
 return data;
}
function validCsrf(req,data){
 return req.headers.get('origin')===ORIGIN&&['same-origin',null].includes(req.headers.get('sec-fetch-site'))&&/^[a-f0-9]{64}$/.test(data?.get('csrf')||'')&&equal(data.get('csrf'),cookie(req,CSRF));
}
async function takeRate(db,scope,limit,seconds,now){
 // Fixed number of rows: one per scope. Atomic reset and increment; never trusts
 // undocumented X-Forwarded-For/visitor-controlled headers. Saturate counter.
 const end=(Math.floor(now/seconds)+1)*seconds;
 const row=await db.prepare(`INSERT INTO course_rate (key,count,expires) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN course_rate.expires<=? THEN 1 ELSE MIN(course_rate.count+1,?) END, expires=CASE WHEN course_rate.expires<=? THEN excluded.expires ELSE course_rate.expires END RETURNING count`).bind(scope,end,now,limit+1,now).first();
 return row.count<=limit;
}
const config=db=>db.prepare('SELECT * FROM course_config WHERE id=1').first();
function owner(user,row){
 // user must come from official getChatGPTUser()/trusted dispatch, never forms.
 return !!user&&typeof user.userId==='string'&&user.userId.length>0&&user.email===OWNER_EMAIL&&(!row||row.owner_id===user.userId);
}
async function authenticated(db,req,now){
 const token=cookie(req,SESSION);if(!/^[a-f0-9]{64}$/.test(token))return false;
 return !!await db.prepare('SELECT s.token_hash FROM course_sessions s JOIN course_config c ON c.id=1 AND c.epoch=s.epoch WHERE s.token_hash=? AND s.expires>?').bind(digest(token),now).first();
}
export function createGate({db,assets,getIdentity,setupEnabled=false,now=()=>Math.floor(Date.now()/1000)}){
 return async function handle(req){
  try{
   const url=new URL(req.url);
   if(url.origin!==ORIGIN)return response('Origem inválida.',400);
   if(!db)return errorPage('Acesso temporariamente indisponível.',503);
   const seconds=now();
   if(url.pathname==='/login'||url.pathname==='/admin/password'){
    const admin=url.pathname==='/admin/password',row=await config(db);
    let identity=null;
    if(admin){
     identity=await getIdentity();
     if(!identity)return redirect('/signin-with-chatgpt?return_to=%2Fadmin%2Fpassword');
     if(!owner(identity,row))return errorPage('Acesso restrito ao professor.',403);
     if(!setupEnabled)return req.method==='GET'?response(page('Identidade verificada',`<p>Sua identidade administrativa foi verificada. A definição da senha ainda está desabilitada enquanto concluímos a validação de segurança.</p><p>${passwordNotice}</p>`)):errorPage('Configuração administrativa desabilitada.',503,'/admin/password');
    }
    if(req.method==='GET')return !admin&&!row?preparation():form(admin);
    if(req.method!=='POST')return response('Método não permitido.',405,{Allow:'GET, POST'});
    const data=await readForm(req);
    if(!data||!validCsrf(req,data))return errorPage('Reabra o formulário e tente novamente.',403,admin?'/admin/password':'/login');
    if(!await takeRate(db,admin?'admin':'login',admin?5:30,60,seconds))return errorPage('Aguarde um minuto e tente novamente.',429,admin?'/admin/password':'/login',{'Retry-After':'60'});
    const password=data.get('password');
    if(admin){
     if(data.get('acknowledge')!=='yes')return errorPage('Confirme a definição do acesso administrativo.',400,'/admin/password');
     if(!validPassword(password))return errorPage('A senha não atende ao tamanho permitido. Use pelo menos 8 caracteres.',400,'/admin/password');
     if(password!==data.get('confirm'))return errorPage('A confirmação não coincide. Digite a mesma nova senha nos dois campos.',400,'/admin/password');
     const hashed=await hashPassword(password),epoch=randomToken();
     const saved=await db.batch([
      db.prepare(`INSERT INTO course_config (id,owner_id,password_hash,epoch) VALUES(1,?,?,?) ON CONFLICT(id) DO UPDATE SET password_hash=excluded.password_hash,epoch=excluded.epoch WHERE course_config.owner_id=excluded.owner_id`).bind(identity.userId,hashed,epoch),
      db.prepare('DELETE FROM course_sessions WHERE EXISTS (SELECT 1 FROM course_config WHERE id=1 AND owner_id=? AND epoch=?)').bind(identity.userId,epoch),
     ]);
     if(saved[0].meta.changes!==1)return errorPage('Configuração alterada. Reabra a página administrativa.',409,'/admin/password');
     return response(page('Senha salva','<p>Compartilhe a senha com seus alunos pelo canal escolhido. Os acessos anteriores foram encerrados.</p><a href="/login">Abrir guia</a>'),200,{'Set-Cookie':setCookie(CSRF,'',0)});
    }
    if(!row)return errorPage('O professor ainda está preparando o acesso. Aguarde a senha compartilhada por ele.',503);
    if(!await verifyPassword(password,row.password_hash))return errorPage('Senha inválida. Confira a senha compartilhada pelo professor e tente novamente.',401);
    const token=randomToken();
    const result=await db.prepare('INSERT INTO course_sessions (token_hash,epoch,expires) SELECT ?,epoch,? FROM course_config WHERE id=1 AND epoch=?').bind(digest(token),seconds+TTL,row.epoch).run();
    if(result.meta.changes!==1)return errorPage('O acesso foi atualizado. Tente novamente.',409);
    await db.prepare('DELETE FROM course_sessions WHERE expires<?').bind(seconds).run();
    const out=redirect('/');out.headers.append('Set-Cookie',setCookie(SESSION,token,TTL));out.headers.append('Set-Cookie',setCookie(CSRF,'',0));return out;
   }
   if(url.pathname==='/logout'){
    if(req.method==='GET'){
     const token=randomToken();return response(page('Sair do guia',`<p>Ao sair, você encerra o acesso neste navegador. Seu progresso salvo não será apagado.</p><form method="post"><input type="hidden" name="csrf" value="${token}"><button>Sair</button></form><p><a href="/">Continuar estudando</a></p>`),200,{'Set-Cookie':setCookie(CSRF,token,1800),'Referrer-Policy':'same-origin'});
    }
    if(req.method!=='POST')return response('Método não permitido.',405);
    const data=await readForm(req);if(!data||!validCsrf(req,data))return errorPage('Reabra o formulário.',403,'/logout');
    const token=cookie(req,SESSION);if(/^[a-f0-9]{64}$/.test(token))await db.prepare('DELETE FROM course_sessions WHERE token_hash=?').bind(digest(token)).run();
    const out=redirect('/login');out.headers.append('Set-Cookie',setCookie(SESSION,'',0));out.headers.append('Set-Cookie',setCookie(CSRF,'',0));return out;
   }
   if(!['GET','HEAD'].includes(req.method))return response('Método não permitido.',405);
   // Authorization precedes every course asset, including HTML, JSON, JS and fonts.
   if(!await authenticated(db,req,seconds))return url.pathname==='/'?redirect('/login'):response('Autenticação necessária.',401);
   const path=url.pathname==='/'?'/index.html':url.pathname;
   const asset=Object.hasOwn(assets,path)?assets[path]:null;
   if(!asset)return response('Não encontrado.',404);
   return response(req.method==='HEAD'?null:Buffer.from(asset.base64,'base64'),200,{'Content-Type':asset.type});
  }catch{
   // No error object, request body, password, hash, token or cookie logging.
   return errorPage('Acesso temporariamente indisponível.',503);
  }
 };
}

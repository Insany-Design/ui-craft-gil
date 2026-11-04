// Public guide: serve only the generated asset allowlist, without accounts or D1.
export function createPublicGuide(assets){
 return function handle(request){
  const url=new URL(request.url),head=request.method==='HEAD';
  const headers={
   'Cache-Control':'no-store',
   'X-Content-Type-Options':'nosniff',
   'Referrer-Policy':'strict-origin-when-cross-origin',
   'Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-src https://www.youtube-nocookie.com; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
  };
  if(!['GET','HEAD'].includes(request.method))return new Response('Método não permitido.',{status:405,headers:{...headers,Allow:'GET, HEAD'}});
  // Old links should take readers directly to the guide. URL fragments survive redirects.
  if(['/login','/logout'].includes(url.pathname))return new Response(null,{status:303,headers:{...headers,Location:'/'}});
  const path=url.pathname==='/'?'/index.html':url.pathname;
  const asset=Object.hasOwn(assets,path)?assets[path]:null;
  if(!asset)return new Response(head?null:'Não encontrado.',{status:404,headers});
  return new Response(head?null:Buffer.from(asset.base64,'base64'),{status:200,headers:{...headers,'Content-Type':asset.type}});
 };
}

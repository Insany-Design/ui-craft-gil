'use strict';
(() => {
  const course=window.COURSE, main=document.querySelector('#main');
  if(!course?.chapters?.length){main.innerHTML='<h1>Não foi possível abrir o guia.</h1><p>Recarregue a página para tentar novamente.</p>';return;}
  const chapters=course.chapters, byId=new Map(chapters.map((c,i)=>[c.id,{...c,index:i}]));
  const KEY='ui-craft-study-v1', OLD_KEY='ui-mobile-study-v2';
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const plain=s=>String(s).replace(/<[^>]*>/g,' '), norm=s=>plain(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const index=new Map(chapters.map(c=>[c.id,norm([c.title,c.subtitle,c.callout,...c.sections.map(s=>s.title+' '+s.body),c.application,...(c.concepts||[]).map(v=>[v.title,v.context,v.observation,v.application].join(' '))].join(' '))]));
  const icon=(name,cls='')=>`<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${({search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/>',heart:'<path d="M20 5c-3-3-7-1-8 1-2-3-6-4-9-1-4 4 2 10 9 15 7-5 12-11 8-15Z"/>',home:'<path d="m3 10 9-7 9 7v11H3Z M9 21v-8h6v8"/>',check:'<path d="m5 12 4 4L19 6"/>',arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',pin:'<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',alert:'<path d="m12 3 10 18H2Z M12 9v5 M12 17v.1"/>'})[name]||''}</svg>`;
  const state={completed:[],lastChapter:null,positions:{},previousEdition:null};
  let active='inicio',storageWorks=true,scrollTimer,importMessage='',disposeAtlas=()=>{};
  function previous(raw){
    if(!raw||!Array.isArray(raw.completed))return null;
    const id=v=>typeof v==='string'&&/^[a-z0-9-]{1,100}$/.test(v);
    const positions=Object.fromEntries(Object.entries(raw.positions||{}).filter(([k,v])=>id(k)&&Number.isFinite(v)&&v>=0&&v<1e7));
    return {schemaVersion:2,course:'ui-mobile',completed:[...new Set(raw.completed.filter(id))].slice(0,1000),positions,lastLesson:id(raw.lastLesson)?raw.lastLesson:null,archived:raw.archived?{completed:Array.isArray(raw.archived.completed)?raw.archived.completed.filter(id).slice(0,1000):[],positions:Object.fromEntries(Object.entries(raw.archived.positions||{}).filter(([k,v])=>id(k)&&Number.isFinite(v)&&v>=0&&v<1e7)),lastLesson:id(raw.archived.lastLesson)?raw.archived.lastLesson:null}:null};
  }
  function clean(raw){
    if(!raw||raw.course!=='ui-craft'||raw.schemaVersion!==1||!Array.isArray(raw.completed))throw Error('Use um arquivo de progresso exportado por este guia.');
    return {completed:[...new Set(raw.completed.filter(id=>byId.has(id)))],lastChapter:byId.has(raw.lastChapter)?raw.lastChapter:null,positions:Object.fromEntries(Object.entries(raw.positions||{}).filter(([id,y])=>byId.has(id)&&Number.isFinite(y)&&y>=0&&y<1e7)),previousEdition:previous(raw.previousEdition)};
  }
  try{const saved=localStorage.getItem(KEY);if(saved)Object.assign(state,clean(JSON.parse(saved)));if(!state.previousEdition){const old=localStorage.getItem(OLD_KEY);if(old)state.previousEdition=previous(JSON.parse(old));}}catch{ /* Keep the older edition untouched, including malformed data. */ }
  // Reading preference is independent from progress; never overwrite its storage keys.
  const FONT_KEY='ui-craft-font-size-v1';let fontSize=16;
  try{const savedFont=Number(localStorage.getItem(FONT_KEY));if(Number.isInteger(savedFont)&&savedFont>=14&&savedFont<=20)fontSize=savedFont;}catch{}
  function applyFont(save=false){
    document.querySelector('html').style.fontSize=fontSize+'px';
    document.querySelector('#font-size-label').textContent=Math.round(fontSize/16*100)+'%';
    document.querySelector('#font-decrease').disabled=fontSize===14;
    document.querySelector('#font-increase').disabled=fontSize===20;
    if(save){try{localStorage.setItem(FONT_KEY,String(fontSize));}catch{}document.querySelector('#announcement').textContent='Tamanho do texto: '+Math.round(fontSize/16*100)+'%.';}
  }
  applyFont();
  const done=id=>state.completed.includes(id);
  function persist(){try{localStorage.setItem(KEY,JSON.stringify({schemaVersion:1,course:'ui-craft',...state}));}catch{storageWorks=false;}document.querySelector('#storage-warning').hidden=storageWorks;}
  function savePosition(){if(byId.has(active)){state.positions[active]=window.scrollY;persist();}}
  const footer=()=>'<footer class="page-footer"><span>Design Boost · Craft de UI</span><span>Exemplos autorais · Novembro de 2026</span><p>Seu progresso fica neste navegador. Rota é um aplicativo fictício usado nas comparações.</p></footer>';
  function syncBreadcrumb(){
    const chapter=byId.get(active);
    const current=chapter?.title||({inicio:'Guia de craft',progresso:'Meu progresso',biblioteca:'Referências e vídeos'})[active];
    document.querySelector('#header-breadcrumb').innerHTML=active==='inicio'?'<li><span aria-current="page">Guia de craft</span></li>':`<li class="breadcrumb-root"><a href="#inicio">Guia de craft</a></li><li class="breadcrumb-current"><span class="breadcrumb-divider" aria-hidden="true">/</span><span aria-current="page" title="${esc(current)}">${esc(current)}</span></li>`;
  }
  function syncProgress(){
    const count=state.completed.length,percent=Math.round(count/chapters.length*100);
    document.querySelector('#total-label').textContent=`${count} de ${chapters.length} capítulos`;
    document.querySelector('#completion-percent').textContent=percent+'%';
    document.querySelector('#completion-fill').style.width=percent+'%';
    document.querySelector('#progress-link').setAttribute('aria-label',`${percent}% concluído · ${count} de ${chapters.length} capítulos lidos. Ver meu progresso.`);
    document.querySelectorAll('[data-complete]').forEach(el=>{el.setAttribute('aria-pressed',String(done(el.dataset.complete)));el.innerHTML=(done(el.dataset.complete)?icon('check'):'')+(done(el.dataset.complete)?'Capítulo lido':'Marcar como lido');});
    renderNav(document.querySelector('#course-search').value);
  }
  const groups={0:'01 — Fundamentos',5:'02 — Sistemas visuais',9:'03 — Acabamento e interação'};
  function renderNav(query=''){
    const terms=norm(query).trim().split(/\s+/).filter(Boolean);let count=0;
    let html=`<a class="nav-start" href="#inicio" ${active==='inicio'?'aria-current="page"':''}>Sobre este guia</a>`;
    chapters.forEach((c,i)=>{if(!terms.length&&groups[i])html+=`<p class="nav-label">${groups[i]}</p>`;if(!terms.every(t=>index.get(c.id).includes(t)))return;count++;html+=`<a class="chapter-link" href="#${c.id}" ${active===c.id?'aria-current="page"':''}><span class="nav-number">${String(i+1).padStart(2,'0')}</span><span>${esc(c.title)}</span>${done(c.id)?`<span class="nav-done" aria-label="lido">${icon('check')}</span>`:''}</a>`;});
    document.querySelector('#course-nav').innerHTML=html;
    document.querySelector('#search-status').textContent=terms.length?(count?`${count} ${count===1?'capítulo encontrado':'capítulos encontrados'}`:'Nenhum capítulo encontrado. Tente outro termo.'):'';
    document.querySelectorAll('.utility-nav a').forEach(a=>{if(a.hash==='#'+active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  }
  function overview(){
    const resume=state.lastChapter||chapters[0].id;
    return `<div class="overview"><p class="eyebrow">DESIGN BOOST · GUIA DE CRAFT</p><h1>O detalhe<br>muda tudo<span class="accent">.</span></h1><p class="intro">Um olhar mais atento para a qualidade visual das interfaces. Do fundamento ao acabamento, entenda o que faz uma tela parecer mais clara, coerente e bem resolvida.</p><a class="text-link start-link" href="#${resume}">${state.lastChapter?'Continuar a leitura':'Começar pelo fundamento'} ${icon('arrow')}</a><div class="overview-note"><span>14 capítulos</span><span>120 exemplos comentados</span><span>Exemplos visuais</span></div><section class="about-guide"><h2>Aprender a ver. Aprender a decidir.</h2><p>Craft é o cuidado com a execução. É perceber quando um título compete com outro, quando um espaço rompe o ritmo ou quando um ícone parece pesado demais. E saber o que ajustar.</p><p>Cada conceito reúne contexto de uso, uma demonstração visual e uma aplicação na interface. As legendas indicam o que observar; as referências ajudam a continuar estudando. Leia na ordem ou abra um assunto pelo índice.</p></section><section class="chapter-index" aria-label="Percurso de leitura">${chapters.map((c,i)=>`${groups[i]?`<h2 class="index-group">${groups[i]}</h2>`:''}<a href="#${c.id}" class="index-row"><span class="index-number">${String(i+1).padStart(2,'0')}</span><span><strong>${esc(c.title)}</strong><small>${esc(c.subtitle)}</small></span>${icon(done(c.id)?'check':'arrow')}</a>`).join('')}</section>${footer()}</div>`;
  }
  function conceptFigure(chapter,item,index){
    const interactive=/data-toggle|data-opt|id="(?:liveBtn|skinA|playBtn)"|liftcard/.test(item.visualHtml);
    return `<figure class="concept-visual" aria-label="Exemplo de ${esc(item.title)}"><div class="example-heading"><span>EXEMPLO ${String(index+1).padStart(2,'0')}</span><span>${interactive?'INTERATIVO':'COMPARE E OBSERVE'}</span></div><div class="concept-canvas">${item.visualHtml}</div><figcaption><span class="observation-label">O que observar</span><p>${esc(item.observation)}</p></figcaption>${interactive?'<p class="example-status sr-only" role="status" aria-live="polite"></p>':''}</figure>`;
  }
  function sources(items){return `<ul class="resource-list">${items.map(r=>`<li><a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer"><span class="resource-kind">${esc(r.kind)}</span><span class="resource-info"><strong>${esc(r.title)}</strong><small>${esc(r.note)}<span class="sr-only"> · abre em nova aba</span></small></span><span aria-hidden="true">↗</span></a></li>`).join('')}</ul>`;}
  function videos(c){
    if(!c.videos?.length)return '';
    return `<section class="chapter-videos" aria-label="Vídeos deste capítulo"><h2>Veja o conceito em vídeo</h2><p>Vídeos em inglês, com um roteiro de observação em português. O player externo só carrega quando você escolhe assistir.</p>${c.videos.map(v=>`<div class="video-study"><h3>${esc(v.title)}</h3><p class="video-author">${esc(v.author)} · Em inglês</p><p>${esc(v.note)}</p><div class="video-player" data-video-container="${esc(v.id)}"><button type="button" class="video-load" data-video="${esc(v.id)}" aria-label="Carregar vídeo: ${esc(v.title)}"><span aria-hidden="true">▶</span> Assistir nesta página</button></div><p class="video-privacy">Ao carregar, o YouTube recebe dados de conexão. Se o player não abrir, use o link abaixo. A disponibilidade de legendas depende do vídeo.</p><div class="video-links"><a href="https://www.youtube.com/watch?v=${esc(v.id)}" target="_blank" rel="noopener noreferrer">Abrir no YouTube<span class="sr-only"> (abre em nova aba)</span></a><a href="${esc(v.source)}" target="_blank" rel="noopener noreferrer">Fonte e contexto<span class="sr-only"> (abre em nova aba)</span></a></div></div>`).join('')}</section>`;
  }
  function article(c){
    return `<article class="chapter"><header class="chapter-header"><p class="eyebrow">CAPÍTULO ${String(c.index+1).padStart(2,'0')} <span class="eyebrow-divider">/</span> CRAFT DE UI</p><h1>${esc(c.title)}</h1><p class="intro">${esc(c.subtitle)}</p><p class="read-time">${c.minutes} min de leitura · ${c.concepts.length} conceitos com exemplos</p></header><aside class="callout"><span aria-hidden="true">↳</span><p>${esc(c.callout)}</p></aside><div class="prose"><div class="chapter-context">${c.introduction}</div><nav class="concept-jumps" aria-label="Conceitos deste capítulo">${c.concepts.map((item,i)=>`<a href="#${c.id}--${item.id}"><span>${String(i+1).padStart(2,'0')}</span>${esc(item.title)}</a>`).join('')}</nav>${c.concepts.map((item,i)=>`<section class="concept-section" id="${c.id}--${item.id}"><p class="concept-number">${String(i+1).padStart(2,'0')} / ${String(c.concepts.length).padStart(2,'0')}</p><h2>${esc(item.title)}</h2><p class="concept-context">${esc(item.context)}</p>${conceptFigure(c,item,i)}<div class="concept-application"><span class="application-label">Na interface</span><p>${esc(item.application)}</p></div></section>`).join('')}${videos(c)}<section class="resources" id="${c.id}--referencias"><h2>Continue estudando</h2><p class="resource-intro">Referências para aprofundar este assunto.</p>${sources(c.sources)}</section></div><div class="chapter-end"><button class="read-button" data-complete="${c.id}" aria-pressed="${done(c.id)}">${done(c.id)?icon('check'):''}${done(c.id)?'Capítulo lido':'Marcar como lido'}</button><span>Salvo neste navegador</span></div><nav class="pagination" aria-label="Continuar a leitura">${c.index?`<a href="#${chapters[c.index-1].id}"><small>← Anterior</small><strong>${esc(chapters[c.index-1].title)}</strong></a>`:'<a href="#inicio"><small>← Voltar</small><strong>Sobre este guia</strong></a>'}${c.index<chapters.length-1?`<a href="#${chapters[c.index+1].id}"><small>Próximo →</small><strong>${esc(chapters[c.index+1].title)}</strong></a>`:'<a href="#progresso"><small>Continuar →</small><strong>Meu progresso</strong></a>'}</nav>${footer()}</article>`;
  }
  function library(){return `<div class="utility-page"><p class="eyebrow">PARA IR ALÉM</p><h1>Referências<br>e vídeos<span class="accent">.</span></h1><p class="intro">Leituras e aulas ligadas às decisões de cada capítulo. As referências externas estão em inglês.</p>${chapters.map(c=>`<section class="library-group"><h2><a href="#${c.id}">${esc(c.title)}</a></h2>${sources(c.sources)}</section>`).join('')}${footer()}</div>`;}
  function progress(){return `<div class="utility-page"><p class="eyebrow">NO SEU RITMO</p><h1>Meu progresso<span class="accent">.</span></h1><p class="intro">${state.completed.length} de ${chapters.length} capítulos lidos.</p><progress value="${state.completed.length}" max="${chapters.length}" aria-label="Capítulos lidos"></progress><div class="progress-list">${chapters.map((c,i)=>`<a href="#${c.id}"><span>${String(i+1).padStart(2,'0')} · ${esc(c.title)}</span><span>${done(c.id)?icon('check'):'A ler'}</span></a>`).join('')}</div><section class="progress-tools"><h2>Guarde uma cópia</h2><p>As marcações de leitura, a última página e a posição ficam no armazenamento local deste navegador (localStorage), não em um cookie. Elas continuam aqui quando você fecha o guia ou escolhe “Sair”.</p><p>O cookie de sessão serve apenas para liberar o acesso com a senha compartilhada. Sair encerra essa sessão, sem apagar suas leituras. Não há sincronização automática entre dispositivos.</p><p>Limpar os dados do site ou usar outro navegador pode remover esse histórico. Em navegação privada, ele pode desaparecer ao fechar a sessão. Exporte uma cópia para guardar ou levar a leitura para outro aparelho.</p><div class="button-row"><button id="export-progress">Exportar progresso</button><button id="import-progress">Importar progresso</button><input id="progress-file" type="file" accept=".json,application/json" hidden></div><p id="import-status" role="status">${esc(importMessage)}</p>${state.previousEdition?`<p class="previous-edition">Seu histórico da edição anterior foi preservado e acompanha a exportação. Os novos capítulos têm marcações próprias.</p>`:''}</section>${footer()}</div>`;}
  function syncNav(){const mobile=innerWidth<=900,open=document.body.classList.contains('nav-open');const sidebar=document.querySelector('#sidebar');sidebar.inert=mobile&&!open;document.querySelector('.menu-toggle').setAttribute('aria-expanded',String(mobile&&open));document.querySelector('.nav-backdrop').hidden=!mobile||!open;}
  function closeNav(focus=false){const opened=document.body.classList.contains('nav-open');document.body.classList.remove('nav-open');syncNav();if(focus&&opened)document.querySelector('.menu-toggle').focus();}
  function openNav(){document.body.classList.add('nav-open');syncNav();document.querySelector('#course-search').focus();}
  function render(initial=false){
    disposeAtlas();let route;try{route=decodeURIComponent(location.hash.slice(1)||'inicio');}catch{route='inicio';}
    let [id,section]=route.split('--');id=course.aliases[id]||id;if(id==='glossario')id='biblioteca';
    active=byId.has(id)||['inicio','biblioteca','progresso'].includes(id)?id:'inicio';
    closeNav();const c=byId.get(active);
    if(c){state.lastChapter=c.id;persist();main.innerHTML=article(c);}else main.innerHTML=active==='biblioteca'?library():active==='progresso'?progress():overview();
    document.title=(c?.title||(active==='inicio'?'Craft de UI':active==='biblioteca'?'Referências e vídeos':'Meu progresso'))+' · Design Boost';
    syncBreadcrumb();syncProgress();if(!initial)main.focus({preventScroll:true});
    requestAnimationFrame(()=>{if(section)document.getElementById(active+'--'+section)?.scrollIntoView({block:'start'});else window.scrollTo({top:initial&&c?state.positions[c.id]||0:0,behavior:'instant'});});
    if(window.mountCraftAtlas)disposeAtlas=window.mountCraftAtlas(main);
  }
  document.querySelector('#course-search').addEventListener('input',e=>renderNav(e.target.value));
  document.querySelector('.menu-toggle').addEventListener('click',()=>document.body.classList.contains('nav-open')?closeNav(true):openNav());
  document.querySelector('.menu-close').addEventListener('click',()=>closeNav(true));document.querySelector('.nav-backdrop').addEventListener('click',()=>closeNav(true));
  document.addEventListener('keydown',e=>{if(!document.body.classList.contains('nav-open'))return;if(e.key==='Escape'){e.preventDefault();closeNav(true);}if(e.key==='Tab'){const els=[...document.querySelector('#sidebar').querySelectorAll('a[href],button,input')].filter(el=>el.offsetParent!==null);if(e.shiftKey&&document.activeElement===els[0]){e.preventDefault();els.at(-1).focus();}else if(!e.shiftKey&&document.activeElement===els.at(-1)){e.preventDefault();els[0].focus();}}});
  document.addEventListener('click',e=>{
    if(e.target.closest('#font-increase')){fontSize=Math.min(20,fontSize+1);applyFont(true);return;}
    if(e.target.closest('#font-decrease')){fontSize=Math.max(14,fontSize-1);applyFont(true);return;}

    const videoButton=e.target.closest('[data-video]');
    if(videoButton){const c=byId.get(active),v=c?.videos?.find(v=>v.id===videoButton.dataset.video);if(!v)return;const holder=videoButton.closest('.video-player');const frame=document.createElement('iframe');frame.src='https://www.youtube-nocookie.com/embed/'+v.id;frame.title=v.title+' · '+v.author;frame.allow='encrypted-media; picture-in-picture; fullscreen';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';holder.replaceChildren(frame);frame.focus();return;}
    const mark=e.target.closest('[data-complete]');if(mark){const id=mark.dataset.complete;if(!byId.has(id))return;state.completed=done(id)?state.completed.filter(v=>v!==id):[...state.completed,id];persist();syncProgress();document.querySelector('#announcement').textContent=done(id)?'Capítulo marcado como lido.':'Marcação removida.';return;}
    if(e.target.closest('a[href^="#"]'))savePosition();
    if(e.target.closest('#export-progress')){savePosition();const blob=new Blob([JSON.stringify({schemaVersion:1,course:'ui-craft',...state},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='craft-ui-progresso.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);document.querySelector('#import-status').textContent='Cópia preparada para download.';}
    if(e.target.closest('#import-progress'))document.querySelector('#progress-file').click();
  });
  document.addEventListener('change',async e=>{if(e.target.id!=='progress-file')return;const file=e.target.files[0];if(!file)return;try{if(file.size>1024*1024)throw Error('O arquivo é muito grande.');const raw=JSON.parse(await file.text());if(raw.course==='ui-mobile'&&(raw.schemaVersion===2||raw.schemaVersion===undefined)&&Array.isArray(raw.completed)){state.previousEdition=previous(raw);importMessage='Histórico da edição anterior preservado. Os capítulos desta edição mantêm marcações próprias.';}else{const incoming=clean(raw);state.completed=[...new Set([...state.completed,...incoming.completed])];state.positions={...state.positions,...incoming.positions};state.lastChapter=incoming.lastChapter||state.lastChapter;state.previousEdition=incoming.previousEdition||state.previousEdition;importMessage='Progresso importado. Suas marcações foram preservadas.';}persist();render();}catch(err){document.querySelector('#import-status').textContent=err instanceof SyntaxError?'O arquivo não contém um JSON válido.':err.message;}e.target.value='';});
  window.addEventListener('hashchange',()=>{savePosition();render();});window.addEventListener('scroll',()=>{clearTimeout(scrollTimer);scrollTimer=setTimeout(savePosition,350);},{passive:true});window.addEventListener('beforeunload',savePosition);window.addEventListener('resize',()=>{if(innerWidth>900)closeNav();syncNav();});document.addEventListener('visibilitychange',()=>{if(document.hidden)savePosition();});
  render(true);
})();

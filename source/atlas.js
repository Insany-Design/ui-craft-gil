'use strict';
// Mount the deliberate interactions in each chapter's visual examples.
window.mountCraftAtlas = function(root) {
  const timers=[];
  const announce=(figure,message)=>{const status=figure.querySelector('.example-status');if(status)status.textContent=message;};
  const skin=b=>{const card=root.querySelector('#brandCard');if(!card)return;card.classList.toggle('skin-b',b);card.classList.toggle('skin-a',!b);root.querySelector('#skinA').setAttribute('aria-pressed',String(!b));root.querySelector('#skinB').setAttribute('aria-pressed',String(b));};
  const optical=(id,on)=>{const el=document.getElementById(id);if(!el||!root.contains(el))return;el.classList.toggle('optical',on);const figure=el.closest('figure');figure.querySelectorAll('[data-opt]').forEach(button=>button.setAttribute('aria-pressed',String((button.dataset.on==='1')===on)));announce(figure,on?'Compensação óptica aplicada.':'Alinhamento geométrico aplicado.');};
  function click(event){
    const figure=event.target.closest('.concept-visual');if(!figure)return;
    const toggle=event.target.closest('[data-toggle]');
    if(toggle){const target=document.getElementById(toggle.dataset.toggle);if(!target||!figure.contains(target))return;const on=target.classList.toggle('on');toggle.setAttribute('aria-pressed',String(on));announce(figure,on?'Os pontos estão organizados em três grupos.':'Os pontos estão com intervalos equivalentes.');return;}
    const opt=event.target.closest('[data-opt]');if(opt){optical(opt.dataset.opt,opt.dataset.on==='1');return;}
    if(event.target.closest('#playBtn')){const play=figure.querySelector('#playBtn');optical('playBtn',!play.classList.contains('optical'));return;}
    if(event.target.closest('#skinA')){skin(false);announce(figure,'Meridian: tratamento sóbrio e editorial.');return;}
    if(event.target.closest('#skinB')){skin(true);announce(figure,'Pulse: tratamento expressivo e arredondado.');return;}
    const live=event.target.closest('#liveBtn');if(live){
      if(live.getAttribute('aria-disabled')==='true')return;
      live.setAttribute('aria-disabled','true');live.innerHTML='<span class="spin" aria-hidden="true"></span> Enviando…';
      const hint=figure.querySelector('#liveHint');hint.textContent='Estado: processamento. Nenhum pedido será enviado.';
      timers.push(setTimeout(()=>{live.setAttribute('aria-disabled','false');live.classList.add('success');live.textContent='✓ Enviar novamente';hint.textContent='Pedido enviado — confirmação fictícia da demonstração.';announce(figure,'A demonstração passou de processamento para sucesso.');},1100));return;
    }
  }
  root.addEventListener('click',click);
  root.querySelectorAll('.concept-canvas input').forEach((input,i)=>{
    if(!input.getAttribute('aria-label')&&!input.labels?.length)input.setAttribute('aria-label',`Exemplo de ${input.placeholder||input.closest('.concept-section')?.querySelector('h2')?.textContent||'campo'} · ${i+1}`);
    input.setAttribute('autocomplete','off');if(input.readOnly)input.tabIndex=-1;
  });
  root.querySelectorAll('.concept-canvas svg').forEach(svg=>svg.setAttribute('aria-hidden','true'));
  root.querySelectorAll('[data-toggle]').forEach(button=>button.setAttribute('aria-pressed','false'));
  root.querySelectorAll('.liftcard').forEach(el=>{el.tabIndex=0;el.setAttribute('role','img');el.setAttribute('aria-label','Exemplo de elevação: passe o ponteiro ou use Tab para observar a mudança.');});
  root.querySelectorAll('.concept-canvas .sbtn:not(#liveBtn)').forEach(button=>{button.tabIndex=-1;button.setAttribute('aria-label','Amostra visual do estado '+button.textContent);});
  function luminance(hex){const n=hex.replace('#','');const c=[0,2,4].map(i=>{const v=parseInt(n.slice(i,i+2),16)/255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;});return c[0]*.2126+c[1]*.7152+c[2]*.0722;}
  root.querySelectorAll('.ccard').forEach(card=>{const a=luminance(card.dataset.fg),b=luminance(card.dataset.bg),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);card.querySelector('.ratio').textContent=ratio.toFixed(1)+':1';const badge=card.querySelector('.badge');badge.textContent=ratio>=4.5?'Passa AA para este texto':'Não passa AA para este texto';badge.classList.add(ratio>=4.5?'contrast-pass':'contrast-fail');});
  return ()=>{root.removeEventListener('click',click);timers.forEach(clearTimeout);};
};

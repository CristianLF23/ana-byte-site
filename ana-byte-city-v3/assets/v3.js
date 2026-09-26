(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const catalog=window.ANA_CATALOG||[], base=document.body.dataset.base||'';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let effectsPaused=false;
  const rail=$('.rail');
  const updateHeader=()=>rail?.classList.toggle('is-scrolled',scrollY>80);
  addEventListener('scroll',updateHeader,{passive:true});updateHeader();
  const whatsapp=window.ANA_CONTACT?.whatsappUrl||'https://wa.me/5511919007582';
  const contactFor=w=>whatsapp+'?text='+encodeURIComponent(`Oi, Ana! Conheci a obra “${w.title}” no seu site e quero conversar sobre uma ideia nessa direção.`);
  const menu=$('.menu-toggle'), nav=$('#main-nav'), scrim=$('.menu-scrim');
  function closeMenu(restore=false){nav.classList.remove('is-open');menu?.setAttribute('aria-expanded','false');menu?.setAttribute('aria-label','Abrir navegação');scrim.hidden=true;if(restore)menu?.focus()}
  menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Fechar navegação':'Abrir navegação');nav.classList.toggle('is-open',open);scrim.hidden=!open});
  scrim?.addEventListener('click',()=>closeMenu(true));
  nav?.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('is-open'))closeMenu(true)});
  matchMedia('(min-width:1024px)').addEventListener('change',e=>{if(e.matches)closeMenu()});
  $('.menu-effects')?.addEventListener('click',()=>{$('.ambience-toggle')?.click();const b=$('.menu-effects');b.setAttribute('aria-pressed',String(effectsPaused));b.textContent=effectsPaused?'Ativar atmosfera':'Pausar atmosfera'});

  // The browser owns scrolling; chapter highlighting follows the real document.
  if(document.body.dataset.page==='inicio'){
    const sections=$$('main>section[id]');
    const active=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){$$('[data-nav]').forEach(a=>{if(a.dataset.nav===entry.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})}}, {rootMargin:'-18% 0px -55% 0px'});
    sections.forEach(s=>active.observe(s));
    $$('[data-nav]').forEach(a=>{if(a.dataset.nav!=='trabalhos'&&a.dataset.nav!=='sobre')return;const id=a.dataset.nav;a.href='#'+id});
  }

  const dialog=$('.art-dialog');
  let detailIndex=0, returnFocus=null, selectedId=catalog[0]?.id, filter='all', galleryPage=0, sort='curated';
  function setDetail(index){
    detailIndex=(index+catalog.length)%catalog.length;
    const w=catalog[detailIndex];if(!w)return;
    const image=$('[data-detail-image]');image.src=base+w.src;image.alt=w.alt;image.style.objectPosition=w.desktopPosition;
    for(const key of ['title','kind','description','technique','difference'])$(`[data-detail-${key}]`).textContent=w[key];
    $('[data-detail-counter]').textContent=String(detailIndex+1).padStart(2,'0')+' / '+catalog.length;
    $('[data-detail-contact]').href=contactFor(w);
    $('.share-status').textContent='';
    for(const next of [-1,1]){const preload=new Image();preload.src=base+catalog[(detailIndex+next+catalog.length)%catalog.length].src}
    if(!reduced.matches&&window.gsap){gsap.fromTo('.annotation-line',{scaleX:0},{scaleX:1,duration:.55,stagger:.12,ease:'power2.out'});gsap.fromTo('.detail-copy>h2,.detail-notes p',{y:9,opacity:.4},{y:0,opacity:1,duration:.35,stagger:.04})}
  }
  function openArt(id,source){const idx=catalog.findIndex(w=>w.id===id);if(idx<0)return;returnFocus=source||document.activeElement;setDetail(idx);dialog.showModal();document.body.classList.add('modal-open');$('.dialog-close').focus({preventScroll:true});if(!reduced.matches)dialog.animate([{opacity:0,transform:'translateY(16px) scale(.975)'},{opacity:1,transform:'none'}],{duration:360,easing:'cubic-bezier(.2,.8,.2,1)'});}
  function closeArt(){dialog.close()}
  $('.dialog-close')?.addEventListener('click',closeArt);
  dialog?.addEventListener('close',()=>{document.body.classList.remove('modal-open');returnFocus?.focus({preventScroll:true});if(location.hash.startsWith('#obra=')){const url=new URL(location.href);url.hash='';history.replaceState(null,'',url)}});
  dialog?.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeArt()}});
  $('.detail-prev')?.addEventListener('click',()=>setDetail(detailIndex-1));
  $('.detail-next')?.addEventListener('click',()=>setDetail(detailIndex+1));
  dialog?.addEventListener('keydown',e=>{if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;if(e.key==='ArrowLeft'){e.preventDefault();setDetail(detailIndex-1)}if(e.key==='ArrowRight'){e.preventDefault();setDetail(detailIndex+1)}});
  dialog?.addEventListener('keydown',e=>{
    if(e.key!=='Tab')return;
    const controls=$$('a[href],button:not(:disabled),input,select,textarea,[tabindex="0"]',dialog).filter(el=>el.getClientRects().length);
    const first=controls[0],last=controls.at(-1);
    if(e.shiftKey&&(document.activeElement===first||document.activeElement===dialog)){e.preventDefault();last?.focus()}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}
  });
  document.addEventListener('click',e=>{const a=e.target.closest('[data-art]');if(!a||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();if(a.classList.contains('portfolio-thumb')&&matchMedia('(min-width:768px)').matches){selectWork(a.dataset.art);return}openArt(a.dataset.art,a)});
  $('.share-work')?.addEventListener('click',async()=>{const w=catalog[detailIndex];const url=new URL(base+'portfolio/',location.href);url.hash='obra='+w.id;const status=$('.share-status');try{if(navigator.share){await navigator.share({title:w.title+' · Ana Byte',url:url.href})}else{await navigator.clipboard.writeText(url.href);status.textContent='Link da obra copiado.'}}catch(e){if(e.name!=='AbortError'){status.replaceChildren(document.createTextNode('Link da obra: '));const a=document.createElement('a');a.href=url.href;a.textContent=url.href;status.append(a)}}});

  function visibleWorks(){return catalog.filter(w=>filter==='all'||(filter==='process'?w.kind==='Processo real':w.category===filter)).sort(sort==='title'?(a,b)=>a.title.localeCompare(b.title,'pt-BR'):(a,b)=>a.order-b.order)}
  function syncGalleryUrl(){
    const url=new URL(location.href);
    for(const [key,value] of [['tipo',filter==='all'?'':filter],['ordem',sort==='curated'?'':sort],['pagina',galleryPage?String(galleryPage+1):'']]){
      if(value)url.searchParams.set(key,value);else url.searchParams.delete(key);
    }
    history.replaceState(null,'',url);
  }
  function renderPage(){
    const grid=$('.portfolio-grid');if(!grid)return;
    const list=visibleWorks(),pages=Math.max(1,Math.ceil(list.length/6));galleryPage=Math.min(galleryPage,pages-1);
    const shown=list.slice(galleryPage*6,galleryPage*6+6),ids=new Set(shown.map(w=>w.id));
    $$('.portfolio-thumb').forEach(a=>a.hidden=!ids.has(a.dataset.art));
    list.forEach(w=>grid.append($(`[data-art="${w.id}"]`,grid)));
    $('.portfolio-pagination').hidden=false;$('[data-page-count]').textContent=String(galleryPage+1).padStart(2,'0')+' / '+String(pages).padStart(2,'0');
    $('.page-prev').disabled=galleryPage===0;$('.page-next').disabled=galleryPage===pages-1;
    $('.portfolio-count').textContent=list.length+' trabalhos nesta seleção';
    syncGalleryUrl();
  }
  function selectWork(id){
    const w=catalog.find(a=>a.id===id);if(!w||!$('.selected-work'))return;selectedId=w.id;
    const selected=$('[data-selected-open]'),image=$('img',selected);selected.href=base+w.src;selected.dataset.art=w.id;selected.setAttribute('aria-label','Ampliar '+w.title);image.src=base+w.src;image.alt=w.alt;image.width=w.width;image.height=w.height;image.style.objectPosition=w.desktopPosition;
    for(const key of ['title','kind','description','technique'])$(`[data-selected-${key}]`).textContent=w[key];
    $('[data-selected-contact]').href=contactFor(w);
    const active=visibleWorks();$('[data-selected-count]').textContent=String(active.findIndex(a=>a.id===id)+1).padStart(2,'0')+' / '+String(active.length).padStart(2,'0');
    $$('.portfolio-thumb').forEach(a=>{a.classList.toggle('is-selected',a.dataset.art===id);if(a.dataset.art===id)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current')});
    if(!reduced.matches)image.animate([{opacity:.5,transform:'scale(1.025)'},{opacity:1,transform:'scale(1)'}],{duration:350,easing:'ease-out'});
  }
  function moveSelected(delta){const list=visibleWorks();const i=list.findIndex(w=>w.id===selectedId),next=(i+delta+list.length)%list.length;galleryPage=Math.floor(next/6);renderPage();selectWork(list[next].id)}
  $('.selected-prev')?.addEventListener('click',()=>moveSelected(-1));$('.selected-next')?.addEventListener('click',()=>moveSelected(1));
  $$('.filters button').forEach(button=>{button.addEventListener('click',()=>{filter=button.dataset.filter;galleryPage=0;$$('.filters button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));renderPage();if(visibleWorks().length)selectWork(visibleWorks()[0].id);window.ScrollTrigger?.refresh()})});
  $('#portfolio-sort')?.addEventListener('change',e=>{sort=e.target.value;galleryPage=0;renderPage();selectWork(visibleWorks()[0].id)});
  $('.page-prev')?.addEventListener('click',()=>{galleryPage--;renderPage();selectWork(visibleWorks()[galleryPage*6].id)});
  $('.page-next')?.addEventListener('click',()=>{galleryPage++;renderPage();selectWork(visibleWorks()[galleryPage*6].id)});
  if($('.selected-work')){
    const params=new URLSearchParams(location.search),requested=params.get('tipo');
    if(['animal','figure','cyber','process','digital'].includes(requested)){filter=requested;$$('.filters button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===filter)))}
    if(params.get('ordem')==='title'){sort='title';$('#portfolio-sort').value=sort}
    const requestedPage=Number(params.get('pagina'));
    if(Number.isInteger(requestedPage)&&requestedPage>0)galleryPage=requestedPage-1;
    renderPage();selectWork(visibleWorks()[galleryPage*6]?.id||catalog[0].id);
  }
  function showLinkedArtwork(){
    if(!location.hash.startsWith('#obra='))return;
    let id;try{id=decodeURIComponent(location.hash.slice(6))}catch{return}
    const index=catalog.findIndex(w=>w.id===id);if(index<0)return;
    selectWork(id);if(dialog.open)setDetail(index);else openArt(id);
  }
  addEventListener('hashchange',showLinkedArtwork);showLinkedArtwork();

  const film=$('.film-dialog');let filmTrigger;
  $('.watch-film')?.addEventListener('click',e=>{filmTrigger=e.currentTarget;film.showModal();document.body.classList.add('modal-open');$('video',film).play().catch(()=>{});$('.film-close').focus()});
  $('.film-close')?.addEventListener('click',()=>film.close());
  film?.addEventListener('close',()=>{$('video',film).pause();document.body.classList.remove('modal-open');filmTrigger?.focus()});

  // Contact drafts are handed to WhatsApp only after explicit form submission.
  $$('.project-form').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const data=new FormData(form);const text=`Oi, Ana! Quero conversar sobre uma tatuagem.\n\nMeu nome: ${String(data.get('nome')).trim()}\nMinha ideia: ${String(data.get('ideia')).trim()}\nRegião do corpo: ${data.get('regiao')}\nTamanho aproximado: ${data.get('tamanho')}${String(data.get('telefone')||'').trim()?'\nMeu WhatsApp: '+String(data.get('telefone')).trim():''}`;const link=whatsapp+'?text='+encodeURIComponent(text);const popup=window.open(link,'_blank','noopener,noreferrer');const status=$('.form-status',form);status.replaceChildren(document.createTextNode('Sua ideia está pronta para revisar no WhatsApp. '));const a=document.createElement('a');a.href=link;a.target='_blank';a.rel='noopener';a.textContent='Abrir conversa';status.append(a)}));
  const floating=$('.floating-whatsapp');if(floating){let atForm=false,atHero=false;const syncFloating=()=>{floating.classList.toggle('over-form',atForm);floating.classList.toggle('at-hero',atHero);floating.tabIndex=atForm||atHero?-1:0};new IntersectionObserver(entries=>{atForm=entries.some(e=>e.isIntersecting);syncFloating()},{threshold:.12}).observe($('.project-form')||$('.footer'));if($('.hero'))new IntersectionObserver(entries=>{atHero=entries[0].isIntersecting;syncFloating()},{threshold:.3}).observe($('.hero'))}

  // Light depth and linked entrances. Never intercept wheel/touch or pin the visitor.
  if(window.gsap&&window.ScrollTrigger){
    gsap.registerPlugin(ScrollTrigger);const mm=gsap.matchMedia();
    mm.add('(min-width:1024px) and (prefers-reduced-motion:no-preference)',()=>{
      const hero=$('.hero');if(hero){
        gsap.to('.hero-depth',{y:28,scale:1.035,transformOrigin:'75% 50%',ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:.7}});
      }
      if($('.archive-works'))gsap.from('.archive-works .art-card',{clipPath:'inset(0 0 8% 0)',duration:.9,stagger:.08,ease:'power2.out',scrollTrigger:{trigger:'.archive-works',start:'top 87%'}});
      $$('.artist-photo img').forEach(photo=>gsap.fromTo(photo,{yPercent:-1,scale:1.045},{yPercent:1,scale:1.045,ease:'none',scrollTrigger:{trigger:photo.parentElement,start:'top bottom',end:'bottom top',scrub:.6}}));
      const cards=$$('.archive .art-card');
      const listeners=cards.map(card=>{let bounds;const enter=()=>{bounds=card.getBoundingClientRect()};const move=e=>{if(!bounds||effectsPaused)return;const x=(e.clientX-bounds.left)/bounds.width-.5,y=(e.clientY-bounds.top)/bounds.height-.5;gsap.to(card,{rotationY:x*3,rotationX:-y*3,y:-3,transformPerspective:900,duration:.5,overwrite:true})};const leave=()=>gsap.to(card,{rotationY:0,rotationX:0,y:0,duration:.55,overwrite:true});card.addEventListener('pointerenter',enter);card.addEventListener('pointermove',move);card.addEventListener('pointerleave',leave);return()=>{card.removeEventListener('pointerenter',enter);card.removeEventListener('pointermove',move);card.removeEventListener('pointerleave',leave);gsap.set(card,{clearProps:'transform'})}});
      return()=>listeners.forEach(fn=>fn());
    });
    document.fonts.ready.then(()=>ScrollTrigger.refresh());
    addEventListener('load',()=>ScrollTrigger.refresh(),{once:true});
  }

  // Rebuilt from the approved rain technique: independent depth, speed and spawn.
  const canvas=$('.city-rain');let rainFrame=0,inView=true,last=0,width=0,height=0,drops=[];
  if(canvas){const ctx=canvas.getContext('2d');
    function spawn(d,initial=false){const depth=Math.random();d.speed=190+depth*620;d.length=4+depth*18;d.alpha=.08+depth*.24;d.width=.45+depth*.75;d.x=Math.random()*(width+90)-60;d.y=initial?Math.random()*height:-20-Math.random()*height*.3;d.angle=.17+Math.random()*.2;d.phase=Math.random()*6.28}
    function resize(){const r=canvas.getBoundingClientRect();width=r.width;height=r.height;const scale=Math.min(devicePixelRatio||1,1.5);canvas.width=width*scale;canvas.height=height*scale;ctx.setTransform(scale,0,0,scale,0,0);drops=Array.from({length:Math.min(145,Math.round(width*height/8500))},()=>{const d={};spawn(d,true);return d})}
    function draw(now){rainFrame=0;if(reduced.matches||effectsPaused||document.hidden||!inView)return;const dt=Math.min(.035,(now-last)/1000);last=now;ctx.clearRect(0,0,width,height);for(const d of drops){const angle=d.angle+Math.sin(now*.0004+d.phase)*.03;d.y+=d.speed*dt;d.x+=d.speed*angle*dt;if(d.y>height+30||d.x>width+30){spawn(d);continue}ctx.strokeStyle=`rgba(191,225,247,${d.alpha})`;ctx.lineWidth=d.width;ctx.beginPath();ctx.moveTo(d.x-d.length*angle,d.y-d.length);ctx.lineTo(d.x,d.y);ctx.stroke()}rainFrame=requestAnimationFrame(draw)}
    function sync(){cancelAnimationFrame(rainFrame);rainFrame=0;if(reduced.matches||effectsPaused||document.hidden||!inView){ctx.clearRect(0,0,width,height);return}last=performance.now();rainFrame=requestAnimationFrame(draw)}
    resize();new ResizeObserver(()=>{resize();sync()}).observe(canvas);new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;sync()}).observe($('.hero'));document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
    $('.ambience-toggle')?.addEventListener('click',e=>{effectsPaused=!effectsPaused;document.documentElement.classList.toggle('effects-paused',effectsPaused);const b=e.currentTarget;b.setAttribute('aria-pressed',String(effectsPaused));b.setAttribute('aria-label',effectsPaused?'Ativar efeitos de movimento':'Pausar efeitos de movimento');b.innerHTML='<span></span> '+(effectsPaused?'Atmosfera pausada':'Atmosfera ativa');sync();if(window.ScrollTrigger)ScrollTrigger.getAll().forEach(t=>effectsPaused?t.disable(false):t.enable())});sync();
  }
})();

Promise.resolve(window.ANA_LOCALE_READY).then(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const english=window.ANA_LOCALE==='en',t=window.ANA_T||((text)=>text);
  const catalog=(window.ANA_CATALOG||[]).map(work=>english?{...work,...window.ANA_WORK_TRANSLATIONS?.[work.id],kind:work.kind}:work), base=document.body.dataset.base||'';
  const kindLabel=work=>t(work.kind);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let effectsPaused=false;
  const rail=$('.rail');
  const updateHeader=()=>rail?.classList.toggle('is-scrolled',scrollY>80);
  addEventListener('scroll',updateHeader,{passive:true});updateHeader();
  const progress=$('.reading-progress'), progressFill=$('.reading-progress-fill');
  let progressFrame=0;
  function updateProgress(){
    progressFrame=0;
    const distance=Math.max(0,document.documentElement.scrollHeight-innerHeight);
    const ratio=distance?Math.min(1,Math.max(0,scrollY/distance)):1;
    if(progressFill)progressFill.style.transform=`scaleX(${ratio})`;
    progress?.setAttribute('aria-valuenow',String(Math.round(ratio*100)));
  }
  function scheduleProgress(){if(!progressFrame)progressFrame=requestAnimationFrame(updateProgress)}
  addEventListener('scroll',scheduleProgress,{passive:true});addEventListener('resize',scheduleProgress,{passive:true});addEventListener('load',scheduleProgress,{once:true});updateProgress();
  const whatsapp=window.ANA_CONTACT?.whatsappUrl||'https://wa.me/5511919007582';
  const contactFor=w=>whatsapp+'?text='+encodeURIComponent(english?`Hi Ana! I saw “${w.title}” on your site and would love to discuss an idea in this direction.`:`Oi, Ana! Conheci a obra “${w.title}” no seu site e quero conversar sobre uma ideia nessa direção.`);
  const menu=$('.menu-toggle'), nav=$('#main-nav'), scrim=$('.menu-scrim');
  const compactMenu=matchMedia('(max-width:1023px)');
  let menuMotion;
  function finishMenuClose(){nav.classList.remove('is-open');scrim.hidden=true;window.gsap?.set([nav,scrim,...$$('a,.menu-effects',nav)],{clearProps:'opacity,transform,visibility'})}
  function closeMenu(restore=false,instant=false){
    if(!nav)return;
    const wasOpen=nav.classList.contains('is-open');
    menu?.setAttribute('aria-expanded','false');menu?.setAttribute('aria-label',t('Abrir navegação'));
    menuMotion?.kill();nav.inert=compactMenu.matches;
    if(wasOpen&&!instant&&compactMenu.matches&&!reduced.matches&&!effectsPaused&&window.gsap){
      menuMotion=gsap.timeline({onComplete:finishMenuClose});
      menuMotion.to(nav,{opacity:0,y:-12,duration:.23,ease:'power2.in'},0).to(scrim,{opacity:0,duration:.23,ease:'power1.in'},0);
    }else finishMenuClose();
    if(!compactMenu.matches)nav.inert=false;
    if(restore)menu?.focus();
  }
  function openMenu(){
    if(!nav)return;
    menuMotion?.kill();
    const firstOpen=!nav.classList.contains('is-open');
    nav.classList.add('is-open');nav.inert=false;scrim.hidden=false;
    menu?.setAttribute('aria-expanded','true');menu?.setAttribute('aria-label',t('Fechar navegação'));
    if(reduced.matches||effectsPaused||!window.gsap)return window.gsap?.set([nav,scrim,...$$('a,.menu-effects',nav)],{clearProps:'opacity,transform,visibility'});
    if(firstOpen)gsap.set([nav,scrim],{opacity:0});
    if(firstOpen)gsap.set(nav,{y:-14});
    menuMotion=gsap.timeline();
    menuMotion.to(nav,{opacity:1,y:0,duration:.36,ease:'power2.out'},0).to(scrim,{opacity:1,duration:.34,ease:'power1.out'},0);
    if(firstOpen)menuMotion.fromTo($$('a,.menu-effects',nav),{opacity:0,y:-7},{opacity:1,y:0,duration:.26,stagger:.035,ease:'power2.out',clearProps:'opacity,transform'},.1);
    else menuMotion.to($$('a,.menu-effects',nav),{opacity:1,y:0,duration:.22,ease:'power2.out',clearProps:'opacity,transform'},0);
  }
  menu?.addEventListener('click',()=>menu.getAttribute('aria-expanded')==='true'?closeMenu():openMenu());
  scrim?.addEventListener('click',()=>closeMenu(true));
  nav?.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('is-open'))closeMenu(true)});
  compactMenu.addEventListener('change',e=>{if(!e.matches)closeMenu(false,true)});
  function toggleEffects(){
    effectsPaused=!effectsPaused;
    document.documentElement.classList.toggle('effects-paused',effectsPaused);
    $$('.menu-effects,.motion-switch,.ambience-toggle').forEach(button=>{
      button.setAttribute('aria-pressed',String(effectsPaused));
      if(button.classList.contains('ambience-toggle')){
        button.setAttribute('aria-label',t(effectsPaused?'Ativar efeitos de movimento':'Pausar efeitos de movimento'));
        button.innerHTML='<span></span> '+t(effectsPaused?'Atmosfera pausada':'Atmosfera ativa');
      }else button.textContent=t(effectsPaused?'Ativar efeitos':'Pausar efeitos');
    });
    document.dispatchEvent(new Event('ana:effects-change'));
  }
  $$('.menu-effects,.motion-switch,.ambience-toggle').forEach(button=>button.addEventListener('click',toggleEffects));

  // The browser owns scrolling; chapter highlighting follows the real document.
  if(document.body.dataset.page==='inicio'){
    const sections=$$('main>section[id]');
    const active=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){$$('[data-nav]').forEach(a=>{if(a.dataset.nav===entry.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})}}, {rootMargin:'-18% 0px -55% 0px'});
    sections.forEach(s=>active.observe(s));
    $$('[data-nav]').forEach(a=>{if(a.dataset.nav!=='trabalhos'&&a.dataset.nav!=='sobre')return;const id=a.dataset.nav;a.href='#'+id});
  }

  const dialog=$('.art-dialog');
  let detailIndex=0, returnFocus=null, selectedId=catalog[0]?.id, filter='all', galleryPage=0, sort='curated';
  const archive=$('.portfolio-browser'), archiveVideo=$('#archive-video');
  let filmNear=false, filmAutoplayBlocked=false, filmStarting=false, manualFilm=false;
  let syncFilm=()=>{};
  function pauseFilm(){if(archiveVideo&&!archiveVideo.paused)archiveVideo.pause()}
  function showArtwork(){archive?.classList.remove('is-film');pauseFilm();if($('.archive-replay'))$('.archive-replay').hidden=false}
  function setDetail(index){
    detailIndex=(index+catalog.length)%catalog.length;
    const w=catalog[detailIndex];if(!w)return;
    const image=$('[data-detail-image]');image.src=base+w.src;image.alt=w.alt;image.style.objectPosition=w.desktopPosition;
    for(const key of ['title','kind','description','technique','difference'])$(`[data-detail-${key}]`).textContent=key==='kind'?kindLabel(w):w[key];
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
  $('.share-work')?.addEventListener('click',async()=>{const w=catalog[detailIndex];const url=new URL(base+'index.html',location.href);url.hash='obra='+w.id;const status=$('.share-status');try{if(navigator.share){await navigator.share({title:w.title+' · Ana Byte',url:url.href})}else{await navigator.clipboard.writeText(url.href);status.textContent=t('Link da obra copiado.')}}catch(e){if(e.name!=='AbortError'){status.replaceChildren(document.createTextNode(t('Link da obra: ')));const a=document.createElement('a');a.href=url.href;a.textContent=url.href;status.append(a)}}});

  function visibleWorks(){return catalog.filter(w=>filter==='all'||(filter==='process'?w.kind==='Processo real':filter==='tattoo'?w.kind==='Tatuagem autoral':w.category===filter)).sort(sort==='title'?(a,b)=>a.title.localeCompare(b.title,english?'en':'pt-BR'):(a,b)=>a.order-b.order)}
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
    $('.portfolio-count').textContent=t(list.length+' trabalhos nesta seleção');
    syncGalleryUrl();
    scheduleProgress();
  }
  function changeGallery(change,{direction=1,vertical=false}={}){
    const grid=$('.portfolio-grid');
    if(!grid)return change();
    const cards=$$('.portfolio-thumb',grid);
    if(window.gsap){gsap.killTweensOf(cards);gsap.set(cards,{clearProps:'opacity,transform,visibility'})}
    change();
    if(reduced.matches||effectsPaused||!window.gsap)return;
    const shown=$$('.portfolio-thumb:not([hidden])',grid);
    gsap.fromTo(shown,{opacity:0,x:vertical?0:direction*16,y:vertical?13:0},{opacity:1,x:0,y:0,duration:.4,stagger:.045,ease:'power2.out',overwrite:true,clearProps:'opacity,transform'});
  }
  function selectWork(id,{keepFilm=false}={}){
    const w=catalog.find(a=>a.id===id);if(!w||!$('.selected-work'))return;selectedId=w.id;
    if(!keepFilm)showArtwork();
    const selected=$('[data-selected-open]'),image=$('img',selected);selected.href=base+w.src;selected.dataset.art=w.id;selected.setAttribute('aria-label',t('Ampliar ')+w.title);image.src=base+w.src;image.alt=w.alt;image.width=w.width;image.height=w.height;image.style.objectPosition=w.desktopPosition;
    for(const key of ['title','kind','description','technique'])$(`[data-selected-${key}]`).textContent=key==='kind'?kindLabel(w):w[key];
    $('[data-selected-contact]').href=contactFor(w);
    const active=visibleWorks();$('[data-selected-count]').textContent=String(active.findIndex(a=>a.id===id)+1).padStart(2,'0')+' / '+String(active.length).padStart(2,'0');
    $$('.portfolio-thumb').forEach(a=>{a.classList.toggle('is-selected',a.dataset.art===id);if(a.dataset.art===id)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current')});
    if(!reduced.matches&&!effectsPaused)image.animate([{opacity:.5,transform:'scale(1.025)'},{opacity:1,transform:'scale(1)'}],{duration:350,easing:'ease-out'});
  }
  function moveSelected(delta){const list=visibleWorks();const i=list.findIndex(w=>w.id===selectedId),next=(i+delta+list.length)%list.length;const nextPage=Math.floor(next/6);const update=()=>{galleryPage=nextPage;renderPage();selectWork(list[next].id)};if(nextPage!==galleryPage)changeGallery(update,{direction:delta});else update()}
  $('.selected-prev')?.addEventListener('click',()=>moveSelected(-1));$('.selected-next')?.addEventListener('click',()=>moveSelected(1));
  function updateSelectionWithoutHidingFilm(id){selectWork(id,{keepFilm:true});syncFilm()}
  $$('.filters button').forEach(button=>{button.addEventListener('click',()=>{if(button.getAttribute('aria-pressed')==='true')return;archive?.classList.add('is-film','is-intro');changeGallery(()=>{filter=button.dataset.filter;galleryPage=0;$$('.filters button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));renderPage();if(visibleWorks().length)updateSelectionWithoutHidingFilm(visibleWorks()[0].id);window.ScrollTrigger?.refresh()},{vertical:true})})});
  $('#portfolio-sort')?.addEventListener('change',e=>changeGallery(()=>{sort=e.target.value;galleryPage=0;renderPage();updateSelectionWithoutHidingFilm(visibleWorks()[0].id)},{vertical:true}));
  $('.page-prev')?.addEventListener('click',()=>changeGallery(()=>{galleryPage--;renderPage();updateSelectionWithoutHidingFilm(visibleWorks()[galleryPage*6].id)},{direction:-1}));
  $('.page-next')?.addEventListener('click',()=>changeGallery(()=>{galleryPage++;renderPage();updateSelectionWithoutHidingFilm(visibleWorks()[galleryPage*6].id)},{direction:1}));
  if($('.selected-work')){
    const params=new URLSearchParams(location.search),requested=params.get('tipo');
    if(['tattoo','animal','figure','cyber','process','digital'].includes(requested)){filter=requested;$$('.filters button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===filter)))}
    if(params.get('ordem')==='title'){sort='title';$('#portfolio-sort').value=sort}
    const requestedPage=Number(params.get('pagina'));
    if(Number.isInteger(requestedPage)&&requestedPage>0)galleryPage=requestedPage-1;
    renderPage();selectWork(visibleWorks()[galleryPage*6]?.id||catalog[0].id,{keepFilm:true});
  }
  function showLinkedArtwork(){
    if(!location.hash.startsWith('#obra='))return;
    let id;try{id=decodeURIComponent(location.hash.slice(6))}catch{return}
    const index=catalog.findIndex(w=>w.id===id);if(index<0)return;
    selectWork(id);if(dialog.open)setDetail(index);else openArt(id);
  }
  addEventListener('hashchange',showLinkedArtwork);showLinkedArtwork();

  // First media in the actual archive. The browser stays on the same document.
  if(archiveVideo){
    syncFilm=function(){
      if(!filmNear||document.hidden||!archive.classList.contains('is-film')||dialog?.open||((reduced.matches||effectsPaused)&&!manualFilm)){pauseFilm();return}
      if(filmAutoplayBlocked||filmStarting||!archiveVideo.paused)return;
      filmStarting=true;
      archiveVideo.play().catch(error=>{if(error.name!=='AbortError')filmAutoplayBlocked=true}).finally(()=>{filmStarting=false});
    }
    archiveVideo.addEventListener('play',()=>{
      if(!filmNear||document.hidden||!archive.classList.contains('is-film')||((reduced.matches||effectsPaused)&&!manualFilm))pauseFilm();
    });
    archiveVideo.addEventListener('error',()=>{$('.film-error').hidden=false;filmAutoplayBlocked=true},true);
    archiveVideo.addEventListener('canplay',syncFilm);
    new IntersectionObserver(entries=>{filmNear=entries[0].isIntersecting;if(!filmNear)manualFilm=false;syncFilm()},{rootMargin:'0px',threshold:0}).observe($('#trabalhos'));
    document.addEventListener('visibilitychange',syncFilm);
    document.addEventListener('ana:effects-change',()=>{if(effectsPaused)pauseFilm();else syncFilm()});
    reduced.addEventListener('change',()=>{if(reduced.matches)pauseFilm();else syncFilm()});
    dialog?.addEventListener('close',syncFilm);
    new MutationObserver(()=>{if(dialog.open)pauseFilm()}).observe(dialog,{attributes:true,attributeFilter:['open']});
    $('.archive-replay')?.addEventListener('click',()=>{
      archive.classList.add('is-film','is-intro');filmAutoplayBlocked=false;manualFilm=true;
      archiveVideo.currentTime=0;
      archiveVideo.scrollIntoView({block:'center',behavior:reduced.matches?'instant':'smooth'});
      archiveVideo.play().catch(()=>{filmAutoplayBlocked=true});
      window.ScrollTrigger?.refresh();
    });
  }

  // Contact drafts are handed to WhatsApp only after explicit form submission.
  $$('.project-form').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const data=new FormData(form);const name=String(data.get('nome')).trim(),idea=String(data.get('ideia')).trim(),region=data.get('regiao'),size=data.get('tamanho'),phone=String(data.get('telefone')||'').trim();const text=english?`Hi Ana! I’d like to talk about a tattoo.\n\nMy name: ${name}\nMy idea: ${idea}\nBody placement: ${region}\nApproximate size: ${size}${phone?'\nMy WhatsApp: '+phone:''}`:`Oi, Ana! Quero conversar sobre uma tatuagem.\n\nMeu nome: ${name}\nMinha ideia: ${idea}\nRegião do corpo: ${region}\nTamanho aproximado: ${size}${phone?'\nMeu WhatsApp: '+phone:''}`;const link=whatsapp+'?text='+encodeURIComponent(text);window.open(link,'_blank','noopener,noreferrer');const status=$('.form-status',form);status.replaceChildren(document.createTextNode(t('Sua ideia está pronta para revisar no WhatsApp. ')));const a=document.createElement('a');a.href=link;a.target='_blank';a.rel='noopener';a.textContent=t('Abrir conversa');status.append(a)}));
  const floating=$('.floating-whatsapp');if(floating){let atForm=false,atHero=false;const syncFloating=()=>{floating.classList.toggle('over-form',atForm);floating.classList.toggle('at-hero',atHero);floating.tabIndex=atForm||atHero?-1:0};new IntersectionObserver(entries=>{atForm=entries.some(e=>e.isIntersecting);syncFloating()},{threshold:.12}).observe($('.project-form')||$('.footer'));if($('.hero'))new IntersectionObserver(entries=>{atHero=entries[0].isIntersecting;syncFloating()},{threshold:.3}).observe($('.hero'))}

  // Small lights live on the panel edges, outside the actual tattoo photographs.
  const litPanels=$$('.chapter,.portfolio-browser');
  litPanels.forEach(panel=>{const light=document.createElement('span');light.className='light-rail';light.setAttribute('aria-hidden','true');light.innerHTML='<i></i><i></i>';panel.append(light)});
  const lightsObserver=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('is-in-view',entry.isIntersecting)),{rootMargin:'40px'});
  litPanels.forEach(panel=>lightsObserver.observe(panel));
  document.addEventListener('visibilitychange',()=>document.documentElement.classList.toggle('page-hidden',document.hidden));

  // Only the existing text gradients drift. Batch style reads before adding
  // classes, and stop painting titles outside the viewport or hidden panels.
  const gradientTitles=$$('h1,h2,h3,.spectrum').filter(title=>{
    const style=getComputedStyle(title);
    return style.backgroundClip==='text'&&style.backgroundImage.includes('gradient(');
  });
  const titleObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>entry.target.classList.toggle('is-title-visible',entry.isIntersecting));
  });
  gradientTitles.forEach(title=>{title.classList.add('title-chroma');titleObserver.observe(title)});

  // Photographic backgrounds stay fixed in their sections; chapter typography
  // and foreground process details still respond to native scrolling.
  if(window.gsap&&window.ScrollTrigger){
    gsap.registerPlugin(ScrollTrigger);let motionContext;
    function setupMotion(){
      motionContext?.revert();if(effectsPaused)return;
      motionContext=gsap.matchMedia();
      motionContext.add({wide:'(min-width:1024px)',medium:'(min-width:768px) and (max-width:1023px)',small:'(max-width:767px)',reduce:'(prefers-reduced-motion:reduce)'},context=>{
        const {wide,small,reduce}=context.conditions;if(reduce)return;
        // A chapter arrives with a short upward impulse, then settles into its reading position.
        $$('.motion-title-frame').forEach((frame,index)=>{
          const title=$('h2',frame);if(!title)return;
          const distance=wide?112:small?44:72;
          const launch=gsap.timeline({scrollTrigger:{id:'chapter-launch-'+index,trigger:frame,start:small?'top 94%':'top 91%',end:small?'top 61%':'top 43%',scrub:small?.28:.52,invalidateOnRefresh:true}})
            .fromTo(title,{y:distance,scale:.94,opacity:0,clipPath:'inset(100% 0 0 0)'},{y:-9,scale:1.012,opacity:1,clipPath:'inset(-5% -3% -6% -3%)',duration:.8,ease:'power2.out'})
            .to(title,{y:0,scale:1,duration:.2,ease:'power1.inOut'});
          const support=frame.nextElementSibling;
          if(support?.classList.contains('tracked')&&getComputedStyle(support).display!=='none')launch.fromTo(support,{y:small?17:30,opacity:.25},{y:0,opacity:1,duration:.42,ease:'power1.out'},.4);
        });
        const artistFacts=$$('.artist-facts>div');
        if(artistFacts.length)gsap.fromTo(artistFacts,{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',stagger:.1,ease:'none',scrollTrigger:{id:'artist-facts-reveal',trigger:'.artist-facts',start:'top 90%',end:'top 48%',scrub:.55}});
        const processSections=$$('.process');
        processSections.forEach((section,sectionIndex)=>{
          section.classList.add('has-process-motion');
          const cards=$$('.process-proof',section);
          const progress=$('.process-progress span',section);
          if(progress){const axis=wide?'scaleY':'scaleX';gsap.fromTo(progress,{[axis]:0},{[axis]:1,ease:'none',scrollTrigger:{id:'process-progress-'+sectionIndex,trigger:section,start:'top 75%',end:'bottom 35%',scrub:.55}})}
          cards.forEach((card,index)=>{
            const photo=$('.process-image img',card),curtain=$('.process-curtain',card);
            const imageWindow=$('a',card);
            if(imageWindow)gsap.fromTo(imageWindow,{y:wide?76:small?38:54,scale:wide?.94:.97,opacity:.42},{y:0,scale:1,opacity:1,ease:'none',scrollTrigger:{id:`process-window-${sectionIndex}-${index}`,trigger:card,start:'top 94%',end:'top 48%',scrub:small?.3:.55,invalidateOnRefresh:true}});
            if(photo)gsap.fromTo(photo,{scale:1.09,y:18},{scale:1,y:-12,ease:'none',scrollTrigger:{id:`process-photo-${sectionIndex}-${index}`,trigger:card,start:'top 90%',end:'bottom 20%',scrub:.65}});
            if(curtain)gsap.fromTo(curtain,{xPercent:0},{xPercent:105,ease:'none',scrollTrigger:{id:`process-reveal-${sectionIndex}-${index}`,trigger:card,start:'top 88%',end:'top 42%',scrub:.45}});
            ScrollTrigger.create({id:`process-active-${sectionIndex}-${index}`,trigger:card,start:'top 67%',end:'bottom 30%',toggleClass:{targets:card,className:'is-process-active'}});
          });
        });
        if(!wide||!matchMedia('(hover:hover) and (pointer:fine)').matches)return()=>processSections.forEach(section=>section.classList.remove('has-process-motion'));
        const cleanups=$$('.archive .art-card').map(card=>{
          let bounds;
          const tiltX=gsap.quickTo(card,'rotationX',{duration:.45,ease:'power2.out'}),tiltY=gsap.quickTo(card,'rotationY',{duration:.45,ease:'power2.out'});
          const enter=()=>{bounds=card.getBoundingClientRect();gsap.set(card,{transformPerspective:1000})};
          const move=e=>{if(!bounds)return;const x=(e.clientX-bounds.left)/bounds.width,y=(e.clientY-bounds.top)/bounds.height;tiltY((x-.5)*8);tiltX(-(y-.5)*8);card.style.setProperty('--glow-x',`${x*100}%`);card.style.setProperty('--glow-y',`${y*100}%`)};
          const leave=()=>{tiltX(0);tiltY(0);bounds=null};
          card.addEventListener('pointerenter',enter);card.addEventListener('pointermove',move);card.addEventListener('pointerleave',leave);
          return()=>{card.removeEventListener('pointerenter',enter);card.removeEventListener('pointermove',move);card.removeEventListener('pointerleave',leave);tiltX.tween.kill();tiltY.tween.kill();card.style.removeProperty('--glow-x');card.style.removeProperty('--glow-y');gsap.set(card,{clearProps:'transform'})};
        });
        return()=>{cleanups.forEach(cleanup=>cleanup());processSections.forEach(section=>section.classList.remove('has-process-motion'))};
      });
      ScrollTrigger.refresh();
    }
    setupMotion();document.addEventListener('ana:effects-change',setupMotion);
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
    document.addEventListener('ana:effects-change',sync);sync();
  }
});

(() => {
 'use strict';
 const tour=document.querySelector('.tour'); if(!tour)return;
 const stops=[...tour.querySelectorAll('.tour-stop')], track=tour.querySelector('.tour-track');
 const dock=[...tour.querySelectorAll('[data-tour-go]')], progress=tour.querySelector('.dock-progress i');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let horizontal=null, active=0;
 const next=document.createElement('button'); next.className='dock-next'; next.type='button'; next.textContent='Próxima obra';tour.querySelector('.tour-dock').append(next);
 const setActive=index=>{
  active=Math.max(0,Math.min(stops.length-1,index));
  dock.forEach((link,i)=>i===active?link.setAttribute('aria-current','step'):link.removeAttribute('aria-current'));
  progress.style.transform='scaleX('+((active+1)/stops.length)+')';
  next.textContent=active===stops.length-1?'Continuar':'Próxima obra';
 };
 const goTo=index=>{
  if(index>=stops.length){document.querySelector('.transfer').scrollIntoView({behavior:'instant',block:'start'});return;}
  index=Math.max(0,index);
  if(horizontal){
   const ratio=index/(stops.length-1);
   window.scrollTo({top:horizontal.start+(horizontal.end-horizontal.start)*ratio+1,behavior:'instant'});
   horizontal.animation?.progress(ratio);window.ScrollTrigger.update();
  }else window.scrollTo({top:stops[index].getBoundingClientRect().top+scrollY-64,behavior:'instant'});
  setActive(index);
 };
 document.querySelectorAll('[data-tour-go]').forEach(link=>link.addEventListener('click',event=>{
  event.preventDefault();const index=Number(link.dataset.tourGo);goTo(index);
  if(!link.closest('.tour-dock'))stops[index].querySelector('h2').focus({preventScroll:true});
 }));
 next.addEventListener('click',()=>goTo(active+1));
 stops.forEach((stop,index)=>{
  const stage=document.createElement('div');stage.className='stop-stage';
  while(stop.firstChild)stage.append(stop.firstChild);stop.append(stage);
  const wire=document.createElementNS('http://www.w3.org/2000/svg','svg');wire.setAttribute('class','stage-wire');wire.setAttribute('viewBox','0 0 400 700');wire.setAttribute('aria-hidden','true');
  wire.innerHTML='<path class="wire-shadow" d="M430 0C50 100 460 360 180 410S140 670-50 710"/><path d="M430 0C50 100 460 360 180 410S140 670-50 710M445 10C65 110 475 370 195 425S155 680-35 725"/><path class="wire-current" d="M430 0C50 100 460 360 180 410S140 670-50 710"/>';
  stage.append(wire);
  const hint=document.createElement('p');hint.className='gesture-hint';hint.textContent='Role para aproximar · Deslize na foto para avançar';stage.append(hint);
  const figure=stop.querySelector('.stop-image'),img=figure.querySelector('img'),zoom=stop.querySelector('.stop-zoom');
  const imageButton=document.createElement('button');imageButton.type='button';imageButton.className='artwork-open';
  imageButton.setAttribute('aria-label','Ampliar: '+zoom.dataset.title);
  img.before(imageButton);imageButton.append(img);imageButton.addEventListener('click',()=>zoom.click());
  const inspect=document.createElement('button');inspect.type='button';inspect.className='inspect-trigger';inspect.textContent='+';
  inspect.setAttribute('aria-label','Explorar detalhes: '+zoom.dataset.title);inspect.setAttribute('aria-expanded','false');
  inspect.setAttribute('aria-controls','insight-'+index);
  const panel=document.createElement('div');panel.className='insight-panel';panel.id='insight-'+index;panel.hidden=true;
  const title=document.createElement('strong');title.textContent='Olhe de perto';
  const description=document.createElement('p');description.textContent=stop.querySelector('.stop-description').textContent;
  const note=document.createElement('p');note.textContent=stop.querySelector('.look-note p').textContent;
  const close=document.createElement('button');close.type='button';close.textContent='Voltar à obra';
  panel.append(title,description,note,close);figure.append(inspect,panel);
  const closePanel=()=>{panel.hidden=true;inspect.setAttribute('aria-expanded','false');};
  inspect.addEventListener('click',()=>{panel.hidden=!panel.hidden;inspect.setAttribute('aria-expanded',String(!panel.hidden));if(!panel.hidden)close.focus({preventScroll:true});});
  close.addEventListener('click',()=>{closePanel();inspect.focus({preventScroll:true});});
  panel.addEventListener('keydown',e=>{if(e.key==='Escape'){closePanel();inspect.focus({preventScroll:true});}});
  // Native vertical scrolling remains untouched; deliberate horizontal gestures change chapters.
  let touch=null,suppressClick=false;
  imageButton.addEventListener('touchstart',e=>{const t=e.touches[0];touch={x:t.clientX,y:t.clientY};},{passive:true});
  imageButton.addEventListener('touchend',e=>{
   if(!touch||!document.body.classList.contains('mobile-immersive'))return;
   const t=e.changedTouches[0],dx=t.clientX-touch.x,dy=t.clientY-touch.y;
   if(Math.abs(dx)>75&&Math.abs(dx)>Math.abs(dy)*1.6){suppressClick=true;setTimeout(()=>suppressClick=false,400);goTo(index+(dx<0?1:-1));}
   touch=null;
  },{passive:true});
  imageButton.addEventListener('click',e=>{if(suppressClick){e.stopImmediatePropagation();e.preventDefault();suppressClick=false;}},true);
  stop.addEventListener('focusin',()=>{if(horizontal&&Math.abs(horizontal.progress-index/4)>.06)goTo(index);});
 });
 let scheduled=false;
 const updatePosition=()=>{
  scheduled=false;const box=tour.getBoundingClientRect();
  document.body.classList.toggle('in-tour',box.top<innerHeight*.35&&box.bottom>innerHeight*.65);
  if(horizontal)return;
  let candidate=0;stops.forEach((s,i)=>{if(s.getBoundingClientRect().top<innerHeight*.5)candidate=i;});setActive(candidate);
 };
 addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updatePosition);}},{passive:true});updatePosition();
 const effects=document.querySelector('.effects-toggle');effects.hidden=false;effects.textContent='Pausar luzes';
 try{document.body.classList.toggle('effects-paused',localStorage.getItem('ana-lights-paused')==='1');}catch{}
 const syncEffects=()=>{const paused=document.body.classList.contains('effects-paused');effects.textContent=paused?'Ativar luzes':'Pausar luzes';effects.setAttribute('aria-pressed',String(paused));};
 syncEffects();effects.addEventListener('click',()=>{document.body.classList.toggle('effects-paused');syncEffects();try{localStorage.setItem('ana-lights-paused',document.body.classList.contains('effects-paused')?'1':'0');}catch{}});
 document.addEventListener('visibilitychange',()=>document.body.classList.toggle('tab-hidden',document.hidden));
 const ambientObserver=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('ambient-idle',!e.isIntersecting)),{rootMargin:'80px'});
 document.querySelectorAll('.entry,.tour-stop').forEach(el=>ambientObserver.observe(el));
 const range=document.querySelector('#skin-range'),frame=document.querySelector('.transfer-frame');let userReveal=false;
 document.querySelector('.transfer-controls').hidden=false;
 const reveal=value=>{frame.style.setProperty('--reveal',value+'%');range.value=value;range.setAttribute('aria-valuetext',Math.round(value)+'% da tatuagem revelada');};
 reveal(50);range.addEventListener('input',()=>{userReveal=true;reveal(Number(range.value));});
 // The full comparison surface is draggable; vertical touch keeps scrolling the page.
 frame.style.touchAction='pan-y';let drag=null;
 frame.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,id:e.pointerId};});
 frame.addEventListener('pointermove',e=>{
  if(!drag)return;const dx=Math.abs(e.clientX-drag.x),dy=Math.abs(e.clientY-drag.y);
  if(dx<8||dy>dx*1.4)return;
  frame.setPointerCapture(e.pointerId);userReveal=true;
  const b=frame.getBoundingClientRect();reveal(Math.max(0,Math.min(100,(e.clientX-b.left)/b.width*100)));
 });
 ['pointerup','pointercancel'].forEach(type=>frame.addEventListener(type,()=>drag=null));
 document.querySelector('.tour-skip').addEventListener('click',event=>{event.preventDefault();document.querySelector('.transfer').scrollIntoView({behavior:'instant',block:'start'});});
 if(!window.gsap||!window.ScrollTrigger)return;
 gsap.registerPlugin(ScrollTrigger);ScrollTrigger.config({ignoreMobileResize:true});
 const media=gsap.matchMedia();
 media.add({desktop:'(min-width:992px)',phone:'(max-width:600px) and (min-height:600px)',reduce:'(prefers-reduced-motion: reduce)'},ctx=>{
  if(ctx.conditions.reduce)return;
  const desktop=ctx.conditions.desktop,phone=ctx.conditions.phone;
  document.body.classList.toggle('mobile-immersive',phone);
  const entrance=gsap.timeline({scrollTrigger:{id:'entry',trigger:'.entry',start:'top top',end:()=>'+='+(phone?innerHeight*.65:850),pin:desktop||phone,scrub:.4,invalidateOnRefresh:true},defaults:{ease:'none'}});
  entrance.to('.slice-center',{scale:phone?1.38:1.35,rotation:0,yPercent:-8},0)
   .to('.slice-left',{xPercent:-35,rotation:-22,yPercent:-12},0)
   .to('.slice-right',{xPercent:38,rotation:20,yPercent:12},0)
   .to('.entry h1',{yPercent:-25,opacity:.25},0).to('.bio-circuit',{yPercent:12},0);
  if(desktop){
   document.body.classList.add('tour-horizontal');
   const tween=gsap.to(track,{x:()=>-(track.scrollWidth-innerWidth),ease:'none',scrollTrigger:{id:'tattoo-tour',trigger:tour,start:'top top',end:()=>'+='+innerWidth*4,pin:true,scrub:.45,invalidateOnRefresh:true,onUpdate:self=>setActive(Math.min(4,Math.round(self.progress*4)))}});
   horizontal=tween.scrollTrigger;
   stops.forEach(stop=>gsap.fromTo(stop.querySelector('.stop-outline'),{xPercent:10},{xPercent:-10,ease:'none',scrollTrigger:{trigger:stop,containerAnimation:tween,start:'left right',end:'right left',scrub:true}}));
  }else if(phone){
   stops.forEach(stop=>{
    const timeline=gsap.timeline({scrollTrigger:{trigger:stop,start:'top 64px',end:'bottom bottom',scrub:.4,invalidateOnRefresh:true},defaults:{ease:'none'}});
    timeline.fromTo(stop.querySelector('.stop-image'),{scale:.84,y:20},{scale:1.06,y:-4},0)
     .fromTo(stop.querySelector('.stop-outline'),{xPercent:8},{xPercent:-22},0)
     .fromTo(stop.querySelector('h2'),{y:8},{y:-5},0);
   });
  }
  const morph={value:0};
  gsap.to(morph,{value:100,ease:'none',scrollTrigger:{trigger:'.transfer',start:'top 70%',end:'bottom 80%',scrub:.4},onUpdate:()=>{if(!userReveal)reveal(morph.value);}});
  gsap.fromTo('.tour-artist img',{yPercent:-7,scale:1.15},{yPercent:7,ease:'none',scrollTrigger:{trigger:'.tour-artist',start:'top bottom',end:'bottom top',scrub:.4}});
  return()=>{horizontal=null;document.body.classList.remove('tour-horizontal','mobile-immersive');};
 });
 const refresh=()=>{ScrollTrigger.refresh();updatePosition();};
 Promise.all([...document.images].filter(i=>i.loading!=='lazy').map(i=>i.decode().catch(()=>{}))).then(refresh);
 addEventListener('pageshow',refresh);addEventListener('ana:intro-complete',refresh);
})();

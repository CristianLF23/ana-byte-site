(() => {
  'use strict';
  const root=document.documentElement;
  if(!root.classList.contains('entry-pending'))return;

  const overlay=document.querySelector('.entry-intro');
  const city=document.querySelector('.hero-city img');
  const surfaces=[document.querySelector('.rail'),document.querySelector('main')].filter(Boolean);
  const started=window.ANA_ENTRY_START||performance.now();
  const wait=ms=>new Promise(resolve=>setTimeout(resolve,Math.max(0,ms)));
  let finished=false;
  surfaces.forEach(element=>{element.inert=true});

  function finish(){
    if(finished)return;
    finished=true;
    try{sessionStorage.setItem('ana-byte-v3-entry-seen','1')}catch{}
    root.classList.remove('entry-pending');
    root.classList.add('entry-leaving');
    surfaces.forEach(element=>{element.inert=false});
    setTimeout(()=>{
      root.classList.remove('entry-leaving');
      overlay?.remove();
      window.dispatchEvent(new Event('ana:entry-complete'));
    },420);
  }

  const ready=Promise.race([
    Promise.all([
      city?.decode?.().catch(()=>{})||Promise.resolve(),
      window.ANA_LOCALE_READY||Promise.resolve()
    ]),
    wait(2350-(performance.now()-started))
  ]);
  Promise.all([wait(1750-(performance.now()-started)),ready]).then(finish,finish);
  setTimeout(finish,3000);
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape')finish();
    if(event.key==='Tab'&&!finished)event.preventDefault();
  });
})();

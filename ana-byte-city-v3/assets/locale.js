(() => {
  'use strict';
  const preferenceKey='ana-byte-v3-language';
  const countryKey='ana-byte-v3-country';
  const cacheAge=7*24*60*60*1000;
  const storage={
    get(key){try{return localStorage.getItem(key)}catch{return null}},
    set(key,value){try{localStorage.setItem(key,value)}catch{}}
  };
  const translations=window.ANA_EN||{ui:{},works:{}};
  const dictionary={...translations.ui};
  for(const work of window.ANA_CATALOG||[]){
    const english=translations.works?.[work.id];
    if(!english)continue;
    for(const field of ['title','alt','description','technique','difference']){
      if(work[field]&&english[field])dictionary[work[field]]=english[field];
    }
  }
  const translate=value=>{
    if(dictionary[value])return dictionary[value];
    const pageMatch=value.match(/^([0-9]+) trabalhos (no acervo|nesta seleção)$/);
    if(pageMatch)return `${pageMatch[1]} works ${pageMatch[2]==='no acervo'?'in the archive':'in this selection'}`;
    const processMatch=value.match(/^([0-9]+ \/ [0-9]+) · DESENHO E PELE$/);
    if(processMatch)return `${processMatch[1]} · DRAWING TO SKIN`;
    for(const prefix of ['Ampliar ','Explorar ']){
      if(value.startsWith(prefix))return (prefix==='Ampliar '?'Open ':'Explore ')+translate(value.slice(prefix.length));
    }
    return value;
  };
  window.ANA_T=value=>window.ANA_LOCALE==='en'?translate(value):value;
  window.ANA_WORK_TRANSLATIONS=translations.works||{};

  const brazilTimeZones=/^America\/(?:Sao_Paulo|Manaus|Belem|Fortaleza|Recife|Bahia|Maceio|Araguaina|Campo_Grande|Cuiaba|Porto_Velho|Boa_Vista|Rio_Branco|Santarem|Noronha|Eirunepe)$/;
  function fallbackLocale(){
    const zone=Intl.DateTimeFormat().resolvedOptions().timeZone||'';
    if(brazilTimeZones.test(zone))return 'pt';
    return /^pt(?:-|$)/i.test(navigator.language||'')&&!zone?'pt':'en';
  }
  async function initialLocale(){
    const manual=storage.get(preferenceKey);
    if(manual==='pt'||manual==='en')return manual;
    try{
      const cached=JSON.parse(storage.get(countryKey)||'null');
      if(cached&&Date.now()-cached.time<cacheAge&&/^[A-Z]{2}$/.test(cached.country))return cached.country==='BR'?'pt':'en';
    }catch{}
    try{
      const controller=new AbortController();
      const timer=setTimeout(()=>controller.abort(),1400);
      try{
        const response=await fetch('https://ipwho.is/?fields=success,country_code',{signal:controller.signal,cache:'no-store'});
        if(!response.ok)throw Error(`Geolocation ${response.status}`);
        const data=await response.json();
        if(data.success!==true||!/^[A-Z]{2}$/.test(data.country_code))throw Error('Unknown country');
        storage.set(countryKey,JSON.stringify({country:data.country_code,time:Date.now()}));
        return data.country_code==='BR'?'pt':'en';
      }finally{clearTimeout(timer)}
    }catch{return fallbackLocale()}
  }
  function localizePage(){
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    const nodes=[];
    while(walker.nextNode()){
      const node=walker.currentNode;
      if(node.parentElement?.closest('script,style,noscript'))continue;
      nodes.push(node);
    }
    for(const node of nodes){
      const current=node.nodeValue;
      const trimmed=current.trim();
      if(!trimmed)continue;
      const english=translate(trimmed);
      if(english!==trimmed)node.nodeValue=current.replace(trimmed,english);
    }
    for(const element of document.querySelectorAll('[aria-label],[alt],[placeholder],[title]')){
      for(const name of ['aria-label','alt','placeholder','title']){
        const original=element.getAttribute(name);
        if(original){const english=translate(original);if(english!==original)element.setAttribute(name,english)}
      }
    }
    document.title=translate(document.title);
    for(const selector of ['meta[name="description"]','meta[property="og:title"]','meta[property="og:description"]']){
      const meta=document.querySelector(selector);
      if(meta)meta.content=translate(meta.content);
    }
  }
  window.ANA_LOCALE_READY=initialLocale().then(locale=>{
    window.ANA_LOCALE=locale;
    document.documentElement.lang=locale==='en'?'en':'pt-BR';
    if(locale==='en')localizePage();
    document.querySelectorAll('[data-language]').forEach(button=>{
      button.setAttribute('aria-pressed',String(button.dataset.language===locale));
      button.addEventListener('click',()=>{
        if(button.dataset.language===locale)return;
        storage.set(preferenceKey,button.dataset.language);
        location.reload();
      });
    });
    document.documentElement.classList.remove('locale-pending');
    return locale;
  }).catch(()=>{
    window.ANA_LOCALE='pt';
    document.documentElement.classList.remove('locale-pending');
    return 'pt';
  });
})();

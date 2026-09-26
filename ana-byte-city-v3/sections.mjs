export function createSections({works,img,icon,eyebrow,artButton,wa}) {
  const get = stem => works.find(w=>w.src.includes(stem));
  const mark = (b='') => `<img src="${b}assets/ui/ana-byte-mark.png" width="112" height="111" alt="Ana Byte">`;
  function hero(){return `
    <section class="hero" id="inicio" aria-labelledby="hero-title">
      <div class="hero-depth">
        <picture class="hero-city"><source media="(max-width:767px)" srcset="assets/backgrounds/city-mobile-600.webp 600w, assets/backgrounds/city-mobile.webp 828w" sizes="100vw"><img src="assets/backgrounds/city-desktop.webp" srcset="assets/backgrounds/city-1280.webp 1280w, assets/backgrounds/city-desktop.webp 2016w" sizes="(min-width:1024px) calc(100vw - 120px), 100vw" alt="A cidade ilustrada de Ana Byte: a artista e seu gato frajola observam prédios e letreiros em neon" width="2016" height="780" fetchpriority="high"></picture>
        <canvas class="city-rain" aria-hidden="true"></canvas>
        <picture class="hero-foreground" aria-hidden="true"><source media="(max-width:767px)" srcset="assets/backgrounds/city-mobile-600.webp 600w, assets/backgrounds/city-mobile.webp 828w" sizes="100vw"><img src="assets/backgrounds/city-desktop.webp" srcset="assets/backgrounds/city-1280.webp 1280w, assets/backgrounds/city-desktop.webp 2016w" sizes="(min-width:1024px) calc(100vw - 120px), 100vw" alt="" width="2016" height="780"></picture>
        <div class="billboard"><div class="billboard-content">
          <h1 id="hero-title"><span>UM LUGAR</span><span>ENTRE <em>MUNDOS.</em></span></h1>
          <p class="hero-sub">O meu universo encontra o seu.<br>Na pele.</p>
          <div class="hero-actions"><a class="neon-button" href="#trabalhos">Descubra meu mundo ${icon('arrow')}</a><a class="neon-button cyan" href="${wa}" target="_blank" rel="noopener">${icon('whatsapp')} Falar no WhatsApp</a></div>
          <p class="microtags"><span>TATUAGEM</span><i>×</i><span>ARTE DIGITAL</span><i>×</i><span>CULTURA CYBER</span></p>
        </div></div>
      </div>
      <a href="#trabalhos" class="explore">${icon('down')}<span>EXPLORAR</span></a>
      <button class="ambience-toggle" aria-pressed="false" aria-label="Pausar efeitos de movimento"><span></span> Atmosfera ativa</button>
    </section>`}
  function archive(b=''){
    const selected=['18-cyber-horse','22-neon-raven','19-neon-portrait','21-cyber-instinct'].map(get);
    return `<section class="chapter archive" id="trabalhos" aria-labelledby="archive-title">
      <div class="archive-composition">
        <div class="archive-intro">${eyebrow('02','TRABALHOS')}<h2 id="archive-title">ARQUIVO<br><span class="spectrum">VIVO.</span></h2><p class="tracked">Tatuagens como portais.<br>Fragmentos de outros<br>mundos na pele real.</p><a class="text-link" href="${b}portfolio/">Ver todos os trabalhos ${icon('arrow')}</a><span class="archive-index">01 <small>/ ${works.length}</small></span></div>
        <div class="archive-filters" aria-label="Explorar o acervo"><a class="is-active" href="${b}portfolio/">Todos</a><a href="${b}portfolio/?tipo=cyber">Tatuagens</a><a href="${b}portfolio/?tipo=process">Processo</a><a href="${b}portfolio/?tipo=digital">Arte digital</a></div>
        <div class="archive-works">${selected.map((w,i)=>artButton(w,b,i===0?'featured-art':'',i)).join('')}</div>
      </div>
      <a class="mobile-process-link" href="#processo">${img(get('09-heart-process'),b)}<span>DO CONCEITO<br>À PELE.</span>${icon('arrow')}</a>
    </section>`;
  }
  function process(b='',compact=false){
    const comparisons=['09-heart-process','12-cat-process','11-dagger-process'].map(get).filter(Boolean);
    return `<section class="chapter process ${compact?'compact':''}" id="processo" aria-labelledby="process-title"><div class="process-intro">${eyebrow('03','PROCESSO')}<h2 id="process-title">DO CONCEITO<br><span class="spectrum">À PELE.</span></h2><p class="tracked">Ideia. Arte. Transformação.</p><p>Cada tatuagem começa em outro plano e ganha vida no mundo real. Sua história encontra forma, cor e movimento.</p><a class="text-link" href="${b}index.html#contato">Comece pela ideia ${icon('arrow')}</a></div><div class="process-sequence">${comparisons.map((w,i)=>`<figure class="process-proof technical-frame"><a href="${b+w.src}" data-art="${w.id}" aria-label="Ampliar ${w.title}">${img(w,b)}<span class="art-plus">${icon('plus')}</span></a><figcaption><small>${String(i+1).padStart(2,'0')}</small><span>${w.title}</span><em>DESENHO E PELE REAL</em></figcaption></figure>`).join('')}</div></section>`;
  }
  function artist(b='',extended=false){return `<section class="chapter artist ${extended?'artist-full':''}" id="sobre" aria-labelledby="artist-title">
      <div class="artist-composition">
        <figure class="artist-photo"><div class="artist-photo-frame"><img src="${b}assets/artist/15-ana-working.jpg" alt="Ana Byte tatuando em seu estúdio" width="863" height="1145" loading="lazy"></div></figure>
        <div class="artist-copy">${eyebrow('04','SOBRE A ARTISTA')}<${extended?'h1':'h2'} id="artist-title"><span class="artist-desktop-title">${extended?'A MÃO<br>POR TRÁS<br>DO TRAÇO.':'ARTE EM<br>TRÂNSITO.'}</span><span class="artist-mobile-title">SOBRE A<br>ARTISTA.</span></${extended?'h1':'h2'}><p class="tracked">Arte. Tecnologia. Pele real.</p><p>Ana Byte é tatuadora e artista visual. Seu trabalho habita o limiar entre o orgânico e o impossível, onde a técnica encontra o imaginário.</p>${extended?'<p>Cada projeto é uma colaboração. A sua história encontra o meu universo.</p>':''}<a class="${extended?'neon-button':'text-link'}" href="${extended?'https://www.instagram.com/ana.byte/':b+'sobre/'}" ${extended?'target="_blank" rel="noopener"':''}>${extended?'Conheça meu universo':'Conheça mais'} ${icon('arrow')}</a></div>
        ${extended?`<div class="artist-aside"><div class="artist-note"><span>ARTE AUTORAL.</span><p>Um universo<br>em movimento.</p>${mark(b)}</div><figure class="artist-city"><img src="${b}assets/backgrounds/city-mobile-600.webp" alt="O universo ilustrado da Ana" width="600" height="1376" loading="lazy"></figure><span class="artist-locale">SÃO PAULO · BRASIL<br>TATTOOS DE OUTRA REALIDADE</span></div>`:''}
      </div>
      ${extended?`<div class="artist-bio"><p>Atendo na grande São Paulo e também levo meu trabalho a outras cidades do Brasil e do mundo.</p><p>Além da tatuagem, crio artes digitais impressas e projetos por encomenda. O desejo de experimentar atravessa tudo o que faço.</p><a href="https://www.instagram.com/ana.byte/" target="_blank" rel="noopener">@ana.byte ${icon('instagram')}</a></div>`:''}
    </section>`}
  function pillars(b=''){return `<section class="chapter pillars-section"><div class="pillars-intro">${eyebrow('03','MEU ESTILO')}<h2>PILARES<br>DE OUTRO<br><span class="spectrum">MUNDO.</span></h2><p>Estrutura orgânica, energia visual e matéria em movimento.</p></div><div class="pillars">${[['ESTRUTURA','Formas orgânicas e mecânicas em equilíbrio.','22-neon-raven'],['ENERGIA','Movimento e cor em cada composição.','20-dual-souls'],['MATÉRIA','Texturas e contrastes que ganham corpo na pele.','19-neon-portrait']].map(([t,txt,file],i)=>`<article>${img(get(file),b)}<div><small>0${i+1}</small><h3>${t}</h3><p>${txt}</p></div></article>`).join('')}</div></section>`}
  function contact(b=''){return `<section class="chapter contact" id="contato" aria-labelledby="contact-title"><div class="contact-copy">${eyebrow('05','VAMOS CRIAR JUNTOS?')}<h2 id="contact-title">CONTE SUA <span class="spectrum">IDEIA.</span></h2><p class="tracked">Vamos transformar em arte na sua pele.</p><p class="contact-description">Conte o que te inspira. Referências, personagens ou uma história sua. Você não precisa chegar com tudo resolvido: o resto, a gente constrói junto.</p></div><form class="project-form technical-frame" action="${wa}" method="get" target="_blank">
        <label class="idea-label">O que te inspira?<small>Conte sua ideia, referências ou o que ela significa para você.</small><textarea name="ideia" rows="4" required minlength="8" maxlength="1800" placeholder="Um personagem, uma memória, um universo inteiro…"></textarea></label>
        <label class="region-label">Onde você imagina?<small>Qual parte do corpo?</small><select name="regiao" required><option value="">Selecione uma região</option><option>Braço</option><option>Antebraço</option><option>Perna</option><option>Coxa</option><option>Costas</option><option>Peito</option><option>Outra região</option><option>Ainda quero decidir</option></select></label>
        <label class="size-label">Qual o tamanho?<small>Aproximado</small><select name="tamanho" required><option value="">Selecione o tamanho</option><option>Até 10 cm</option><option>10 a 20 cm</option><option>Mais de 20 cm</option><option>Ainda não sei</option></select></label>
        <label class="name-label">Seu nome<small>Como posso te chamar?</small><input name="nome" autocomplete="given-name" required maxlength="80" placeholder="Seu nome"></label>
        <label class="phone-label">Seu WhatsApp<small>Opcional</small><input name="telefone" type="tel" autocomplete="tel" maxlength="24" placeholder="(11) 99999 9999"></label>
        <button class="neon-button" type="submit">${icon('whatsapp')} Enviar para o WhatsApp ${icon('arrow')}</button><p class="form-microcopy">Você revisa a mensagem no WhatsApp antes de enviar. Este site não armazena os dados do formulário.</p><p class="form-status" role="status"></p><noscript><p><a href="${wa}">Abra a conversa com a Ana no WhatsApp</a>.</p></noscript>
      </form><div class="contact-details"><span>${icon('pin')}<span>SÃO PAULO · BRASIL<small>Atendimento com hora marcada</small></span></span><a href="mailto:anabitencourttattoos@gmail.com">${icon('mail')}<span>CONTATO<small>anabitencourttattoos@gmail.com</small></span></a></div></section>`}
  return {hero,archive,process,artist,pillars,contact};
}

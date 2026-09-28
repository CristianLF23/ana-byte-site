export function createSections({works,img,icon,eyebrow,artButton,wa,gallery}) {
  const get = stem => works.find(w=>w.src.includes(stem));
  function hero(){return `
    <section class="hero" id="inicio" aria-labelledby="hero-title">
      <span class="hero-location">Studio em São Paulo</span>
      <div class="hero-depth">
        <picture class="hero-city"><source media="(max-width:767px)" srcset="assets/backgrounds/city-mobile-ana-natural-600.webp 600w, assets/backgrounds/city-mobile-ana-natural.webp 940w" sizes="100vw"><img src="assets/backgrounds/city-desktop-ana-natural.webp" srcset="assets/backgrounds/city-desktop-ana-natural-1280.webp 1280w, assets/backgrounds/city-desktop-ana-natural.webp 2017w" sizes="(min-width:1024px) calc(100vw - 120px), 100vw" alt="A cidade ilustrada de Ana Byte: a artista e seu gato frajola observam prédios e letreiros em neon" width="2017" height="780" fetchpriority="high"></picture>
        <canvas class="city-rain" aria-hidden="true"></canvas>
        <picture class="hero-foreground" aria-hidden="true"><source media="(max-width:767px)" srcset="assets/backgrounds/city-mobile-ana-natural-600.webp 600w, assets/backgrounds/city-mobile-ana-natural.webp 940w" sizes="100vw"><img src="assets/backgrounds/city-desktop-ana-natural.webp" srcset="assets/backgrounds/city-desktop-ana-natural-1280.webp 1280w, assets/backgrounds/city-desktop-ana-natural.webp 2017w" sizes="(min-width:1024px) calc(100vw - 120px), 100vw" alt="" width="2017" height="780"></picture>
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
    return `<section class="chapter archive archive-expanded archive-transposed" id="trabalhos" aria-labelledby="archive-title">
      <div class="portfolio-hero archive-heading">
        <div class="portfolio-portrait archive-portrait"><img src="${b}assets/artist/16-studio.jpg" alt="Ana Byte fotografando seu reflexo no espelho do estúdio" width="921" height="1140" loading="lazy" decoding="async"></div>
        <div>${eyebrow('02','TRABALHOS')}<div class="motion-title-frame"><h2 id="archive-title">ARQUIVO<br><span class="spectrum">VIVO.</span></h2></div><p class="tracked">Tatuagens como portais.<br>Fragmentos de outros mundos<br>na pele real.</p><button class="text-link archive-replay" type="button" aria-controls="archive-video">Ver em movimento ${icon('arrow')}</button></div>
        <div class="portfolio-quote"><p>Arte autoral.<br>Corpo como<br>território.<br>Imaginação<br>sem fronteiras.</p><span class="signature">Ana Byte</span></div>
      </div>
      ${gallery(b)}
    </section>`;
  }
  function process(b='',compact=false){
    const comparisons=['09-heart-process','12-cat-process','11-dagger-process'].map(get).filter(Boolean);
    return `<section class="chapter process ${compact?'compact':''}" id="processo" aria-labelledby="process-title"><div class="process-intro">${eyebrow('03','PROCESSO')}<div class="motion-title-frame"><h2 id="process-title">DO CONCEITO<br><span class="spectrum">À PELE.</span></h2></div><p class="tracked">Ideia. Arte. Transformação.</p><p>Cada tatuagem começa em outro plano e ganha vida no mundo real. Acompanhe, em três trabalhos reais, a passagem do desenho para a pele.</p><a class="text-link" href="${b}index.html#contato">Comece pela ideia ${icon('arrow')}</a><span class="process-progress" aria-hidden="true"><span></span></span></div><div class="process-sequence">${comparisons.map((w,i)=>`<figure class="process-proof technical-frame"><a href="${b+w.src}" data-art="${w.id}" aria-label="Ampliar ${w.title}"><span class="process-image">${img(w,b)}</span><span class="process-curtain" aria-hidden="true"></span><span class="art-plus">${icon('plus')}</span></a><figcaption><small>0${i+1} / 03 · DESENHO E PELE</small><span>${w.title}</span><p>${w.difference}</p><em>TOQUE PARA VER A OBRA</em></figcaption></figure>`).join('')}</div></section>`;
  }
  function artist(b=''){return `<section class="chapter artist" id="sobre" aria-labelledby="artist-title">
      <div class="artist-composition">
        <figure class="artist-photo"><div class="artist-photo-frame"><img src="${b}assets/artist/15-ana-working.jpg" alt="Ana Byte tatuando em seu estúdio" width="863" height="1145" loading="lazy"></div></figure>
        <div class="artist-copy">${eyebrow('04','SOBRE A ARTISTA')}<div class="motion-title-frame"><h2 id="artist-title"><span class="artist-desktop-title">ARTE EM<br>TRÂNSITO.</span><span class="artist-mobile-title">SOBRE A<br>ARTISTA.</span></h2></div><p class="tracked">Arte. Tecnologia. Pele real.</p><p>Ana Byte transforma referências pessoais em tatuagens autorais. Seu traço aproxima natureza, tecnologia e imaginação.</p></div>
      </div>
      <div class="artist-story">
        <figure class="artist-story-portrait technical-frame"><div class="story-photo-window"><img src="${b}assets/artist/23-ana-studio.jpg" alt="Ana Byte sentada no estúdio, entre o caderno de desenhos e luzes magenta" width="1284" height="1593" loading="lazy" decoding="async"></div><figcaption><span>ANA BYTE</span><small>TATUADORA & ARTISTA VISUAL</small></figcaption></figure>
        <div class="artist-story-copy">${eyebrow('04','ALÉM DO TRAÇO')}<div class="motion-title-frame"><h2>OUTROS MUNDOS.<br><span class="spectrum">UMA ARTE MUITO SUA.</span></h2></div>
          <div class="artist-facts" aria-label="Ana em três pontos"><div><strong>5 anos</strong><span>de criação</span></div><div><strong>São Paulo</strong><span>como base</span></div><div><strong>Arte autoral</strong><span>na pele e no digital</span></div></div>
          <p>Entre tatuagens, artes digitais impressas e encomendas, Ana explora formas orgânicas, estruturas mecânicas e contrastes de cor. Seu trabalho também a leva a outras cidades do Brasil e do mundo.</p>
        </div>
      </div>
    </section>`}
  function contact(b=''){return `<section class="chapter contact" id="contato" aria-labelledby="contact-title"><div class="contact-copy">${eyebrow('05','VAMOS CRIAR JUNTOS?')}<div class="motion-title-frame"><h2 id="contact-title">CONTE SUA <span class="spectrum">IDEIA.</span></h2></div><p class="tracked">Vamos transformar em arte na sua pele.</p><p class="contact-description">Conte o que te inspira. Referências, personagens ou uma história sua. Você não precisa chegar com tudo resolvido: o resto, a gente constrói junto.</p></div><form class="project-form technical-frame" action="${wa}" method="get" target="_blank">
        <label class="idea-label">O que te inspira?<small>Conte sua ideia, referências ou o que ela significa para você.</small><textarea name="ideia" rows="4" required minlength="8" maxlength="1800" placeholder="Um personagem, uma memória, um universo inteiro…"></textarea></label>
        <label class="region-label">Onde você imagina?<small>Qual parte do corpo?</small><select name="regiao" required><option value="">Selecione uma região</option><option>Braço</option><option>Antebraço</option><option>Perna</option><option>Coxa</option><option>Costas</option><option>Peito</option><option>Outra região</option><option>Ainda quero decidir</option></select></label>
        <label class="size-label">Qual o tamanho?<small id="size-help">Em centímetros. Pode ser uma estimativa.</small><input type="text" name="tamanho" required maxlength="80" aria-describedby="size-help" placeholder="Ex.: 12 cm ou 12 × 8 cm"></label>
        <label class="name-label">Seu nome<small>Como posso te chamar?</small><input name="nome" autocomplete="given-name" required maxlength="80" placeholder="Seu nome"></label>
        <label class="phone-label">Seu WhatsApp<small>Opcional</small><input name="telefone" type="tel" autocomplete="tel" maxlength="24" placeholder="(11) 99999 9999"></label>
        <button class="neon-button" type="submit">${icon('whatsapp')} Enviar para o WhatsApp ${icon('arrow')}</button><p class="form-microcopy">Você revisa a mensagem no WhatsApp antes de enviar. Este site não armazena os dados do formulário.</p><p class="form-status" role="status"></p><noscript><p><a href="${wa}">Abra a conversa com a Ana no WhatsApp</a>.</p></noscript>
      </form><div class="contact-details"><span>${icon('pin')}<span>SÃO PAULO · BRASIL<small>Atendimento com hora marcada</small></span></span><a href="mailto:anabitencourttattoos@gmail.com">${icon('mail')}<span>CONTATO<small>anabitencourttattoos@gmail.com</small></span></a></div></section>`}
  return {hero,archive,process,artist,contact};
}

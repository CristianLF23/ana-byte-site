export function createArchive({works, img, icon, artButton, esc, wa}) {
  return function gallery(b='') {
    const first=works[0];
    const filters=[['all','Todos'],['tattoo','Tatuagens'],['process','Processo'],['digital','Arte digital']];
    const count=id=>works.filter(w=>id==='all'||(id==='process'?w.kind==='Processo real':id==='tattoo'?w.kind==='Tatuagem autoral':w.category===id)).length;
    return `<section class="portfolio-browser is-film is-intro" aria-label="Acervo de trabalhos">
      <div class="portfolio-toolbar" id="archive-filters">
        <div class="filters" aria-label="Filtrar obras">${filters.map(([id,title],i)=>`<button data-filter="${id}" aria-pressed="${!i}">${title}<small>${count(id)}</small></button>`).join('')}</div>
        <label class="sort-label">Ordenar<select id="portfolio-sort"><option value="curated">Seleção da artista</option><option value="title">Nome da obra</option></select></label>
      </div>
      <div class="portfolio-layout">
        <div class="portfolio-list">
          <div class="portfolio-grid" aria-label="Selecione uma obra">${works.map((w,i)=>artButton(w,b,'portfolio-thumb',i)).join('')}</div>
          <nav class="portfolio-pagination" aria-label="Páginas do acervo" hidden><button class="icon-button page-prev" aria-label="Página anterior">${icon('back')}</button><span data-page-count></span><button class="icon-button page-next" aria-label="Próxima página">${icon('arrow')}</button></nav>
        </div>
        <aside class="selected-work" aria-label="Vídeo e obra em destaque">
          <div class="selected-image">
            <div class="archive-film">
              <video id="archive-video" autoplay playsinline muted loop preload="auto" disablepictureinpicture aria-label="Ana Byte tatuando, vídeo de apresentação do seu trabalho"><source src="${b}assets/video/ana-portfolio.mp4" type="video/mp4"></video>
              <p class="film-error" role="status" hidden>Não foi possível carregar o vídeo. Você pode explorar as obras nesta seção.</p>
            </div>
            <a data-selected-open data-art="${first.id}" href="${b+first.src}" aria-label="Ampliar ${esc(first.title)}">${img(first,b)}<span class="art-plus">${icon('plus')}</span></a>
            <div class="selected-controls"><button class="icon-button selected-prev" aria-label="Obra anterior">${icon('back')}</button><span data-selected-count>01 / ${works.length}</span><button class="icon-button selected-next" aria-label="Próxima obra">${icon('arrow')}</button></div>
          </div>
          <div class="selected-copy archive-film-copy"><p class="eyebrow">ANA BYTE EM MOVIMENTO</p><h2>O TRAÇO<br>GANHA VIDA.</h2><p>Acompanhe a Ana tatuando. Da ideia à pele, um olhar de perto sobre o trabalho.</p><p class="film-caption">Explore as tatuagens, os processos e a arte digital neste mesmo acervo.</p><a class="text-link" href="#archive-filters">Explorar as obras ${icon('down')}</a></div>
          <div class="selected-copy selected-art-copy"><p class="eyebrow" data-selected-kind>${esc(first.kind)}</p><h2 data-selected-title>${esc(first.title)}</h2><p data-selected-description>${esc(first.description)}</p><div class="selected-trace"><span></span><h3>O traço</h3><p data-selected-technique>${esc(first.technique)}</p></div><a class="neon-button" data-selected-contact href="${wa}" target="_blank" rel="noopener">Quero criar algo assim ${icon('arrow')}</a></div>
        </aside>
      </div>
      <p class="portfolio-count" role="status">${works.length} trabalhos no acervo</p>
    </section>`;
  };
}

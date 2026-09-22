(() => {
  'use strict';
  const trigger = document.querySelector('#open-project-form');
  if (!trigger || !window.HTMLDialogElement) return;
  const dialog = document.createElement('dialog');
  dialog.className = 'project-dialog';
  dialog.setAttribute('aria-labelledby', 'project-title');
  dialog.innerHTML = `<div class="project-dialog-top"><span>ANA BYTE / SUA IDEIA</span><button type="button" class="project-close" aria-label="Fechar formulário">Fechar</button></div>
    <form class="project-form">
      <p class="eyebrow">Vamos criar algo seu</p><h2 id="project-title">Toda tatuagem começa<br>com uma <em>ideia.</em></h2>
      <p class="project-intro">Me conta o que você imagina. A gente continua a conversa no WhatsApp.</p>
      <div class="project-fields"><label>Seu nome<input name="nome" autocomplete="given-name" maxlength="80" required placeholder="Como posso te chamar?"></label>
      <label>Sua idade<input name="idade" type="number" inputmode="numeric" min="1" max="120" required placeholder="Em anos"></label>
      <label class="project-wide">Sua ideia<textarea name="ideia" rows="3" maxlength="1800" required placeholder="Tema, personagem, referências, cores..."></textarea></label>
      <label class="project-wide">Local da tatuagem<input name="local" maxlength="120" required placeholder="Ex.: antebraço, perna, costas"></label>
      <label class="project-wide">Tamanho aproximado<input name="tamanho" maxlength="100" required placeholder="Ex.: 15 cm, ou ainda não sei"></label></div>
      <button class="project-submit" type="submit">Enviar ideia pelo WhatsApp<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg></button>
      <p class="project-privacy">Você revisa a mensagem no WhatsApp antes de enviar.</p>
    </form>`;
  document.body.append(dialog);
  trigger.addEventListener('click', () => {
    dialog.showModal();
    dialog.querySelector('input').focus({ preventScroll: true });
  });
  dialog.querySelector('.project-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => trigger.focus({ preventScroll: true }));
  dialog.addEventListener('click', e => {
    const r = dialog.getBoundingClientRect();
    if (e.target === dialog && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) dialog.close();
  });
  dialog.querySelector('form').addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const message = `Oi, Ana! Quero iniciar meu projeto de tatuagem.\n\nNome: ${data.get('nome').trim()}\nIdade: ${data.get('idade')}\nIdeia: ${data.get('ideia').trim()}\nLocal da tatuagem: ${data.get('local').trim()}\nTamanho aproximado: ${data.get('tamanho').trim()}`;
    window.open('https://wa.me/5511919007582?text=' + encodeURIComponent(message), '_blank', 'noopener,noreferrer');
  });
})();

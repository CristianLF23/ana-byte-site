(() => {
  'use strict';
  const form = document.querySelector('[data-project-form]');
  if (!form) return;
  form.querySelectorAll('input,textarea').forEach(field => {
    field.addEventListener('input', () => field.setCustomValidity(''));
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    for (const field of form.querySelectorAll('input,textarea')) {
      if (!field.value.trim()) {
        field.setCustomValidity('Preencha este campo para continuar.');
        field.reportValidity();
        return;
      }
    }
    const data = new FormData(e.currentTarget);
    const message = `Oi, Ana! Quero iniciar meu projeto de tatuagem.\n\nNome: ${data.get('nome').trim()}\nIdade: ${data.get('idade')}\nIdeia: ${data.get('ideia').trim()}\nLocal da tatuagem: ${data.get('local').trim()}\nTamanho aproximado: ${data.get('tamanho').trim()}`;
    window.open('https://wa.me/5511919007582?text=' + encodeURIComponent(message), '_blank', 'noopener,noreferrer');
  });
})();

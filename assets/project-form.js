(() => {
  'use strict';
  const form = document.querySelector('[data-project-form]');
  if (!form) return;
  const getLanguage = () => {
    const language = window.AnaLocale?.language;
    return language === 'en' || language === 'de' ? language : 'pt';
  };
  const translate = source => window.AnaLocale?.t(source) || source;
  const messageCopy = {
    pt: {
      greeting: 'Oi, Ana! Quero iniciar meu projeto de tatuagem.',
      name: 'Nome',
      age: 'Idade',
      idea: 'Ideia',
      location: 'Local da tatuagem',
      size: 'Tamanho aproximado'
    },
    en: {
      greeting: 'Hi, Ana! I would like to start my tattoo project.',
      name: 'Name',
      age: 'Age',
      idea: 'Idea',
      location: 'Tattoo placement',
      size: 'Approximate size'
    },
    de: {
      greeting: 'Hallo Ana! Ich möchte mit dir ein Tattoo planen.',
      name: 'Name',
      age: 'Alter',
      idea: 'Idee',
      location: 'Körperstelle',
      size: 'Ungefähre Größe'
    }
  };
  form.querySelectorAll('input,textarea').forEach(field => {
    field.addEventListener('input', () => field.setCustomValidity(''));
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    for (const field of form.querySelectorAll('input,textarea')) {
      if (!field.value.trim()) {
        field.setCustomValidity(translate('Preencha este campo para continuar.'));
        field.reportValidity();
        return;
      }
    }
    const data = new FormData(e.currentTarget);
    const copy = messageCopy[getLanguage()];
    const message = `${copy.greeting}\n\n${copy.name}: ${String(data.get('nome') || '').trim()}\n${copy.age}: ${String(data.get('idade') || '').trim()}\n${copy.idea}: ${String(data.get('ideia') || '').trim()}\n${copy.location}: ${String(data.get('local') || '').trim()}\n${copy.size}: ${String(data.get('tamanho') || '').trim()}`;
    window.open('https://wa.me/5511919007582?text=' + encodeURIComponent(message), '_blank', 'noopener,noreferrer');
  });
})();

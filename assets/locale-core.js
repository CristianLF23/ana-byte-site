(() => {
  'use strict';

  const storageKey = 'ana-byte-language';
  const codes = { pt: 'pt-BR', en: 'en', de: 'de' };
  const supported = value => Object.prototype.hasOwnProperty.call(codes, value);
  const requested = new URLSearchParams(location.search).get('lang');
  let stored = '';
  try { stored = localStorage.getItem(storageKey) || ''; } catch (_) { /* URL still works. */ }
  let language = supported(requested) ? requested : supported(stored) ? stored : 'pt';
  if (supported(requested)) {
    try { localStorage.setItem(storageKey, language); } catch (_) { /* URL still works. */ }
  }
  const catalogs = { en: Object.create(null), de: Object.create(null) };
  const textStates = new WeakMap();
  const attributeStates = new WeakMap();
  const linkStates = new WeakMap();
  const translatedAttributes = ['alt', 'aria-label', 'placeholder', 'title', 'content', 'data-title', 'data-category', 'data-meta'];

  const controlCopy = {
    pt: { current: 'Idioma: Português. Alterar idioma', group: 'Escolher idioma' },
    en: { current: 'Language: English. Change language', group: 'Choose language' },
    de: { current: 'Sprache: Deutsch. Sprache ändern', group: 'Sprache wählen' }
  };
  const names = { pt: 'Português', en: 'English', de: 'Deutsch' };
  const flags = {
    pt: '<svg viewBox="0 0 24 16" aria-hidden="true" focusable="false"><rect width="24" height="16" fill="#159447"/><path d="M12 1.8 22.1 8 12 14.2 1.9 8Z" fill="#ffdc3d"/><circle cx="12" cy="8" r="3.4" fill="#2054a6"/><path d="M8.8 7.3c2.5-.4 4.8.1 6.5 1.3" fill="none" stroke="#fff" stroke-width=".7"/></svg>',
    en: '<svg viewBox="0 0 24 16" aria-hidden="true" focusable="false"><rect width="24" height="16" fill="#fff"/><path d="M0 0h24v1.25H0zm0 2.5h24v1.25H0zM0 5h24v1.25H0zm0 7.5h24v1.25H0zM0 15h24v1H0zm0-5h24v1.25H0z" fill="#bf2842"/><rect width="10" height="8.5" fill="#244784"/><path d="M2 2h1v1H2zm3 0h1v1H5zm3 0h1v1H8zM2 5h1v1H2zm3 0h1v1H5zm3 0h1v1H8z" fill="#fff"/></svg>',
    de: '<svg viewBox="0 0 24 16" aria-hidden="true" focusable="false"><rect width="24" height="16" fill="#ffce00"/><rect width="24" height="10.7" fill="#dd1e2c"/><rect width="24" height="5.35" fill="#111"/></svg>'
  };

  const common = {
    en: {
      'Voltar à cidade': 'Return to the city',
      'Falar com Ana Byte pelo WhatsApp': 'Message Ana Byte on WhatsApp',
      'Experiência interna Ana Byte': 'Ana Byte inner experience',
      'Abrindo um novo capítulo': 'Opening a new chapter',
      'Universo de Ana Byte': 'Ana Byte’s world',
      'Fechar': 'Close',
      'Preencha este campo para continuar.': 'Please complete this field to continue.'
    },
    de: {
      'Voltar à cidade': 'Zurück zur Stadt',
      'Falar com Ana Byte pelo WhatsApp': 'Ana Byte über WhatsApp kontaktieren',
      'Experiência interna Ana Byte': 'Innenwelt von Ana Byte',
      'Abrindo um novo capítulo': 'Ein neues Kapitel öffnet sich',
      'Universo de Ana Byte': 'Ana Bytes Welt',
      'Fechar': 'Schließen',
      'Preencha este campo para continuar.': 'Bitte fülle dieses Feld aus.'
    }
  };
  Object.assign(catalogs.en, common.en);
  Object.assign(catalogs.de, common.de);
  document.documentElement.lang = codes[language];

  function t(source) {
    if (typeof source !== 'string' || language === 'pt') return source;
    if (source.startsWith('Ampliar a obra ')) {
      return (language === 'de' ? 'Werk vergrößern: ' : 'Enlarge artwork: ') + t(source.slice('Ampliar a obra '.length));
    }
    return catalogs[language][source] ?? source;
  }

  function renderText(node) {
    if (!node.parentElement || node.parentElement.closest('script,style,noscript,[data-locale-ui]')) return;
    const current = node.nodeValue;
    if (!current.trim()) return;
    let state = textStates.get(node);
    if (!state || current !== state.rendered) {
      state = { source: current, rendered: current };
      textStates.set(node, state);
    }
    const leading = state.source.match(/^\s*/)[0];
    const trailing = state.source.match(/\s*$/)[0];
    const body = state.source.slice(leading.length, state.source.length - trailing.length);
    const next = leading + t(body) + trailing;
    if (current !== next) { state.rendered = next; node.nodeValue = next; }
  }

  function sourceAttribute(element, name) {
    return attributeStates.get(element)?.get(name)?.source ?? element.getAttribute(name);
  }

  function renderAttributes(element) {
    if (element.closest('[data-locale-ui]')) return;
    let states = attributeStates.get(element);
    if (!states) { states = new Map(); attributeStates.set(element, states); }
    for (const name of translatedAttributes) {
      if (!element.hasAttribute(name) || (name === 'content' && element.tagName !== 'META')) continue;
      const current = element.getAttribute(name);
      let state = states.get(name);
      if (!state || current !== state.rendered) {
        state = { source: current, rendered: current };
        states.set(name, state);
      }
      const next = t(state.source);
      if (current !== next) { state.rendered = next; element.setAttribute(name, next); }
    }
  }

  function renderLink(link) {
    if (link.closest('[data-locale-ui]')) return;
    const current = link.getAttribute('href');
    if (!current) return;
    let state = linkStates.get(link);
    if (!state || current !== state.rendered) {
      state = { source: current, rendered: current };
      linkStates.set(link, state);
    }
    if (state.source.startsWith('#')) return;
    let url;
    try { url = new URL(state.source, document.baseURI); } catch (_) { return; }
    if (url.origin !== location.origin || !/(?:\/|\.html)$/i.test(url.pathname)) return;
    if (language === 'pt') url.searchParams.delete('lang');
    else url.searchParams.set('lang', language);
    const next = url.href;
    if (current !== next) { state.rendered = next; link.setAttribute('href', next); }
  }

  function apply(target = document) {
    const start = target.nodeType === Node.DOCUMENT_NODE ? target.documentElement : target;
    function visit(node) {
      if (node.nodeType === Node.TEXT_NODE) { renderText(node); return; }
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      if (node.matches('script,style,noscript,[data-locale-ui]')) return;
      renderAttributes(node);
      if (node.tagName === 'A') renderLink(node);
      for (const child of Array.from(node.childNodes)) visit(child);
    }
    if (start) visit(start);
  }

  function syncUrl() {
    const url = new URL(location.href);
    if (language === 'pt') url.searchParams.delete('lang');
    else url.searchParams.set('lang', language);
    if (url.href !== location.href) history.replaceState(history.state, '', url);
  }

  const switchers = new Set();
  function paintSwitcher(control) {
    if (!control.isConnected) { switchers.delete(control); return; }
    const trigger = control.querySelector('.locale-switcher__current');
    trigger.innerHTML = flags[language];
    trigger.setAttribute('aria-label', controlCopy[language].current);
    control.querySelector('.locale-switcher__choices').setAttribute('aria-label', controlCopy[language].group);
    control.querySelectorAll('[data-select-language]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.selectLanguage === language));
    });
  }

  function setLanguage(next) {
    if (!supported(next)) return;
    language = next;
    document.documentElement.lang = codes[next];
    try { localStorage.setItem(storageKey, next); } catch (_) { /* URL remains shareable. */ }
    syncUrl();
    apply(document);
    switchers.forEach(paintSwitcher);
    dispatchEvent(new CustomEvent('ana:languagechange', { detail: { language: next } }));
  }

  function mountSwitcher(overlay) {
    if (!overlay || overlay.querySelector('.locale-switcher')) return;
    const control = document.createElement('div');
    control.className = 'locale-switcher';
    control.dataset.localeUi = 'true';
    control.innerHTML = '<button class="locale-switcher__current" type="button" aria-expanded="false" aria-controls="ana-language-choices"></button>' +
      '<div class="locale-switcher__choices" id="ana-language-choices" role="group" hidden>' +
      Object.keys(codes).map(code => `<button type="button" data-select-language="${code}" lang="${codes[code]}">${flags[code]}<span>${names[code]}</span></button>`).join('') +
      '</div>';
    overlay.append(control);
    switchers.add(control);
    paintSwitcher(control);
    const trigger = control.querySelector('.locale-switcher__current');
    const choices = control.querySelector('.locale-switcher__choices');
    const close = (restoreFocus = false) => {
      choices.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      if (restoreFocus) trigger.focus({ preventScroll: true });
    };
    trigger.addEventListener('click', () => {
      const open = choices.hidden;
      choices.hidden = !open;
      trigger.setAttribute('aria-expanded', String(open));
      if (open) choices.querySelector(`[data-select-language="${language}"]`).focus({ preventScroll: true });
    });
    choices.addEventListener('click', event => {
      const option = event.target.closest('[data-select-language]');
      if (!option) return;
      setLanguage(option.dataset.selectLanguage);
      close(true);
    });
    control.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || choices.hidden) return;
      event.preventDefault();
      event.stopPropagation();
      close(true);
    });
    document.addEventListener('pointerdown', event => {
      if (!control.isConnected || control.contains(event.target)) return;
      close();
    });
  }

  window.AnaLocale = {
    get language() { return language; },
    register(messages) {
      if (messages?.en) Object.assign(catalogs.en, messages.en);
      if (messages?.de) Object.assign(catalogs.de, messages.de);
      apply(document);
    },
    t,
    apply,
    sourceAttribute,
    setLanguage,
    mountSwitcher
  };

  const observer = new MutationObserver(records => {
    for (const record of records) {
      if (record.type === 'characterData') renderText(record.target);
      else if (record.type === 'attributes') {
        renderAttributes(record.target);
        if (record.attributeName === 'href' && record.target.tagName === 'A') renderLink(record.target);
      } else for (const node of record.addedNodes) apply(node);
    }
  });
  observer.observe(document.documentElement, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: [...translatedAttributes, 'href'] });
  apply(document);
  syncUrl();
})();

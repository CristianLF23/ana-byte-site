(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const rootPath = () => `${location.origin}${location.pathname.replace(/(?:sobre|trabalhos(?:\/circuito-organico)?|orcamento)\/index\.html$/, 'index.html')}`;
  const isExternal = href => /^https?:\/\//i.test(href) && !href.startsWith(location.origin);
  const isInterior = path => /\/(?:sobre|trabalhos(?:\/circuito-organico)?|orcamento)\/index\.html$/i.test(path.replace(/\\/g, '/'));

  const makeReturnBar = embedded => {
    const existing = document.querySelector('[data-interior-return]');
    if (existing) return existing.querySelector('[data-interior-return-button]');
    const bar = document.createElement('div');
    bar.className = 'interior-return-bar';
    bar.dataset.interiorReturn = 'true';
    bar.innerHTML = `<span class="interior-return-bar__label">ANA BYTE // acesso interno</span><a class="interior-return-bar__button" data-interior-return-button href="${embedded ? '#' : `${rootPath()}?scene=city`}"><svg aria-hidden="true" viewBox="0 0 18 12"><path d="M17 6H2M7 1 2 6l5 5"/></svg><span>Voltar à cidade</span></a>`;
    document.body.append(bar);
    const button = bar.querySelector('[data-interior-return-button]');
    if (embedded) button.addEventListener('click', event => { event.preventDefault(); window.parent.postMessage({ type: 'ana-interior-close' }, location.origin); });
    return button;
  };

  const setupEmbedded = () => {
    document.body.classList.add('interior-page', 'interior-embedded');
    makeReturnBar(true);
    document.addEventListener('click', event => {
      const link = event.target.closest('a[href]');
      if (!link || link.target === '_blank' || event.defaultPrevented) return;
      const url = new URL(link.href, location.href);
      if (isExternal(url.href) || url.origin !== location.origin || !isInterior(url.pathname)) return;
      event.preventDefault();
      window.parent.postMessage({ type: 'ana-interior-navigate', href: url.href }, location.origin);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        window.parent.postMessage({ type: 'ana-interior-close' }, location.origin);
        return;
      }
      if (event.key !== 'Tab') return;
      const focusables = [...document.querySelectorAll('a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])')]
        .filter(el => !el.disabled && el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden');
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if ((event.shiftKey && document.activeElement === first) || (!event.shiftKey && document.activeElement === last)) {
        event.preventDefault();
        window.parent.postMessage({ type: 'ana-interior-focus-parent' }, location.origin);
      }
    });
  };

  const setupDirect = () => { document.body.classList.add('interior-page'); makeReturnBar(false); };

  const setupParent = () => {
    const layer = document.createElement('div');
    layer.className = 'ana-interior-layer';
    layer.setAttribute('role', 'dialog');
    layer.setAttribute('aria-modal', 'true');
    layer.setAttribute('aria-label', 'Experiência interna Ana Byte');
    layer.hidden = true;
    layer.inert = true;
    layer.innerHTML = '<div class="ana-interior-layer__frame"><span class="ana-interior-layer__glow" aria-hidden="true"></span><button class="ana-interior-layer__close" type="button">Voltar à cidade</button><iframe class="ana-interior-layer__iframe" title="Conteúdo interno Ana Byte" loading="eager"></iframe></div>';
    document.body.append(layer);
    const iframe = layer.querySelector('iframe');
    const close = layer.querySelector('button');
    const html = document.documentElement;
    let savedBodyOverflow = '';
    let savedHtmlOverflow = '';
    let trigger = null;
    let activeUrl = '';
    let clearTimer = 0;
    let openFrame = 0;
    let closing = false;
    let inertSiblings = [];
    const setUnderlyingInert = enabled => {
      if (enabled) {
        inertSiblings = [...document.body.children].filter(child => child !== layer).map(child => ({ child, inert: child.inert, ariaHidden: child.getAttribute('aria-hidden') }));
        inertSiblings.forEach(({ child }) => { child.inert = true; child.setAttribute('aria-hidden', 'true'); });
      } else {
        inertSiblings.forEach(({ child, inert, ariaHidden }) => { child.inert = inert; if (ariaHidden === null) child.removeAttribute('aria-hidden'); else child.setAttribute('aria-hidden', ariaHidden); });
        inertSiblings = [];
      }
    };
    const focusParentClose = () => { if (!layer.hidden) close.focus({ preventScroll: true }); };
    const bindIframeKeyboard = () => {
      try {
        const doc = iframe.contentDocument;
        if (!doc || doc.body.dataset.anaKeyboardBound === 'true') return;
        doc.body.dataset.anaKeyboardBound = 'true';
        doc.addEventListener('keydown', event => { if (event.key === 'Escape') { event.preventDefault(); window.parent.postMessage({ type: 'ana-interior-close' }, location.origin); } }, true);
      } catch (_) { /* cross-origin navigation remains a safe browser fallback */ }
    };
    const open = (href, source) => {
      const url = new URL(href, location.href);
      if (url.origin !== location.origin || !isInterior(url.pathname)) return;
      if (!layer.hidden && !closing) { navigate(href); return; }
      savedBodyOverflow = document.body.style.overflow;
      savedHtmlOverflow = html.style.overflow;
      window.clearTimeout(clearTimer); window.cancelAnimationFrame(openFrame); closing = false;
      trigger = source || document.activeElement;
      activeUrl = `${url.pathname}${url.search}${url.hash}`;
      iframe.src = `${url.pathname}${url.search ? `${url.search}&` : '?'}experience=1`;
      layer.hidden = false; layer.inert = false; setUnderlyingInert(true);
      document.body.classList.add('interior-layer-open'); document.body.style.overflow = 'hidden'; html.style.overflow = 'hidden';
      layer.classList.remove('is-open');
      openFrame = requestAnimationFrame(() => { openFrame = requestAnimationFrame(() => layer.classList.add('is-open')); });
      window.setTimeout(() => { if (!closing) focusParentClose(); }, reduced.matches ? 0 : 420);
    };
    const shut = () => {
      if (layer.hidden || closing) return;
      closing = true; window.cancelAnimationFrame(openFrame); layer.classList.remove('is-open'); layer.inert = true; setUnderlyingInert(false);
      document.body.classList.remove('interior-layer-open'); document.body.style.overflow = savedBodyOverflow; html.style.overflow = savedHtmlOverflow;
      const previousTrigger = trigger; trigger = null;
      clearTimer = window.setTimeout(() => { iframe.src = 'about:blank'; layer.hidden = true; closing = false; }, reduced.matches ? 0 : 650);
      previousTrigger?.focus?.({ preventScroll: true });
    };
    const navigate = href => {
      const url = new URL(href, location.href);
      if (url.origin !== location.origin || !isInterior(url.pathname)) return;
      activeUrl = `${url.pathname}${url.search}${url.hash}`; iframe.src = `${url.pathname}${url.search ? `${url.search}&` : '?'}experience=1`;
      window.setTimeout(() => { if (!closing) focusParentClose(); }, reduced.matches ? 0 : 80);
    };
    iframe.addEventListener('load', bindIframeKeyboard);
    document.addEventListener('click', event => {
      const link = event.target.closest('a[href]');
      if (!link || link.target === '_blank' || event.defaultPrevented) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || !isInterior(url.pathname)) return;
      event.preventDefault(); open(url.href, link);
    });
    window.addEventListener('message', event => {
      if (event.origin !== location.origin || event.source !== iframe.contentWindow) return;
      if (event.data?.type === 'ana-interior-close') shut();
      if (event.data?.type === 'ana-interior-navigate') navigate(event.data.href);
      if (event.data?.type === 'ana-interior-focus-parent') focusParentClose();
    });
    close.addEventListener('click', shut); layer.addEventListener('click', event => { if (event.target === layer) shut(); });
    document.addEventListener('keydown', event => {
      if (layer.hidden || closing) return;
      if (event.key === 'Escape') { event.preventDefault(); shut(); return; }
      if (event.key !== 'Tab') return;
      if (document.activeElement === close && !event.shiftKey) { event.preventDefault(); iframe.focus({ preventScroll: true }); }
      else if (document.activeElement !== iframe && document.activeElement !== close) { event.preventDefault(); focusParentClose(); }
    });
    window.AnaInterior = { open, close: shut, navigate, get activeUrl() { return activeUrl; } };
  };

  if (window.parent !== window && new URLSearchParams(location.search).get('experience') === '1' && isInterior(location.pathname)) setupEmbedded();
  else if (isInterior(location.pathname)) setupDirect();
  else setupParent();
})();

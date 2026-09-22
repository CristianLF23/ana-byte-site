(() => {
  'use strict';
  const header = document.querySelector('[data-header]');
  const updateHeader = () => header?.classList.toggle('is-scrolled', scrollY > 20);
  updateHeader();
  addEventListener('scroll', updateHeader, { passive: true });
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  document.body.classList.add('menu-enhanced');
  const mobile = matchMedia('(max-width: 54rem)');
  const regions = [...document.querySelectorAll('main, .site-footer')];
  const closeMenu = (restore = true) => {
    toggle?.setAttribute('aria-expanded', 'false');
    menu?.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    regions.forEach(el => { el.inert = false; });
    if (restore) toggle?.focus();
  };
  toggle?.addEventListener('click', () => {
    if (toggle.getAttribute('aria-expanded') === 'true') return closeMenu();
    toggle.setAttribute('aria-expanded', 'true');
    menu.classList.add('is-open');
    document.body.classList.add('menu-open');
    regions.forEach(el => { el.inert = true; });
    menu.querySelector('a')?.focus();
  });
  menu?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(false); });
  mobile.addEventListener('change', () => closeMenu(false));
  document.addEventListener('keydown', event => {
    if (toggle?.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') closeMenu();
    if (event.key === 'Tab') {
      const items = [toggle, ...menu.querySelectorAll('a')];
      const first = items[0], last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  const reveal = [...document.querySelectorAll('[data-reveal]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window && !reduced.matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: .08 });
    reveal.forEach(el => { el.classList.add('reveal-ready'); observer.observe(el); });
    reduced.addEventListener('change', () => { if (reduced.matches) { observer.disconnect(); reveal.forEach(el => el.classList.add('is-visible')); } });
  }
  const dialog = document.querySelector('[data-lightbox-dialog]');
  const links = [...document.querySelectorAll('[data-lightbox]')];
  if (!dialog || !dialog.showModal) return;
  let active = 0;
  let trigger;
  const show = index => {
    active = (index + links.length) % links.length;
    const link = links[active];
    const img = dialog.querySelector('[data-lightbox-image]');
    img.src = link.href;
    img.alt = link.querySelector('img')?.alt || link.closest('.tour-stop')?.querySelector('.stop-image img')?.alt || link.dataset.title || '';
    dialog.querySelector('[data-lightbox-title]').textContent = link.dataset.title;
    dialog.querySelector('[data-lightbox-meta]').textContent = `${active + 1} / ${links.length} · ${link.dataset.meta}`;
  };
  links.forEach((link, index) => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); trigger = link; show(index); dialog.showModal();
    document.body.style.overflow = 'hidden';
    dialog.querySelector('[data-lightbox-close]').focus();
  }));
  dialog.querySelector('[data-lightbox-close]').addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-lightbox-prev]').addEventListener('click', () => show(active - 1));
  dialog.querySelector('[data-lightbox-next]').addEventListener('click', () => show(active + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); show(active + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(active - 1); }
  });
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { document.body.style.overflow = ''; trigger?.focus({ preventScroll: true }); });
})();

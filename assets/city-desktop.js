(() => {
  'use strict';

  const media = matchMedia('(min-width:1024px) and (min-aspect-ratio:6/5)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  const world = document.querySelector('#city-world');
  const chapters = [...document.querySelectorAll('.city-chapter')];
  const names = ['city', 'works', 'artist', 'contact'];
  let active = false;
  let current = -1;
  let trigger = null;
  let listening = false;

  function section(index) {
    if (index === current) return;
    current = index;
    root.dataset.scene = names[index];
    window.dispatchEvent(new CustomEvent('ana:scenechange', { detail: { index, scene: names[index] } }));
    chapters.forEach((chapter, n) => {
      chapter.classList.toggle('is-current', n === index);
      chapter.inert = !reduced.matches && n !== index;
      chapter.setAttribute('aria-hidden', String(!reduced.matches && n !== index));
    });
  }

  const clamp = value => Math.max(0, Math.min(1, value));
  const fade = (progress, start, end) => clamp((progress - start) / (end - start));
  function render(progress) {
    if (!active || !media.matches || reduced.matches) return;
    const p = clamp(progress);
    const alphas = [1 - fade(p, .18, .29), fade(p, .18, .29) * (1 - fade(p, .43, .54)), fade(p, .43, .54) * (1 - fade(p, .69, .80)), fade(p, .69, .80)];
    const x = [0, 4, 7, 0];
    const y = [0, 5, 2, 7];
    chapters.forEach((chapter, index) => {
      const arrival = index === 0 ? 1 : fade(p, [0, .18, .43, .69][index], [0, .29, .54, .80][index]);
      const departure = index === 3 ? 0 : fade(p, [.18, .43, .69, 1][index], [.29, .54, .80, 1][index]);
      chapter.style.opacity = String(alphas[index]);
      chapter.style.transform = `translate3d(${x[index] * (1 - arrival) - 3 * departure}%, ${y[index] * (1 - arrival) - 4 * departure}%, 0) scale(${(index === 0 ? 1 + .09 * departure : 1 + .045 * (1 - arrival) - .035 * departure).toFixed(4)})`;
    });
    section(p < .235 ? 0 : p < .485 ? 1 : p < .745 ? 2 : 3);
  }

  function onScroll() {
    if (!active || !media.matches) return;
    if (reduced.matches) {
      const middle = innerHeight * .45;
      let closest = 0;
      let distance = Infinity;
      chapters.forEach((chapter, index) => {
        const rect = chapter.getBoundingClientRect();
        const gap = Math.abs(rect.top + Math.min(rect.height, innerHeight) / 2 - middle);
        if (gap < distance) { distance = gap; closest = index; }
      });
      section(closest);
      return;
    }
    render(scrollY / Math.max(1, world.offsetHeight - innerHeight));
  }

  function jumpTo(name, smooth = true) {
    const index = names.indexOf(name);
    if (index < 0 || !active) return;
    if (reduced.matches) {
      chapters[index].scrollIntoView({ block: 'start', behavior: smooth ? 'smooth' : 'auto' });
      return;
    }
    const progress = [0, .355, .615, .915][index];
    scrollTo({ top: progress * Math.max(1, world.offsetHeight - innerHeight), behavior: smooth ? 'smooth' : 'auto' });
  }

  function build() {
    if (active || !media.matches || root.dataset.experience !== 'started') return;
    const target = names.includes(window.AnaFlight?.scene) ? window.AnaFlight.scene : 'city';
    active = true;
    root.classList.add('city-desktop-mode');
    root.dataset.reduced = String(reduced.matches);
    if (reduced.matches) {
      chapters.forEach(chapter => { chapter.inert = false; chapter.setAttribute('aria-hidden', 'false'); chapter.style.opacity = ''; chapter.style.transform = ''; });
    } else if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      trigger = ScrollTrigger.create({ trigger: world, start: 'top top', end: 'bottom bottom', invalidateOnRefresh: true, onUpdate: self => render(self.progress) });
    }
    if (!listening) { addEventListener('scroll', onScroll, { passive: true }); listening = true; }
    requestAnimationFrame(() => {
      if (!active) return;
      jumpTo(target, false);
      onScroll();
    });
  }

  function teardown() {
    if (!active) return;
    const leaving = names[Math.max(0, current)];
    trigger?.kill(); trigger = null;
    active = false; current = -1;
    if (listening) { removeEventListener('scroll', onScroll); listening = false; }
    root.classList.remove('city-desktop-mode');
    root.removeAttribute('data-reduced');
    chapters.forEach(chapter => { chapter.style.removeProperty('opacity'); chapter.style.removeProperty('transform'); chapter.inert = false; chapter.removeAttribute('aria-hidden'); chapter.classList.remove('is-current'); });
    window.AnaFlight?.sync?.(leaving);
    scrollTo({ top: 0, behavior: 'auto' });
  }

  addEventListener('ana:experience-start', build, { once: true });
  document.addEventListener('ana:desktop-navigate', event => { if (active) jumpTo(event.detail.scene); });
  media.addEventListener('change', () => { if (media.matches) build(); else teardown(); });
  reduced.addEventListener('change', () => { if (active) { const name = names[Math.max(0, current)]; teardown(); window.AnaFlight?.sync?.(name); build(); } });
  if (root.dataset.experience === 'started') build();
})();

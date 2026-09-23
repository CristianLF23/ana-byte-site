(() => {
  'use strict';
  const root = document.documentElement;
  const video = document.querySelector('#city-flight');
  const layer = document.querySelector('.flight-layer');
  const status = document.querySelector('.flight-status');
  const skip = document.querySelector('.skip-flight');
  const nav = document.querySelector('.journey-nav');
  const header = document.querySelector('.city-header');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const scenes = { city: '#inicio', works: '#obras', artist: '#atelie', contact: '#contato' };
  const labels = { city: 'Voltando à cidade', works: 'A caminho do arquivo vivo', artist: 'A caminho do ateliê', contact: 'Seu próximo capítulo' };
  let scene = 'city', destination = 'city', started = false, travelling = false;
  let settling = false, watchdog = 0, cameraTween = null;
  let savedInert = [];
  const tween = (target, props) => window.gsap ? gsap.to(target, props) : null;
  const set = (target, props) => {
    if (window.gsap) gsap.set(target, props);
    else if (props.autoAlpha !== undefined) {
      target.style.opacity = props.autoAlpha;
      target.style.visibility = props.autoAlpha ? 'visible' : 'hidden';
    }
  };
  function announce(name) {
    scene = name;
    dispatchEvent(new CustomEvent('ana:scenechange', { detail: { scene } }));
  }
  function focusDestination() {
    const heading = document.querySelector(scenes[scene]).querySelector('h1, h2');
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  }
  function release() {
    travelling = false;
    settling = false;
    root.classList.remove('city-travelling');
    nav.removeAttribute('aria-busy');
    savedInert.forEach(([element, inert]) => { element.inert = inert; });
    savedInert = [];
    // Arrival visibility is owned by city.js, after the transition lock is lifted.
    announce(destination);
    skip.hidden = true;
    status.textContent = '';
    focusDestination();
  }
  function arrive(immediate = false) {
    if (!travelling || settling) return;
    settling = true;
    clearTimeout(watchdog);
    cameraTween?.kill();
    cameraTween = null;
    video.pause();
    const next = document.querySelector(scenes[destination]);
    const previous = document.querySelector(scenes[scene]);
    previous.style.removeProperty('opacity');
    previous.style.removeProperty('visibility');
    set(next, { autoAlpha: 0 });
    announce(destination);
    // Keep arriving controls inert until the whole facade has settled.
    next.inert = true;
    const matte = next.querySelector('.facade-stage, .contact-city-matte, .hero-copy');
    if (immediate || reduced.matches || !window.gsap) {
      set(layer, { autoAlpha: 0 });
      set(status, { autoAlpha: 0 });
      set(next, { autoAlpha: 1 });
      release();
      return;
    }
    tween(layer, { autoAlpha: 0, duration: .7, ease: 'power2.inOut' });
    tween(status, { autoAlpha: 0, duration: .25 });
    if (matte) gsap.fromTo(matte, { scale: 1.035 }, { scale: 1, duration: 1.05, ease: 'power3.out', clearProps: 'scale' });
    tween(next, { autoAlpha: 1, duration: .7, ease: 'power2.inOut', onComplete: release });
  }
  function go(name) {
    if (!started || !scenes[name] || travelling || name === scene) return;
    destination = name;
    travelling = true;
    settling = false;
    root.classList.add('city-travelling');
    nav.setAttribute('aria-busy', 'true');
    savedInert = [header, nav, document.querySelector('.scene-arrows'), document.querySelector(scenes[scene])].map(element => [element, element.inert]);
    savedInert.forEach(([element]) => { element.inert = true; });
    // The video is reserved for the first descent. Other destinations use a short dissolve.
    if (reduced.matches || scene !== 'city' || name !== 'works') { arrive(reduced.matches); return; }
    status.textContent = labels[name];
    skip.hidden = false;
    skip.focus({ preventScroll: true });
    video.currentTime = 0;
    set(video, { scale: 1, xPercent: 0, yPercent: 0, transformOrigin: name === 'artist' ? '25% 42%' : '69% 42%' });
    set(layer, { autoAlpha: 1 });
    const current = document.querySelector(scenes[scene]);
    tween(current, { autoAlpha: 0, duration: .42, ease: 'power2.out' });
    tween(status, { autoAlpha: 1, duration: .4, delay: .3 });
    // A finite clip bridges two stable destinations; it is deliberately never looped.
    watchdog = setTimeout(() => arrive(), 4500);
    try {
      const play = video.play();
      play?.catch(() => arrive());
    } catch (_) { arrive(); }
  }
  video.addEventListener('playing', () => {
    if (!travelling || settling || cameraTween) return;
    const duration = Number.isFinite(video.duration) ? Math.max(.3, video.duration - video.currentTime) : 4;
    cameraTween = tween(video, { scale: 1.19, duration, ease: 'power1.inOut' });
  });
  video.addEventListener('ended', () => { cameraTween = null; arrive(); });
  video.addEventListener('timeupdate', () => { if (video.currentTime >= 2) arrive(); });
  video.addEventListener('error', () => arrive());
  skip.addEventListener('click', () => arrive());
  document.addEventListener('visibilitychange', () => {
    if (!travelling || settling) return;
    if (document.hidden) {
      video.pause();
      cameraTween?.pause();
    } else {
      cameraTween?.resume();
      video.play().catch(() => arrive());
    }
  });
  reduced.addEventListener('change', () => { if (reduced.matches) arrive(true); });
  window.AnaFlight = {
    go,
    start() {
      started = true;
      const requested = new URLSearchParams(location.search).get('scene');
      announce(scenes[requested] ? requested : 'city');
    },
    get scene() { return scene; },
    get travelling() { return travelling; }
  };
})();

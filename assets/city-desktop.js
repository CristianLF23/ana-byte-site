(() => {
  'use strict';

  const media = matchMedia('(min-width:1024px) and (min-aspect-ratio:6/5)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  const chapters = [...document.querySelectorAll('.city-chapter')];
  const names = ['city', 'works', 'artist', 'contact'];
  let active = false;
  let current = -1;
  let ticking = false;
  let motion = [];

  function section(index) {
    if (index === current || index < 0) return;
    current = index;
    root.dataset.scene = names[index];
    window.dispatchEvent(new CustomEvent('ana:scenechange', {
      detail: { index, scene: names[index] }
    }));
  }

  function currentSection() {
    const line = innerHeight * .46;
    let index = 0;
    chapters.forEach((chapter, n) => {
      if (chapter.getBoundingClientRect().top <= line) index = n;
    });
    return index;
  }

  function onScroll() {
    if (!active || ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      if (active) section(currentSection());
    });
  }

  function jumpTo(name, smooth = true) {
    const index = names.indexOf(name);
    if (!active || index < 0) return;
    chapters[index].scrollIntoView({
      block: 'start',
      behavior: smooth && !reduced.matches ? 'smooth' : 'instant'
    });
    if (!smooth || reduced.matches) section(index);
  }

  function makeMotion() {
    if (reduced.matches || !window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    const hero = chapters[0];
    const painting = document.querySelector('.city-painting');
    const heroCopy = hero.querySelector('.hero-copy');
    const gallery = document.querySelector('.mounted-gallery');
    const artistImage = document.querySelector('.mounted-artist .artist-image');

    motion.push(gsap.timeline({ scrollTrigger: {
      trigger: hero, start: 'top top', end: 'bottom top', scrub: .35
    } })
      .to(painting, { yPercent: 8, scale: 1.14, ease: 'none' }, 0)
      .to(heroCopy, { yPercent: -29, autoAlpha: .12, ease: 'none' }, 0));

    if (gallery) motion.push(gsap.fromTo(gallery,
      { y: 90, autoAlpha: .6 },
      { y: 0, autoAlpha: 1, ease: 'none', scrollTrigger: {
        trigger: gallery, start: 'top bottom', end: 'center center', scrub: .4
      } }
    ));

    if (artistImage) motion.push(gsap.fromTo(artistImage,
      { y: 90, clipPath: 'inset(18% 0 0 0)' },
      { y: 0, clipPath: 'inset(0% 0 0 0)', ease: 'none', scrollTrigger: {
        trigger: artistImage, start: 'top bottom', end: 'center center', scrub: .45
      } }
    ));

    const revealTargets = document.querySelectorAll(
      '.desktop-works-intro, .desktop-works-heading, .desktop-process-copy, .desktop-about-head, .desktop-value-card, .desktop-contact-intro, .desktop-contact-guide, .desktop-contact-form'
    );
    revealTargets.forEach((element, index) => {
      motion.push(gsap.fromTo(element,
        { y: 28, autoAlpha: .72 },
        { y: 0, autoAlpha: 1, duration: .65, ease: 'power2.out', scrollTrigger: {
          trigger: element, start: 'top 90%', once: true
        } }
      ));
    });

    document.querySelectorAll('.static-collection [data-work]').forEach((element, index) => {
      motion.push(gsap.fromTo(element,
        { y: index % 3 === 1 ? 46 : 28, autoAlpha: .78 },
        { y: 0, autoAlpha: 1, duration: .7, ease: 'power2.out', scrollTrigger: {
          trigger: element, start: 'top 94%', once: true
        } }
      ));
    });
    document.fonts?.ready.then(() => { if (active) ScrollTrigger.refresh(); });
  }

  function clearMotion() {
    motion.forEach(animation => {
      animation.scrollTrigger?.kill();
      animation.kill();
    });
    motion = [];
    window.gsap?.set?.('.city-painting, .city-hero .hero-copy, .mounted-gallery, .mounted-artist .artist-image, .static-collection [data-work], .desktop-works-intro, .desktop-works-heading, .desktop-process-copy, .desktop-about-head, .desktop-value-card, .desktop-contact-intro, .desktop-contact-guide, .desktop-contact-form', {
      clearProps: 'all'
    });
  }

  function build() {
    if (active || !media.matches || root.dataset.experience !== 'started') return;
    const target = names.includes(window.AnaFlight?.scene) ? window.AnaFlight.scene : 'city';
    active = true;
    current = -1;
    root.classList.add('city-desktop-mode');
    root.dataset.reduced = String(reduced.matches);
    chapters[3].setAttribute('aria-labelledby', 'desktop-contact-title');
    chapters.forEach(chapter => {
      chapter.inert = false;
      chapter.removeAttribute('aria-hidden');
    });
    makeMotion();
    addEventListener('scroll', onScroll, { passive: true });
    requestAnimationFrame(() => {
      if (!active) return;
      if (target !== 'city') jumpTo(target, false);
      section(currentSection());
      window.ScrollTrigger?.refresh?.();
    });
  }

  function teardown() {
    if (!active) return;
    const leaving = names[Math.max(0, current)];
    active = false;
    removeEventListener('scroll', onScroll);
    clearMotion();
    root.classList.remove('city-desktop-mode');
    root.removeAttribute('data-reduced');
    chapters[3].setAttribute('aria-labelledby', 'contact-title');
    chapters.forEach(chapter => {
      chapter.style.removeProperty('opacity');
      chapter.style.removeProperty('transform');
      chapter.inert = false;
      chapter.removeAttribute('aria-hidden');
    });
    window.AnaFlight?.sync?.(leaving);
    scrollTo({ top: 0, behavior: 'instant' });
  }

  addEventListener('ana:experience-start', build, { once: true });
  document.addEventListener('ana:desktop-navigate', event => {
    if (active) jumpTo(event.detail.scene);
  });
  media.addEventListener('change', () => {
    if (media.matches) build();
    else teardown();
  });
  reduced.addEventListener('change', () => {
    if (!active) return;
    root.dataset.reduced = String(reduced.matches);
    clearMotion();
    makeMotion();
  });
  if (root.dataset.experience === 'started') build();
})();

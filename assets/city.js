(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const chapters = [$('#inicio'), $('#obras'), $('#atelie'), $('#contato')];
  const sceneNames = ['city', 'works', 'artist', 'contact'];
  const works = [...document.querySelectorAll('[data-work]')].map(a => ({
    src: a.getAttribute('href'), title: a.dataset.title,
    category: a.dataset.category, alt: a.querySelector('img').alt
  }));
  const galleryImage = $('#gallery-image');
  const galleryLink = $('#gallery-open');
  const autoplayButton = $('#gallery-autoplay');
  const artDialog = $('#art-dialog');
  const collectionDialog = $('#collection-dialog');
  let index = 0, dialogIndex = 0, sceneIndex = 0;
  let started = false, userPaused = reduced.matches, effectsPaused = false;
  let galleryTimer = 0, transitionTimer = 0, swipeStart = null, suppressClick = false;
  let galleryVisible = false, dialogTrigger = null;
  let dialogScroll = 0;
  let savedOverflow = '';
  let dialogScrollLocked = false;
  const pad = n => String(n).padStart(2, '0');

  function syncAutoplay() {
    clearInterval(galleryTimer);
    autoplayButton.setAttribute('aria-pressed', String(userPaused || reduced.matches || effectsPaused));
    autoplayButton.lastElementChild.textContent = userPaused || reduced.matches || effectsPaused ? 'Reproduzir' : 'Pausar';
    if (started && galleryVisible && !userPaused && !reduced.matches && !effectsPaused && !document.hidden && !artDialog.open && !collectionDialog.open) {
      galleryTimer = setInterval(() => selectWork(index + 1, false), 5500);
    }
  }
  function pauseGallery() { userPaused = true; syncAutoplay(); }
  function selectWork(next, manual = true) {
    if (manual) pauseGallery();
    index = (next + works.length) % works.length;
    const work = works[index];
    clearTimeout(transitionTimer);
    galleryLink.classList.add('is-changing');
    const apply = () => {
      galleryImage.src = work.src;
      galleryImage.alt = work.alt;
      galleryLink.href = work.src;
      galleryLink.setAttribute('aria-label', 'Ampliar a obra ' + work.title);
      $('#work-title').textContent = work.title;
      $('#work-category').textContent = work.category;
      $('#work-counter').textContent = pad(index + 1) + ' / ' + pad(works.length);
      galleryLink.classList.remove('is-changing');
      const nextImage = new Image();
      nextImage.src = works[(index + 1) % works.length].src;
    };
    transitionTimer = setTimeout(apply, reduced.matches ? 0 : 120);
  }
  $('#previous-work').addEventListener('click', () => selectWork(index - 1));
  $('#next-work').addEventListener('click', () => selectWork(index + 1));
  autoplayButton.addEventListener('click', () => { userPaused = !userPaused; syncAutoplay(); });
  $('#obras').addEventListener('focusin', e => { if (e.target !== autoplayButton && e.target.matches('a, button')) pauseGallery(); });
  galleryLink.addEventListener('pointerdown', e => {
    if (!e.isPrimary) return;
    pauseGallery();
    swipeStart = { x: e.clientX, y: e.clientY, id: e.pointerId };
    suppressClick = false;
    galleryLink.setPointerCapture?.(e.pointerId);
  });
  galleryLink.addEventListener('pointerup', e => {
    if (!swipeStart || e.pointerId !== swipeStart.id) return;
    const dx = e.clientX - swipeStart.x, dy = e.clientY - swipeStart.y;
    if (Math.abs(dx) > 36 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      selectWork(index + (dx < 0 ? 1 : -1));
      suppressClick = true;
      setTimeout(() => { suppressClick = false; }, 250);
    }
    swipeStart = null;
  });
  galleryLink.addEventListener('pointercancel', () => { swipeStart = null; });
  galleryLink.addEventListener('click', e => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (!artDialog.showModal) return;
    e.preventDefault();
    if (!suppressClick) openArt(index, galleryLink);
  });

  function paintDialog() {
    const work = works[dialogIndex];
    $('#dialog-image').src = work.src;
    $('#dialog-image').alt = work.alt;
    $('#dialog-title').textContent = work.title;
    $('#dialog-category').textContent = work.category;
    $('#dialog-counter').textContent = pad(dialogIndex + 1) + ' / ' + pad(works.length);
    $('#dialog-contact').href = 'https://wa.me/5511919007582?text=' + encodeURIComponent('Oi Ana! Vi a obra "' + work.title + '" no seu site e quero conversar sobre uma ideia de tatuagem.');
  }
  function lockDialogScroll() {
    if (dialogScrollLocked) return;
    dialogScrollLocked = true;
    dialogScroll = scrollY;
    savedOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  function unlockDialogScroll() {
    if (!dialogScrollLocked) return;
    dialogScrollLocked = false;
    document.body.style.overflow = savedOverflow;
    scrollTo({ top: dialogScroll, behavior: 'instant' });
  }
  function openArt(next, trigger) {
    pauseGallery();
    dialogIndex = (next + works.length) % works.length;
    dialogTrigger = trigger;
    paintDialog();
    lockDialogScroll();
    artDialog.showModal();
    $('#close-art').focus();
  }
  $('#close-art').addEventListener('click', () => artDialog.close());
  const dialogMove = delta => { dialogIndex = (dialogIndex + delta + works.length) % works.length; paintDialog(); };
  $('#dialog-prev').addEventListener('click', () => dialogMove(-1));
  $('#dialog-next').addEventListener('click', () => dialogMove(1));
  artDialog.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); dialogMove(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); dialogMove(1); }
  });
  artDialog.addEventListener('close', () => { unlockDialogScroll(); dialogTrigger?.focus({ preventScroll: true }); syncAutoplay(); });
  artDialog.addEventListener('click', e => { if (e.target === artDialog && !insideDialog(artDialog, e)) artDialog.close(); });
  function insideDialog(dialog, event) {
    const r = dialog.getBoundingClientRect();
    return event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom;
  }

  works.forEach((work, n) => {
    const button = document.createElement('button');
    button.type = 'button';
    const image = document.createElement('img');
    image.src = work.src; image.alt = work.alt; image.loading = 'lazy';
    const label = document.createElement('span');
    label.textContent = work.title;
    const category = document.createElement('small');
    category.textContent = work.category; label.append(category);
    button.append(image, label);
    button.addEventListener('click', () => {
      collectionDialog.close();
      selectWork(n);
      openArt(n, $('#open-collection'));
    });
    $('#collection-grid').append(button);
  });
  $('#open-collection').addEventListener('click', () => {
    pauseGallery(); lockDialogScroll(); collectionDialog.showModal(); $('#close-collection').focus();
  });
  $('#close-collection').addEventListener('click', () => collectionDialog.close());
  collectionDialog.addEventListener('close', () => {
    if (artDialog.open) return;
    unlockDialogScroll();
    $('#open-collection').focus({ preventScroll: true });
    syncAutoplay();
  });
  $('#show-process')?.addEventListener('click', () => openArt(10, $('#show-process')));
  $('#rooftop-cat')?.addEventListener('click', e => {
    const cat = e.currentTarget;
    cat.classList.add('is-greeting');
    setTimeout(() => cat.classList.remove('is-greeting'), 1900);
  });

  function activateScene(n) {
    sceneIndex = n;
    galleryVisible = n === 1;
    root.dataset.scene = sceneNames[n];
    chapters.forEach((chapter, i) => {
      chapter.classList.toggle('is-current', i === n);
      if (root.classList.contains('city-enhanced') || root.classList.contains('city-cinema')) {
        chapter.inert = i !== n;
        chapter.setAttribute('aria-hidden', String(i !== n));
      }
    });
    document.querySelectorAll('.journey-nav [data-destination]').forEach(a => {
      if (a.dataset.destination === sceneNames[n]) a.setAttribute('aria-current', 'step');
      else a.removeAttribute('aria-current');
    });
    $('.journey-line').style.left = (n * 25) + '%';
    syncAutoplay();
  }
  function configureCamera() {
    root.classList.add('city-cinema');
    activateScene(sceneIndex);
  }
  function goTo(name) {
    window.AnaFlight?.go(name);
  }
  addEventListener('ana:scenechange', e => {
    const n = sceneNames.indexOf(e.detail.scene);
    if (n >= 0) activateScene(n);
  });
  document.querySelectorAll('[data-destination]').forEach(a => a.addEventListener('click', e => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault(); goTo(a.dataset.destination);
  }));
  const observer = new IntersectionObserver(entries => {
    if (root.classList.contains('city-enhanced') || root.classList.contains('city-cinema')) return;
    entries.forEach(entry => { if (entry.isIntersecting) activateScene(chapters.indexOf(entry.target)); });
  }, { threshold: .4 });
  chapters.forEach(c => observer.observe(c));
  const motionToggle = $('#motion-toggle');
  motionToggle.hidden = reduced.matches;
  motionToggle.addEventListener('click', () => {
    effectsPaused = !effectsPaused;
    root.classList.toggle('effects-paused', effectsPaused);
    motionToggle.setAttribute('aria-pressed', String(effectsPaused));
    motionToggle.lastElementChild.textContent = effectsPaused ? 'Efeitos pausados' : 'Efeitos ativos';
    syncAutoplay();
  });
  document.addEventListener('visibilitychange', () => { root.classList.toggle('page-hidden', document.hidden); syncAutoplay(); });
  reduced.addEventListener('change', () => {
    const previousScene = sceneNames[sceneIndex];
    userPaused = true;
    motionToggle.hidden = reduced.matches;
    configureCamera();
    goTo(previousScene);
    syncAutoplay();
  });
  let resizeTimer = 0, lastWidth = innerWidth;
  addEventListener('resize', () => {
    if (innerWidth === lastWidth) return;
    lastWidth = innerWidth;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { const name = sceneNames[sceneIndex]; configureCamera(); goTo(name); }, 180);
  });
  addEventListener('ana:experience-start', () => {
    started = true;
    scrollTo({ top: 0, behavior: 'instant' });
    window.AnaFlight?.start();
    activateScene(sceneNames.indexOf(window.AnaFlight?.scene || 'city'));
    syncAutoplay();
  }, { once: true });
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  scrollTo({ top: 0, behavior: 'instant' });
  configureCamera();
  syncAutoplay();
  // The complete, semantic gallery remains in the document when motion or JS is unavailable.
})();

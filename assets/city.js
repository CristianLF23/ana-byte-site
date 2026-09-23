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
  const artDialog = $('#art-dialog');
  const collectionDialog = $('#collection-dialog');
  const portfolioVideo = $('#portfolio-video');
  let introFinished = false;
  let videoRequested = false;
  let videoBlocked = false, videoPlayPending = false, videoPlayToken = 0, videoWatchdog = 0;
  let interiorOpen = false;
  let index = 0, dialogIndex = 0, sceneIndex = 0;
  let started = false, userPaused = reduced.matches, effectsPaused = false;
  let galleryTimer = 0, transitionTimer = 0, swipeStart = null, suppressClick = false;
  let galleryVisible = false, dialogTrigger = null;
  let dialogScroll = 0;
  let savedOverflow = '';
  let dialogScrollLocked = false;
  const pad = n => String(n).padStart(2, '0');
  let scrollFrame = 0;
  const scrollStep = () => $('.city-viewport').clientHeight;
  const scrollScene = () => Math.max(0, Math.min(3, Math.round(scrollY / scrollStep())));
  function syncScrollScene() {
    scrollFrame = 0;
    if (!started || interiorOpen || artDialog.open || collectionDialog.open || window.AnaFlight?.travelling) return;
    window.AnaFlight?.go(sceneNames[scrollScene()]);
  }
  addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(syncScrollScene);
  }, { passive: true });

  function stopPortfolioVideo() {
    videoPlayToken++;
    videoPlayPending = false;
    clearTimeout(videoWatchdog);
    portfolioVideo.pause();
  }
  function showVideoPrompt() {
    const paused = userPaused || videoBlocked || (reduced.matches && !videoRequested);
    $('.video-hint').hidden = introFinished || !paused;
    $('#gallery-instruction').textContent = paused ? 'Toque para assistir · Deslize para ver obras' : 'Toque para pausar · Deslize para ver obras';
    galleryLink.setAttribute('aria-label', paused ? 'Reproduzir o vídeo dos trabalhos de Ana Byte' : 'Pausar o vídeo dos trabalhos de Ana Byte');
  }
  function finishPortfolioIntro() {
    if (introFinished) return;
    selectWork(0, false);
    syncAutoplay();
  }

  function syncAutoplay() {
    clearInterval(galleryTimer);
    const canPlay = started && galleryVisible && !userPaused && !effectsPaused && !interiorOpen && !document.hidden && !artDialog.open && !collectionDialog.open;
    if (!introFinished) {
      galleryLink.classList.add('is-video');
      galleryLink.setAttribute('aria-label', 'Reproduzir ou pausar o vídeo de Ana Byte');
      $('#work-title').textContent = 'O universo de Ana Byte';
      $('#work-category').textContent = 'Em movimento · 25 segundos';
      $('#work-counter').textContent = 'Vídeo / 19 obras';
      if (canPlay && !videoBlocked && (!reduced.matches || videoRequested)) {
        if (portfolioVideo.paused && !videoPlayPending) {
          const token = ++videoPlayToken;
          videoPlayPending = true;
          portfolioVideo.muted = true;
          portfolioVideo.defaultMuted = true;
          clearTimeout(videoWatchdog);
          videoWatchdog = setTimeout(() => {
            if (token === videoPlayToken && !introFinished && galleryVisible && !userPaused && !interiorOpen && !document.hidden && !videoBlocked) finishPortfolioIntro();
          }, 10000);
          portfolioVideo.play().then(() => {
            if (token !== videoPlayToken) return;
            videoPlayPending = false;
            clearTimeout(videoWatchdog);
            showVideoPrompt();
          }).catch(error => {
            if (token !== videoPlayToken || introFinished) return;
            videoPlayPending = false;
            clearTimeout(videoWatchdog);
            // Internal cancellation never changes the visitor's pause preference.
            if (error.name === 'NotSupportedError') { finishPortfolioIntro(); return; }
            videoBlocked = true;
            showVideoPrompt();
          });
        }
      } else stopPortfolioVideo();
      showVideoPrompt();
    }
    if (introFinished) $('#gallery-instruction').textContent = 'Deslize para explorar · Toque para ampliar';
    if (introFinished && canPlay && !reduced.matches) {
      galleryTimer = setInterval(() => selectWork(index + 1, false), 5500);
    }
  }
  function pauseGallery() { userPaused = true; syncAutoplay(); }
  function selectWork(next, manual = true) {
    introFinished = true;
    stopPortfolioVideo();
    videoBlocked = false;
    $('.video-hint').hidden = true;
    galleryLink.classList.remove('is-video');
    $('#gallery-instruction').textContent = 'Deslize para explorar · Toque para ampliar';
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
  galleryLink.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); selectWork(index + (e.key === 'ArrowRight' ? 1 : -1)); }
    if (e.key === ' ') { e.preventDefault(); galleryLink.click(); }
  });
  portfolioVideo.addEventListener('ended', finishPortfolioIntro);
  portfolioVideo.addEventListener('error', finishPortfolioIntro);
  portfolioVideo.querySelector('source').addEventListener('error', finishPortfolioIntro);
  $('#obras').addEventListener('focusin', e => { if (introFinished && e.target.matches('a, button')) pauseGallery(); });
  galleryLink.addEventListener('pointerdown', e => {
    if (!e.isPrimary) return;
    if (introFinished) pauseGallery();
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
  galleryLink.addEventListener('dragstart', e => e.preventDefault());
  galleryLink.addEventListener('click', e => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (!artDialog.showModal) return;
    e.preventDefault();
    if (!suppressClick && !introFinished) { videoRequested = true; videoBlocked = false; userPaused = !portfolioVideo.paused; syncAutoplay(); return; }
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
    $('.journey-current').textContent = pad(n + 1);
    $('.journey-name').textContent = ['A cidade', 'As obras', 'A Ana', 'Sua ideia'][n];
    $('.journey-line').style.width = ((n + 1) * 25) + '%';
    const arrows = $('.scene-arrows');
    arrows.hidden = n === 0;
    arrows.querySelector('.scene-next').hidden = n === 3;
    arrows.querySelector('.scene-back').dataset.destination = sceneNames[Math.max(0, n - 1)];
    arrows.querySelector('.scene-next').dataset.destination = sceneNames[Math.min(3, n + 1)];
    arrows.querySelector('.scene-back').setAttribute('aria-label', ['Voltar para a cidade', 'Voltar para a cidade', 'Voltar para as obras', 'Voltar para conhecer a Ana'][n]);
    arrows.querySelector('.scene-next').setAttribute('aria-label', n === 1 ? 'Avançar para conhecer a Ana' : 'Avançar para iniciar seu projeto');
    syncAutoplay();
  }
  function configureCamera() {
    root.classList.add('city-cinema');
    activateScene(sceneIndex);
  }
  function goTo(name) {
    const n = sceneNames.indexOf(name);
    if (n < 0 || window.AnaFlight?.travelling) return;
    // The page retains real scroll positions; the painted scene stays on screen.
    scrollTo({ top: n * scrollStep(), behavior: 'instant' });
    window.AnaFlight?.go(name);
  }
  addEventListener('ana:scenechange', e => {
    const n = sceneNames.indexOf(e.detail.scene);
    if (n >= 0) activateScene(n);
    if (!window.AnaFlight?.travelling) requestAnimationFrame(syncScrollScene);
  });
  addEventListener('ana:interiorchange', e => { interiorOpen = e.detail.open; syncAutoplay(); });
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
    scrollTo({ top: sceneIndex * scrollStep(), behavior: 'instant' });
    syncAutoplay();
  }, { once: true });
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  scrollTo({ top: 0, behavior: 'instant' });
  configureCamera();
  syncAutoplay();
  // The complete, semantic gallery remains in the document when motion or JS is unavailable.
})();

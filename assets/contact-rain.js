(() => {
  'use strict';

  const root = document.documentElement;
  const viewport = document.querySelector('.city-viewport');
  const contact = document.querySelector('.contact-chapter');
  if (!viewport || !contact || !window.HTMLCanvasElement) return;
  const desktopMedia = matchMedia('(min-width:1024px) and (min-aspect-ratio:6/5)');
  const hero = document.querySelector('.city-hero');
  const desktopFinal = document.querySelector('.desktop-contact-intro');
  if (!hero || !desktopFinal) return;
  let heroInView = true;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const colors = ['205,246,255', '232,248,255', '250,177,220'];
  const canAnimate = () => root.classList.contains('city-cinema') &&
    !root.classList.contains('effects-paused') &&
    !root.classList.contains('interior-layer-open') &&
    !document.hidden && !reduced.matches;

  function makeRain(initialHost, className, before, isActive, preserveExitFrame) {
    let host = initialHost;
    const canvas = document.createElement('canvas');
    canvas.className = className;
    canvas.setAttribute('aria-hidden', 'true');
    host.insertBefore(canvas, before);
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return null;

    const drops = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let previousTime = 0;

    function resetDrop(drop, fillScene) {
      const depth = Math.random();
      const layer = depth < 0.51 ? 0 : depth < 0.88 ? 1 : 2;
      const speedRange = [[170, 320], [340, 580], [590, 870]][layer];
      drop.speed = speedRange[0] + Math.random() * (speedRange[1] - speedRange[0]);
      drop.angle = 0.22 + Math.random() * 0.17;
      drop.length = [5, 10, 17][layer] + Math.random() * [6, 10, 15][layer];
      drop.width = [0.5, 0.75, 1.15][layer] + Math.random() * 0.4;
      drop.alpha = [0.10, 0.18, 0.27][layer] + Math.random() * [0.13, 0.16, 0.18][layer];
      drop.color = colors[Math.random() < 0.1 ? 2 : Math.random() < 0.5 ? 0 : 1];
      drop.phase = Math.random() * Math.PI * 2;
      drop.x = Math.random() * (width + 100) - 65;
      drop.y = fillScene ? Math.random() * height : -20 - Math.random() * height * 0.5;
    }

    function resize() {
      const bounds = host.getBoundingClientRect();
      const nextWidth = Math.max(1, Math.round(bounds.width));
      const nextHeight = Math.max(1, Math.round(bounds.height));
      if (nextWidth === width && nextHeight === height) return;
      width = nextWidth;
      height = nextHeight;
      const scale = Math.min(devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      drops.length = Math.min(165, Math.max(58, Math.round(width * height / 4300)));
      for (let i = 0; i < drops.length; i++) {
        drops[i] = {};
        resetDrop(drops[i], true);
      }
    }

    function draw(now) {
      frame = 0;
      if (!canAnimate() || !isActive()) return;
      const elapsed = Math.min(0.04, Math.max(0, (now - previousTime) / 1000));
      previousTime = now;
      ctx.clearRect(0, 0, width, height);

      for (const drop of drops) {
        const gust = Math.sin(now * 0.00042 + drop.phase) * 0.035;
        const slant = drop.angle + gust;
        drop.x += drop.speed * slant * elapsed;
        drop.y += drop.speed * elapsed;
        if (drop.y > height + drop.length || drop.x > width + drop.length) {
          resetDrop(drop, false);
          continue;
        }

        const tailX = drop.x - drop.length * slant;
        const tailY = drop.y - drop.length;
        ctx.lineCap = 'round';
        ctx.lineWidth = drop.width;
        ctx.strokeStyle = `rgba(${drop.color},${drop.alpha * 0.56})`;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(drop.x, drop.y);
        ctx.stroke();
        if (drop.width > 0.8) {
          ctx.lineWidth = drop.width * 0.76;
          ctx.strokeStyle = `rgba(${drop.color},${drop.alpha})`;
          ctx.beginPath();
          ctx.moveTo(drop.x - slant * 3, drop.y - 3);
          ctx.lineTo(drop.x, drop.y);
          ctx.stroke();
        }
      }
      frame = requestAnimationFrame(draw);
    }

    function sync() {
      const allowed = canAnimate();
      if (allowed && isActive()) {
        resize();
        if (!frame) {
          previousTime = performance.now();
          frame = requestAnimationFrame(draw);
        }
      } else {
        cancelAnimationFrame(frame);
        frame = 0;
        previousTime = 0;
        // The departing city keeps one rain frame while the video fades away.
        if (!preserveExitFrame || !allowed) ctx.clearRect(0, 0, width, height);
      }
    }

    function rehost(nextHost, nextBefore) {
      if (host === nextHost) return;
      cancelAnimationFrame(frame);
      frame = 0;
      host = nextHost;
      host.insertBefore(canvas, nextBefore);
      width = 0;
      height = 0;
      resize();
      sync();
    }

    return { sync, resize, rehost };
  }

  // One layer bridges the opening city and its first camera descent; the other
  // remains physically inside the final sign, behind the invitation.
  const opening = makeRain(
    desktopMedia.matches ? hero : viewport,
    'opening-rain-canvas',
    desktopMedia.matches ? null : viewport.querySelector('.flight-status'),
    () => root.dataset.experience === 'started' && root.dataset.scene === 'city' &&
      (!desktopMedia.matches || heroInView),
    true
  );
  const final = makeRain(
    desktopMedia.matches ? desktopFinal : contact,
    'contact-rain-canvas',
    desktopMedia.matches ? null : contact.querySelector('.contact-portal'),
    () => contact.classList.contains('is-current') && !root.classList.contains('city-travelling'),
    false
  );
  const syncAll = () => { opening?.sync(); final?.sync(); };
  const resizeAll = () => { opening?.resize(); final?.resize(); };

  new IntersectionObserver(entries => {
    heroInView = entries[0]?.isIntersecting ?? false;
    opening?.sync();
  }).observe(hero);
  desktopMedia.addEventListener('change', () => {
    opening?.rehost(desktopMedia.matches ? hero : viewport,
      desktopMedia.matches ? null : viewport.querySelector('.flight-status'));
    final?.rehost(desktopMedia.matches ? desktopFinal : contact,
      desktopMedia.matches ? null : contact.querySelector('.contact-portal'));
    requestAnimationFrame(() => { resizeAll(); syncAll(); });
  });

  new MutationObserver(syncAll).observe(root, { attributes: true, attributeFilter: ['class', 'data-scene', 'data-experience'] });
  new MutationObserver(syncAll).observe(contact, { attributes: true, attributeFilter: ['class'] });
  document.addEventListener('visibilitychange', syncAll);
  reduced.addEventListener('change', syncAll);
  addEventListener('ana:experience-start', syncAll);
  addEventListener('ana:scenechange', syncAll);
  addEventListener('ana:interiorchange', syncAll);
  addEventListener('resize', resizeAll, { passive: true });
  syncAll();
})();

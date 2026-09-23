(() => {
  'use strict';

  const chapter = document.querySelector('.contact-chapter');
  if (!chapter || !window.HTMLCanvasElement) return;

  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const canvas = document.createElement('canvas');
  canvas.className = 'contact-rain-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  chapter.insertBefore(canvas, chapter.querySelector('.contact-portal'));
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const drops = [];
  const colors = ['205,246,255', '232,248,255', '250,177,220'];
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
    const bounds = chapter.getBoundingClientRect();
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

  function shouldRun() {
    return root.classList.contains('city-cinema') &&
      chapter.classList.contains('is-current') &&
      !root.classList.contains('city-travelling') &&
      !root.classList.contains('effects-paused') &&
      !root.classList.contains('interior-layer-open') &&
      !document.hidden && !reduced.matches;
  }

  function draw(now) {
    frame = 0;
    if (!shouldRun()) return;
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
    if (shouldRun()) {
      resize();
      if (!frame) {
        previousTime = performance.now();
        frame = requestAnimationFrame(draw);
      }
    } else {
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
      ctx.clearRect(0, 0, width, height);
    }
  }

  new MutationObserver(sync).observe(chapter, { attributes: true, attributeFilter: ['class'] });
  new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['class', 'data-scene'] });
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync);
  addEventListener('ana:scenechange', sync);
  addEventListener('ana:interiorchange', sync);
  addEventListener('resize', resize, { passive: true });
  sync();
})();

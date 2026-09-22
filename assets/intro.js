(function () {
  "use strict";

  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var seenKey = "ana-byte-intro-seen";
  var startedAt = Date.now();
  var completed = 0;
  var finished = false;
  var previousFocus = document.activeElement;
  var previousScroll = window.scrollY || window.pageYOffset || 0;
  var backgroundStates = [];
  var focusStates = [];

  function wasSeen() {
    try { return window.sessionStorage.getItem(seenKey) === "1"; } catch (error) { return false; }
  }

  function markSeen() {
    try { window.sessionStorage.setItem(seenKey, "1"); } catch (error) { /* storage can be unavailable */ }
  }

  if (wasSeen()) {
    window.setTimeout(function () { window.dispatchEvent(new CustomEvent("ana:intro-complete")); }, 0);
    return;
  }

  var overlay = document.createElement("section");
  overlay.className = "ana-intro";
  overlay.setAttribute("aria-label", "Introdução");
  overlay.innerHTML = [
    '<div class="ana-intro__frame">',
      '<div class="ana-intro__meta"><span>BIO DIGITAL ART</span><span>SÃO PAULO</span></div>',
      '<div class="ana-intro__specimen" aria-hidden="true">',
        '<svg class="ana-intro__ring" viewBox="0 0 100 100" role="presentation">',
          '<circle cx="50" cy="50" r="43"></circle><circle cx="50" cy="50" r="35"></circle><circle cx="50" cy="50" r="27"></circle>',
          '<path d="M9 50h17m48 0h17M50 9v17m0 48v17M17 21l13 13m40 32 13 13M83 21 70 34M30 66 17 79"></path>',
        '</svg>',
        '<i class="ana-intro__node ana-intro__node--one"></i><i class="ana-intro__node ana-intro__node--two"></i><i class="ana-intro__node ana-intro__node--three"></i>',
        '<div class="ana-intro__wordmark"><strong>ANA</strong><span>BYTE</span></div>',
      '</div>',
      '<p class="ana-intro__caption">Preparando experiência</p>',
      '<p class="ana-intro__status" aria-live="polite">Inicializando galeria</p>',
      '<div class="ana-intro__progress" role="progressbar" aria-label="Preparando experiência" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">',
        '<i class="ana-intro__segment"></i>'.repeat(14),
      '</div>',
      '<button class="ana-intro__enter" type="button">Entrar agora</button>',
    '</div>'
  ].join("");
  document.body.appendChild(overlay);

  var enter = overlay.querySelector(".ana-intro__enter");
  var status = overlay.querySelector(".ana-intro__status");
  var progress = overlay.querySelector(".ana-intro__progress");
  var segments = Array.prototype.slice.call(overlay.querySelectorAll(".ana-intro__segment"));
  var images = Array.prototype.filter.call(document.images, function (image) { return image.loading !== "lazy"; });
  var total = images.length + (document.fonts ? 1 : 0);
  var ready = total === 0;

  function lockBackground() {
    Array.prototype.forEach.call(document.querySelectorAll("header, main, footer, .site-header, .site-footer"), function (element) {
      if (element === overlay || backgroundStates.some(function (state) { return state.element === element; })) return;
      backgroundStates.push({ element: element, inert: element.inert, hadAria: element.hasAttribute("aria-hidden"), aria: element.getAttribute("aria-hidden") });
      element.inert = true;
      element.setAttribute("aria-hidden", "true");
    });
    Array.prototype.forEach.call(document.querySelectorAll("a, button, input, textarea, select, summary, [tabindex]"), function (element) {
      if (overlay.contains(element)) return;
      focusStates.push({ element: element, hadTabindex: element.hasAttribute("tabindex"), tabindex: element.getAttribute("tabindex") });
      element.setAttribute("tabindex", "-1");
    });
    document.body.classList.add("ana-intro-open");
  }

  function restoreBackground() {
    backgroundStates.forEach(function (state) {
      state.element.inert = state.inert;
      if (state.hadAria) state.element.setAttribute("aria-hidden", state.aria);
      else state.element.removeAttribute("aria-hidden");
    });
    focusStates.forEach(function (state) {
      if (state.hadTabindex) state.element.setAttribute("tabindex", state.tabindex);
      else state.element.removeAttribute("tabindex");
    });
    focusStates = [];
    backgroundStates = [];
    document.body.classList.remove("ana-intro-open");
    window.scrollTo(0, previousScroll);
  }

  function updateProgress() {
    var value = total ? Math.round((completed / total) * 100) : 100;
    progress.setAttribute("aria-valuenow", String(value));
    segments.forEach(function (segment, index) { segment.classList.toggle("is-lit", index < Math.ceil(value / 100 * segments.length)); });
    if (value >= 100) status.textContent = "Experiência pronta";
    else if (completed > 0) status.textContent = "Carregando elementos visuais";
  }

  function itemReady() {
    completed += 1;
    updateProgress();
    if (completed >= total) { ready = true; maybeFinish(); }
  }

  function maybeFinish() {
    if (!ready || finished) return;
    var wait = reduced ? 0 : Math.max(0, 1300 - (Date.now() - startedAt));
    window.setTimeout(finish, wait);
  }

  function finish() {
    if (finished) return;
    finished = true;
    markSeen();
    restoreBackground();
    overlay.style.pointerEvents = "none";
    overlay.classList.add("is-leaving");
    window.setTimeout(function () { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }, reduced ? 0 : 460);
    window.dispatchEvent(new CustomEvent("ana:intro-complete"));
    if (previousFocus && previousFocus !== document.body && previousFocus !== document.documentElement && document.contains(previousFocus)) {
      try { previousFocus.focus({ preventScroll: true }); } catch (error) { previousFocus.focus(); }
    }
  }

  function skip() { ready = true; finish(); }

  enter.addEventListener("click", skip);
  document.addEventListener("keydown", function (event) {
    if (finished) return;
    if (event.key === "Escape") { event.preventDefault(); skip(); return; }
    if (event.key === "Tab") {
      event.preventDefault();
      enter.focus({ preventScroll: true });
    }
  });
  lockBackground();

  images.forEach(function (image) {
    var settled = false;
    function settle() {
      if (settled) return;
      settled = true;
      itemReady();
    }
    function decodeOrSettle() {
      if (typeof image.decode === "function") image.decode().then(settle, settle);
      else settle();
    }
    if (image.complete) decodeOrSettle();
    else {
      image.addEventListener("load", decodeOrSettle, { once: true });
      image.addEventListener("error", settle, { once: true });
    }
  });
  var fontsSettled = false;
  function settleFonts() {
    if (fontsSettled) return;
    fontsSettled = true;
    itemReady();
  }
  if (document.fonts) document.fonts.ready.then(settleFonts, settleFonts);
  updateProgress();
  if (ready) maybeFinish();
  window.setTimeout(skip, reduced ? 1200 : 3000);
}());

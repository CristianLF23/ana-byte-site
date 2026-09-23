(function () {
  "use strict";

  var CLASS = "byte-entry";
  var root;
  var startButton;
  var previousState = [];
  var previousOverflow = { document: "", body: "" };
  var locked = false;
  var started = false;
  var readiness = "loading";
  var readinessTimer;

  function init() {
    if (document.querySelector("." + CLASS)) return;
    injectStyle();
    root = buildOverlay();
    document.body.appendChild(root);
    window.AnaLocale?.mountSwitcher(root);
    window.AnaLocale?.apply(root);
    root.focus({ preventScroll: true });
    lockPage();
    bindKeyboard();
    window.AnaCityEntry = {
      get state() { return readiness; },
      start: startExperience,
      element: root
    };
    beginReadiness();
  }

  function injectStyle() {
    if (document.querySelector('link[href*="city-entry.css"]')) return;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "assets/city-entry.css";
    document.head.appendChild(link);
  }

  function buildOverlay() {
    var overlay = document.createElement("div");
    overlay.className = CLASS;
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "byte-entry-title");
    overlay.setAttribute("aria-describedby", "byte-entry-subtitle byte-entry-status");
    overlay.setAttribute("tabindex", "-1");
    overlay.innerHTML = '' +
      '<div class="byte-entry__frame" aria-hidden="true">' +
        '<svg viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">' +
          '<path class="byte-entry__frame-line" d="M6 0H94L100 6V94L94 100H6L0 94V6Z"/>' +
          '<path class="byte-entry__frame-line byte-entry__frame-line--inner" d="M10 0H90L100 10M100 90L90 100H10M0 90V10L10 0"/>' +
        '</svg>' +
      '</div>' +
      '<div class="byte-entry__content">' +
        '<div class="byte-entry__mark" aria-label="Ana Byte" role="img">ANA <span>BYTE</span></div>' +
        '<p class="byte-entry__eyebrow">Tatuagem autoral</p>' +
        '<h1 class="byte-entry__title" id="byte-entry-title">Preparando<br>experiência</h1>' +
        '<p class="byte-entry__subtitle" id="byte-entry-subtitle">Abrindo o canal para o universo de Ana Byte</p>' +
        '<div class="byte-entry__telemetry" aria-hidden="true"><span>ANA BYTE</span><span class="byte-entry__percent">0%</span></div>' +
        '<div class="byte-entry__progress" role="progressbar" aria-label="Carregando experiência" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span class="byte-entry__progress-value"></span></div>' +
        '<p class="byte-entry__status" id="byte-entry-status" role="status" aria-live="polite">Sincronizando sinais visuais</p>' +
        '<button class="byte-entry__start" type="button" disabled>Começar experiência</button>' +
      '</div>';
    startButton = overlay.querySelector(".byte-entry__start");
    startButton.addEventListener("click", startExperience);
    return overlay;
  }

  function lockPage() {
    if (locked) return;
    locked = true;
    previousOverflow.document = document.documentElement.style.overflow;
    previousOverflow.body = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    Array.prototype.forEach.call(document.body.children, function (element) {
      if (element === root) return;
      previousState.push({
        element: element,
        inert: element.inert,
        ariaHidden: element.getAttribute("aria-hidden")
      });
      element.inert = true;
      element.setAttribute("aria-hidden", "true");
    });
  }

  function unlockPage() {
    previousState.forEach(function (state) {
      if (!state.element.isConnected) return;
      state.element.inert = state.inert;
      if (state.ariaHidden === null) state.element.removeAttribute("aria-hidden");
      else state.element.setAttribute("aria-hidden", state.ariaHidden);
    });
    previousState = [];
    document.documentElement.style.overflow = previousOverflow.document;
    document.body.style.overflow = previousOverflow.body;
    locked = false;
  }

  function bindKeyboard() {
    document.addEventListener("keydown", function (event) {
      if (!root || started || event.key !== "Escape") return;
      event.preventDefault();
      startButton.focus({ preventScroll: true });
    });
    root.addEventListener("keydown", function (event) {
      if (event.key !== "Tab") return;
      var focusable = Array.prototype.filter.call(root.querySelectorAll("button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])"), function (element) {
        return element.getClientRects().length && !element.closest('[hidden]');
      });
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  function setProgress(value, status) {
    var safeValue = Math.max(0, Math.min(100, Math.round(value)));
    var bar = root.querySelector(".byte-entry__progress-value");
    var progress = root.querySelector(".byte-entry__progress");
    root.querySelector(".byte-entry__percent").textContent = safeValue + "%";
    bar.style.width = safeValue + "%";
    progress.setAttribute("aria-valuenow", String(safeValue));
    if (status) root.querySelector(".byte-entry__status").textContent = status;
  }

  function waitForImage(image) {
    if (image.complete && image.naturalWidth > 0) return Promise.resolve(true);
    return new Promise(function (resolve) {
      var done = false;
      function finish(loaded) {
        if (done) return;
        done = true;
        image.removeEventListener("load", finish);
        image.removeEventListener("error", finish);
        resolve(loaded !== false);
      }
      image.addEventListener("load", function () { finish(true); }, { once: true });
      image.addEventListener("error", function () { finish(false); }, { once: true });
      if (image.decode) image.decode().then(function () { finish(true); }, function () {});
    });
  }

  function beginReadiness() {
    var critical = Array.prototype.slice.call(document.querySelectorAll("img[data-city-critical]"));
    var total = critical.length + 1;
    var completed = 0;
    var hasUnavailableResource = false;
    var beganAt = performance.now();
    var displayProgress = 0;
    var resourcesSettled = false;
    var MINIMUM_LOAD_TIME = 2600;
    setProgress(0, "Estabelecendo conexão visual");

    function settleResource(label) {
      if (readiness !== "loading" || !root || !root.isConnected) return;
      completed += 1;
      if (completed >= total) resourcesSettled = true;
    }

    function finishReadiness(fallback) {
      if (readiness !== "loading" || !root || !root.isConnected) return;
      if (readinessTimer) window.clearTimeout(readinessTimer);
      readiness = "ready";
      root.classList.add("is-ready");
      startButton.disabled = false;
      setProgress(100, fallback ? "A cena está pronta em modo leve" : "Sinal estabilizado / pronto para iniciar");
      if (!root.contains(document.activeElement) || document.activeElement === root) startButton.focus({ preventScroll: true });
    }

    // Resource completion and a visible preparation sequence must both finish.
    function paintProgress(now) {
      if (readiness !== "loading") return;
      var elapsed = Math.min(1, (now - beganAt) / MINIMUM_LOAD_TIME);
      var available = resourcesSettled ? 100 : Math.min(92, 10 + completed / total * 82);
      displayProgress = Math.max(displayProgress, Math.min(available, elapsed * 100));
      var status = displayProgress < 35 ? "Acendendo a cidade" : displayProgress < 72 ? "Preparando o arquivo de arte" : "Abrindo seu caminho";
      setProgress(displayProgress, status);
      if (displayProgress >= 100 && resourcesSettled) {
        window.setTimeout(function () { finishReadiness(hasUnavailableResource); }, 180);
      } else requestAnimationFrame(paintProgress);
    }
    requestAnimationFrame(paintProgress);

    readinessTimer = window.setTimeout(function () {
      hasUnavailableResource = true;
      resourcesSettled = true;
    }, 8000);

    var fontReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    fontReady.then(function () {
      settleResource("Tipografia sincronizada");
    }, function () {
      hasUnavailableResource = true;
      settleResource("Tipografia disponível em modo alternativo");
    });

    critical.forEach(function (image, index) {
      waitForImage(image).then(function (loaded) {
        if (!loaded) hasUnavailableResource = true;
        settleResource(loaded ? "Imagem " + (index + 1) + " pronta" : "Imagem " + (index + 1) + " indisponível / modo leve");
      });
    });
  }

  function startExperience() {
    if (started || readiness !== "ready") return;
    started = true;
    readiness = "started";
    root.classList.add("is-starting");
    document.documentElement.dataset.experience = "started";
    unlockPage();
    var transitionTime = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 500;
    window.setTimeout(function () {
      if (root && root.parentNode) root.parentNode.removeChild(root);
      window.dispatchEvent(new CustomEvent("ana:experience-start"));
      var title = document.getElementById("city-title");
      if (title) title.focus({ preventScroll: true });
    }, transitionTime);
  }

  if (document.body) init();
  else document.addEventListener("DOMContentLoaded", init, { once: true });
})();

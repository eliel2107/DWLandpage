/* DW Projetos — comportamento da landing page (JS vanilla, sem dependências) */
(function () {
  'use strict';

  var rm = false;
  try { rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var AUTOPLAY = true;
  var off = rm || !AUTOPLAY;
  var pad2 = function (n) { return String(n).padStart(2, '0'); };

  /* ---------------- Menu mobile ---------------- */
  var menuBtn = document.getElementById('menu-btn');
  var menu = document.getElementById('menu-mobile');
  if (menuBtn && menu) {
    var setMenu = function (open) {
      menu.hidden = !open;
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    menuBtn.addEventListener('click', function () { setMenu(menu.hidden); });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
  }

  /* ---------------- Hero slideshow ---------------- */
  (function hero() {
    var media = document.getElementById('hero-media');
    if (!media) return;
    var SLIDE_MS = 6500;
    var slides = Array.prototype.slice.call(media.querySelectorAll('.slide'));
    var imgs = slides.map(function (s) { return s.querySelector('.kbimg'); });
    var inds = Array.prototype.slice.call(media.querySelectorAll('.ind-btn'));
    var numEl = document.getElementById('hero-num');
    var capEl = document.getElementById('hero-cap');
    var holdEl = document.getElementById('hero-hold');
    var N = slides.length;
    var cur = 0, prev = -1, holding = false, remaining = SLIDE_MS, start = 0, t = 0;

    function playState() { return holding ? 'paused' : 'running'; }

    function newFill() {
      var f = document.createElement('span');
      f.className = 'ind-fill';
      f.style.animationName = off ? 'none' : 'grow';
      f.style.animationPlayState = playState();
      return f;
    }

    function render(restartFill) {
      slides.forEach(function (s, i) {
        var isCur = i === cur, isPrev = i === prev;
        s.setAttribute('aria-hidden', isCur ? 'false' : 'true');
        s.style.opacity = (isCur || isPrev) ? 1 : 0;
        s.style.zIndex = isCur ? 2 : (isPrev ? 1 : 0);
        imgs[i].style.animationName = (isCur || isPrev) && !rm ? 'kb' : 'none';
        imgs[i].style.animationPlayState = playState();
      });
      inds.forEach(function (b, i) {
        b.setAttribute('aria-current', i === cur ? 'true' : 'false');
        var ind = b.querySelector('.ind');
        var fill = ind.querySelector('.ind-fill');
        if (i !== cur) { if (fill) fill.remove(); return; }
        if (!fill || restartFill) { if (fill) fill.remove(); ind.appendChild(newFill()); }
        else fill.style.animationPlayState = playState();
      });
      numEl.textContent = pad2(cur + 1);
      capEl.textContent = slides[cur].getAttribute('data-cap');
      holdEl.innerHTML = (holding && !off) ? '<span class="hold-tag">❚❚ PAUSADO</span>' : '';
    }

    // inicia (ou retoma) a contagem com o tempo que falta para a próxima troca
    function arm(ms) {
      clearTimeout(t);
      remaining = ms;
      if (holding || off) return;
      start = Date.now();
      t = setTimeout(function () { goSlide((cur + 1) % N); }, ms);
    }
    function goSlide(i) {
      if (i !== cur) { prev = cur; cur = i; }
      render(true);
      arm(SLIDE_MS);
    }
    // mouse/foco sobre a foto: congela a troca e guarda o tempo restante
    function hold() {
      if (holding) return;
      holding = true;
      clearTimeout(t);
      if (start) remaining = Math.max(0, remaining - (Date.now() - start));
      start = 0;
      render(false);
    }
    // mouse/foco saiu: continua de onde parou
    function release() {
      if (!holding) return;
      holding = false;
      render(false);
      arm(remaining);
    }

    inds.forEach(function (b, i) { b.addEventListener('click', function () { goSlide(i); }); });
    media.addEventListener('mouseenter', hold);
    media.addEventListener('mouseleave', release);
    media.addEventListener('focusin', hold);
    media.addEventListener('focusout', function (e) {
      if (!media.contains(e.relatedTarget)) release();
    });

    if (rm) render(true);
    arm(SLIDE_MS);
  })();

  /* ---------------- Serviços (abas com avanço automático) ---------------- */
  (function services() {
    var section = document.getElementById('servicos');
    var area = document.getElementById('svc-area');
    if (!section || !area) return;
    var SVC_MS = 8000;
    var ACCENT = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#F28C1B';
    var tabs = Array.prototype.slice.call(area.querySelectorAll('[role="tab"]'));
    var panes = Array.prototype.slice.call(area.querySelectorAll('[role="tabpanel"]'));
    var imgs = Array.prototype.slice.call(area.querySelectorAll('.svc-img'));
    var select = document.getElementById('f-servico');
    var N = tabs.length;
    var svc = 0, sRemaining = SVC_MS, sPaused = true, sStart = 0, st = 0, svcHover = false, svcInView = false, svcRun = false;

    function barHTML() {
      return '<span class="svc-bar" style="position: absolute; left: 0; bottom: 0; height: 2px; width: 100%; background: rgba(255,255,255,0.08)">' +
        '<span style="position: absolute; inset: 0; background: var(--accent); transform-origin: left; animation-duration: 8000ms; animation-timing-function: linear; animation-fill-mode: both; animation-name: ' +
        (off ? 'none' : 'grow') + '; animation-play-state: ' + (svcRun ? 'running' : 'paused') + '"></span></span>';
    }

    function render(restartBar) {
      tabs.forEach(function (tab, i) {
        var a = i === svc;
        tab.setAttribute('aria-selected', a ? 'true' : 'false');
        tab.tabIndex = a ? 0 : -1;
        tab.style.backgroundColor = a ? '#151C21' : 'transparent';
        var spans = tab.children;
        spans[0].style.color = a ? ACCENT : '#7A868E';
        tab.querySelector('.svc-title').style.color = a ? '#FFFFFF' : '#A7B1B7';
        var bar = tab.querySelector('.svc-bar');
        if (!a) { if (bar) bar.remove(); return; }
        if (!bar || restartBar) {
          if (bar) bar.remove();
          tab.insertAdjacentHTML('beforeend', barHTML());
        } else {
          bar.firstElementChild.style.animationPlayState = svcRun ? 'running' : 'paused';
        }
      });
      imgs.forEach(function (im, i) {
        var a = i === svc;
        im.setAttribute('aria-hidden', a ? 'false' : 'true');
        im.style.opacity = a ? 1 : 0;
      });
      panes.forEach(function (p, i) {
        var a = i === svc;
        p.setAttribute('aria-hidden', a ? 'false' : 'true');
        p.style.opacity = a ? 1 : 0;
        p.style.transform = a ? 'none' : 'translateY(8px)';
        p.style.visibility = a ? 'visible' : 'hidden';
      });
    }

    function svcUpdate() {
      var p = svcHover || !svcInView || rm || !AUTOPLAY;
      if (p === sPaused) return;
      sPaused = p;
      if (p) {
        clearTimeout(st);
        if (sStart) sRemaining = Math.max(0, sRemaining - (Date.now() - sStart));
        sStart = 0;
      } else {
        armSvc(sRemaining);
      }
      svcRun = !p;
      render(false);
    }
    function armSvc(ms) {
      clearTimeout(st);
      sRemaining = ms;
      if (sPaused) return;
      sStart = Date.now();
      st = setTimeout(function () { goSvc((svc + 1) % N); }, ms);
    }
    function goSvc(i) {
      svc = i;
      render(true);
      armSvc(SVC_MS);
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { goSvc(i); });
      tab.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var n = (i + d + N) % N;
        goSvc(n);
        tabs[n].focus();
      });
    });

    panes.forEach(function (p) {
      var link = p.querySelector('[data-form]');
      if (link && select) link.addEventListener('click', function () {
        select.value = link.getAttribute('data-form');
      });
    });

    area.addEventListener('mouseenter', function () { svcHover = true; svcUpdate(); });
    area.addEventListener('mouseleave', function () { svcHover = false; svcUpdate(); });
    area.addEventListener('focusin', function () { svcHover = true; svcUpdate(); });
    area.addEventListener('focusout', function (e) {
      if (area.contains(e.relatedTarget)) return;
      svcHover = false; svcUpdate();
    });

    render(false);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        svcInView = entries[entries.length - 1].isIntersecting;
        svcUpdate();
      }, { threshold: 0.35 }).observe(section);
    } else {
      svcInView = true;
      svcUpdate();
    }
  })();

  /* ---------------- Marquees: duplica itens para o loop contínuo ---------------- */
  if (!rm) {
    document.querySelectorAll('.lane .track').forEach(function (track) {
      Array.prototype.slice.call(track.children).forEach(function (item) {
        var c = item.cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        if (c.matches('button, a')) c.setAttribute('tabindex', '-1');
        c.querySelectorAll('button, a').forEach(function (el) { el.setAttribute('tabindex', '-1'); });
        track.appendChild(c);
      });
    });
  }

  /* ---------------- Galeria "Em campo" + lightbox ---------------- */
  (function gallery() {
    var lb = document.getElementById('lightbox');
    if (!lb) return;
    var lbImg = document.getElementById('lb-img');
    var lbFig = document.getElementById('lb-fig');
    var lbCap = document.getElementById('lb-cap');
    var lbNum = document.getElementById('lb-num');
    var tracks = Array.prototype.slice.call(document.querySelectorAll('#campo .track'));
    // dados das fotos a partir dos cards originais (não duplicados)
    var items = [];
    document.querySelectorAll('#campo .gcard').forEach(function (c) {
      var i = +c.getAttribute('data-index');
      if (!items[i]) items[i] = { src: c.getAttribute('data-src'), cap: c.getAttribute('data-cap'), fig: c.getAttribute('data-fig') };
    });
    var N = items.length;
    var idx = -1, opener = null;

    function render() {
      var open = idx >= 0;
      tracks.forEach(function (t) { t.style.animationPlayState = open ? 'paused' : 'running'; });
      if (!open) { lb.hidden = true; return; }
      var it = items[idx];
      lbImg.src = it.src;
      lbImg.alt = it.cap;
      lbFig.textContent = it.fig;
      lbCap.textContent = it.cap;
      lbNum.textContent = pad2(idx + 1);
      lb.setAttribute('aria-label', it.cap);
      lb.hidden = false;
    }
    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
    }
    function open(i, from) {
      var wasOpen = idx >= 0;
      idx = i;
      opener = from;
      render();
      if (!wasOpen) {
        document.addEventListener('keydown', onKey);
        lb.querySelector('[data-lb="close"].btn').focus();
      }
    }
    function close() {
      if (idx < 0) return;
      idx = -1;
      render();
      document.removeEventListener('keydown', onKey);
      if (opener) opener.focus();
    }

    document.querySelectorAll('#campo .gcard').forEach(function (c) {
      c.addEventListener('click', function () { open(+c.getAttribute('data-index'), c); });
    });
    lb.querySelectorAll('[data-lb="close"]').forEach(function (b) { b.addEventListener('click', close); });
    lb.querySelector('[data-lb="prev"]').addEventListener('click', function () { idx = (idx + N - 1) % N; render(); });
    lb.querySelector('[data-lb="next"]').addEventListener('click', function () { idx = (idx + 1) % N; render(); });
  })();
})();

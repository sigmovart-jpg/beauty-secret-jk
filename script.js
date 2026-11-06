(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- INTRO ---------- */
  const intro = $('#intro');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    intro.classList.add('is-done');
  } else {
    window.addEventListener('load', () => {
      setTimeout(() => intro.classList.add('is-done'), 800);
    });
  }

  /* ---------- THEME ---------- */
  const themeToggle = $('#themeToggle');
  const savedTheme = localStorage.getItem('bsjk-theme');
  if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
  themeToggle.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('bsjk-theme', next);
  });

  /* ---------- CURSOR GLOW ---------- */
  const glow = $('#cursorGlow');
  if (glow && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    let gx = window.innerWidth/2, gy = window.innerHeight/2;
    let tx = gx, ty = gy;
    window.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });
    const loop = () => {
      gx += (tx - gx) * 0.12;
      gy += (ty - gy) * 0.12;
      glow.style.left = gx + 'px';
      glow.style.top = gy + 'px';
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ---------- CARD MOUSE GLOW (CSS vars) ---------- */
  $$('.glass').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', (e.clientX - r.left) + 'px');
      card.style.setProperty('--mouse-y', (e.clientY - r.top) + 'px');
    });
  });

  /* ---------- MAGNETIC BUTTONS ---------- */
  $$('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width/2;
      const y = e.clientY - r.top - r.height/2;
      btn.style.transform = `translate(${x*0.25}px, ${y*0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  /* ---------- SCROLL PROGRESS + ACTIVE NAV ---------- */
  const progress = $('#scrollProgress');
  const navLinks = $$('.nav__link');
  const sections = $$('section[id], main[id]');
  const header = $('#header');
  const updateScroll = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
    progress.style.width = (scrolled * 100) + '%';
    header.classList.toggle('is-scrolled', h.scrollTop > 40);
    // active section
    let active = '';
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom > 120) active = sec.id;
    });
    navLinks.forEach(l => {
      l.classList.toggle('is-active', l.dataset.section === active);
    });
    // parallax hero art (respect reduced motion)
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const heroArt = $('.hero__art');
      if (heroArt) heroArt.style.transform = `translateY(${h.scrollTop * 0.12}px)`;
    }
  };
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  /* ---------- REVEAL ON SCROLL ---------- */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        // thread path
        const tp = e.target.querySelector('.thread-path');
        if (tp) tp.classList.add('is-drawn');
        // reviews arc
        const arc = e.target.querySelector('.reviews__arc-fill');
        if (arc) arc.style.strokeDashoffset = '132';
      }
    });
  }, { threshold: 0.15 });
  $$('.reveal').forEach(el => revealObs.observe(el));

  // ensure reviews arc animates even if .reveal wrapper
  const reviewsSection = $('#opinie');
  if (reviewsSection) {
    const arcObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const arc = $('.reviews__arc-fill');
          if (arc) arc.style.strokeDashoffset = '132';
        }
      });
    }, { threshold: 0.3 });
    arcObs.observe(reviewsSection);
  }

  /* ---------- MOBILE MENU ---------- */
  const burger = $('#burger');
  const mobileMenu = $('#mobileMenu');
  burger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open);
  });
  $$('#mobileMenu a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('is-open')));

  /* ---------- SERVICE TABS FILTER ---------- */
  $$('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.tab').forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      const cat = tab.dataset.cat;
      $$('.bcard').forEach(card => {
        const show = cat === 'all' || card.dataset.cat === cat;
        card.classList.toggle('is-hidden', !show);
      });
    });
  });

  /* ---------- SILK SLIDER ---------- */
  const slider = $('#silkSlider');
  const range = $('#silkRange');
  const rightPane = $('#silkRight');
  const handle = $('#silkHandle');
  if (slider && range) {
    const update = (val) => {
      const pct = Number(val);
      rightPane.style.clipPath = `inset(0 0 0 ${pct}%)`;
      handle.style.left = pct + '%';
    };
    range.addEventListener('input', (e) => update(e.target.value));
    // drag via handle
    let dragging = false;
    const startDrag = (e) => { dragging = true; e.preventDefault(); };
    const onMove = (e) => {
      if (!dragging) return;
      const rect = slider.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      range.value = pct;
      update(pct);
    };
    const endDrag = () => { dragging = false; };
    handle.addEventListener('mousedown', startDrag);
    handle.addEventListener('touchstart', startDrag, { passive: false });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend', endDrag);
    update(50);
  }

  /* ---------- CONFIGURATOR ---------- */
  const cfgSteps = $$('.cfg__step');
  const resultBox = $('#cfgResult');
  let cfg = { step1: null, step2: null };

  const recommendations = {
    'color|natural': { title: 'Koloryzacja Sombre / AirTouch', time: 'Czas: 2,5–4 h', desc: 'Naturalne przejścia i głębia koloru. Efekt „słońce w włosach” bez ostrości.', service: 'Koloryzacja premium' },
    'color|glass': { title: 'Koloryzacja + keratynowe wygładzanie', time: 'Czas: 3–5 h', desc: 'Kolor i efekt tafli w jednej wizycie. Blask, gładkość, brak puszenia.', service: 'Koloryzacja + Keratyna' },
    'color|refresh': { title: 'Tonowanie i odświeżenie koloru', time: 'Czas: 1,5–2,5 h', desc: 'Szybkie odświeżenie odcienia i blasku bez radykalnej zmiany.', service: 'Tonowanie' },
    'color|relax': { title: 'Metamorfoza koloru w kameralnej atmosferze', time: 'Czas: 3–4 h', desc: 'Pełna koloryzacja z konsultacją i pielęgnacją domową.', service: 'Koloryzacja premium' },
    'smooth|natural': { title: 'Keratynowe prostowanie', time: 'Czas: 2,5–4 h', desc: 'Jedwabista gładkość i naturalny blask na długie tygodnie.', service: 'Keratyna' },
    'smooth|glass': { title: 'Keratyna — efekt tafli', time: 'Czas: 2,5–4 h', desc: 'Maksymalna gładkość i lustrzane odbicie światła. Koniec z puszeniem.', service: 'Keratyna' },
    'smooth|refresh': { title: 'Botoks na włosy', time: 'Czas: 1,5–2,5 h', desc: 'Szybka regeneracja i nawilżenie. Włosy jak nowe.', service: 'Botoks' },
    'smooth|relax': { title: 'Rytuał regeneracji i wygładzania', time: 'Czas: 2,5–4 h', desc: 'Kompleksowa odbudowa w spokojnej atmosferze.', service: 'Regeneracja' },
    'cut|natural': { title: 'Strzyżenie dopasowane do twarzy', time: 'Czas: 1–1,5 h', desc: 'Precyzyjne cięcie, naturalny ruch, łatwa stylizacja w domu.', service: 'Strzyżenie' },
    'cut|glass': { title: 'Strzyżenie + wygładzanie', time: 'Czas: 2–3 h', desc: 'Świeże cięcie i jedwabista gładkość.', service: 'Strzyżenie + Keratyna' },
    'cut|refresh': { title: 'Szybkie odświeżenie cięcia', time: 'Czas: 45–60 min', desc: 'Odświeżenie końcówek i kształtu.', service: 'Strzyżenie' },
    'cut|relax': { title: 'Strzyżenie i stylizacja', time: 'Czas: 1,5–2 h', desc: 'Cięcie, stylizacja i konsultacja pielęgnacji.', service: 'Strzyżenie' },
    'hands|natural': { title: 'Manicure hybrydowy', time: 'Czas: 1–1,5 h', desc: 'Zadbane dłonie z naturalnym, eleganckim efektem.', service: 'Manicure' },
    'hands|glass': { title: 'Manicure + stylizacja brwi', time: 'Czas: 1,5–2 h', desc: 'Kompleksowy pakiet dłonie i spojrzenie.', service: 'Manicure + Brwi' },
    'hands|refresh': { title: 'Szybki manicure', time: 'Czas: 45–60 min', desc: 'Odświeżenie dłoni w przerwie.', service: 'Manicure' },
    'hands|relax': { title: 'Pakiet relaks: dłonie + spojrzenie', time: 'Czas: 2–2,5 h', desc: 'Manicure, pedicure i stylizacja brwi/rzęs.', service: 'Pakiet' },
  };

  const cfgOpts = $$('.cfg__opt');
  cfgOpts.forEach(btn => {
    btn.addEventListener('click', () => {
      const stepEl = btn.closest('.cfg__step');
      const step = stepEl.dataset.step;
      // deselect siblings
      stepEl.querySelectorAll('.cfg__opt').forEach(b => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      if (step === '1') cfg.step1 = btn.dataset.val;
      else cfg.step2 = btn.dataset.val;
      // advance
      if (step === '1') {
        stepEl.classList.remove('is-active');
        stepEl.classList.add('is-done');
        const next = $('.cfg__step[data-step="2"]');
        next.classList.add('is-active');
      } else {
        showResult();
      }
    });
  });

  function showResult() {
    const key = cfg.step1 + '|' + cfg.step2;
    const r = recommendations[key] || { title: 'Rytuał dopasowany do Ciebie', time: 'Czas: do ustalenia', desc: 'Skontaktuj się z nami — dobierzemy idealną usługę.', service: 'Konsultacja' };
    resultBox.innerHTML = `
      <div class="cfg__rec">
        <span class="cfg__result-eyebrow">Twoja rekomendacja</span>
        <h3>${r.title}</h3>
        <div class="cfg__rec-time">${r.time} · ${r.service}</div>
        <p>${r.desc}</p>
        <a href="https://beautysecretjk.booksy.com/a/" target="_blank" rel="noopener" class="btn btn--gold">Zarezerwuj w Booksy ↗</a>
      </div>
    `;
  }

  // allow re-running: clicking step1 again
  $$('.cfg__step[data-step="1"] .cfg__opt').forEach(b => b.addEventListener('click', () => {
    const s2 = $('.cfg__step[data-step="2"]');
    s2.classList.remove('is-done');
    // reset step2 selection
    s2.querySelectorAll('.cfg__opt').forEach(x => x.classList.remove('is-selected'));
    cfg.step2 = null;
    resultBox.innerHTML = `<div class="cfg__result-empty"><span class="cfg__result-eyebrow">Twoja rekomendacja</span><h3>Wybierz odpowiedzi powyżej</h3><p>Po dwóch krokach pokażemy Ci idealny rytuał w Beauty Secret JK.</p></div>`;
  }));

  /* ---------- TIMELINE ---------- */
  $$('.timeline__tab').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.timeline__tab').forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      const t = tab.dataset.t;
      $$('.timeline__panel').forEach(p => p.classList.toggle('is-active', p.dataset.t === t));
    });
  });

  /* ---------- HOURS HIGHLIGHT TODAY ---------- */
  const today = new Date().getDay(); // 0=Sun..6=Sat
  $$('#hoursList li').forEach(li => {
    if (Number(li.dataset.day) === today) li.classList.add('is-today');
  });

  /* ---------- COPY PHONE ---------- */
  const copyBtn = $('#copyPhone');
  const toast = $('#toast');
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('is-show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('is-show'), 2600);
  }
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText('+48 502 755 887');
        showToast('Skopiowano numer: +48 502 755 887');
      } catch {
        showToast('Nie udało się skopiować — zadzwoń: 502 755 887');
      }
    });
  }

  /* ---------- MARQUEE SPEED ON SCROLL ---------- */
  const marqueeTrack = $('.marquee__track');
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const v = window.scrollY - lastScroll;
    lastScroll = window.scrollY;
    const speed = Math.min(2, 1 + Math.abs(v) * 0.02);
    if (marqueeTrack) marqueeTrack.style.animationDuration = (40 / speed) + 's';
  }, { passive: true });

})();

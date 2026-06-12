/* ============================================================
   CHAPTER 24 — script.js
   ============================================================ */
'use strict';

/* ============================================================
   ★ EASY-EDIT CONFIGURATION
   ============================================================ */
const CONFIG = {

  // Your exact birthday — used for the live age counter
  birthday: new Date('2002-06-13T00:00:00'),

  // ── 24 Facts — Dev/Student Edition (funny, no personal info needed)
  // Edit freely. Add your real ones.
  facts: [
    { text: `I can spend 30 minutes choosing the perfect song.`,           cat: 'music'   },
    { text: `I replay the same song until I get tired of it.`,             cat: 'music'   },
    { text: `I create scenarios in my head that never happen.`,            cat: 'mind'    },
    { text: `I open my phone to do one thing and forget what it was.`,     cat: 'mind'    },
    { text: `I save posts I'll probably never look at again.`,             cat: 'habit'   },
    { text: `I like window seats more than I should.`,                     cat: 'quiet'   },
    { text: `I always say "one more episode".`,                            cat: 'habit'   },
    { text: `I remember random details for years.`,                        cat: 'mind'    },
    { text: `I make playlists for moods I don't even have yet.`,           cat: 'music'   },
    { text: `I read messages and answer them in my head.`,                 cat: 'quiet'   },
    { text: `I enjoy being underestimated.`,                               cat: 'edge'    },
    { text: `I can be quiet for hours and still enjoy the company.`,       cat: 'quiet'   },
    { text: `I love discovering hidden cafés and places.`,                 cat: 'wander'  },
    { text: `I check the weather even when I'm not going out.`,            cat: 'habit'   },
    { text: `I notice when someone changes something small.`,              cat: 'mind'    },
    { text: `I have screenshots whose purpose I no longer remember.`,      cat: 'habit'   },
    { text: `I romanticize ordinary moments.`,                             cat: 'wander'  },
    { text: `I love birthdays, even when I pretend not to care.`,          cat: 'warm'    },
    { text: `I take forever to choose a profile picture.`,                 cat: 'habit'   },
    { text: `I enjoy late-night conversations.`,                           cat: 'quiet'   },
    { text: `I can disappear for days and come back like nothing happened.`, cat: 'edge'  },
    { text: `I have a soft spot for ambitious people.`,                    cat: 'warm'    },
    { text: `I still get excited about little things.`,                    cat: 'warm'    },
    { text: `24 years later, I'm still a work in progress.`,              cat: 'edge'    },
  ],
};

/* ============================================================
   LOADER
   ============================================================ */
function initLoader() {
  const loader = document.getElementById('loader');
  document.body.classList.add('loading');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');
    }, 1950);
  });
}

/* ============================================================
   NAVIGATION
   ============================================================ */
function initNav() {
  const nav    = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    nav.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      nav.classList.remove('menu-open');
    });
  });
}

/* ============================================================
   HERO CANVAS — floating gold particles
   ============================================================ */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x    = Math.random() * W;
      this.y    = init ? Math.random() * H : H + 10;
      this.size = Math.random() * 1.4 + 0.3;
      this.vx   = (Math.random() - 0.5) * 0.25;
      this.vy   = -(Math.random() * 0.35 + 0.1);
      this.o    = Math.random() * 0.5 + 0.1;
      this.od   = (Math.random() * 0.007 + 0.002) * (Math.random() < 0.5 ? 1 : -1);
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      this.o += this.od;
      if (this.o > 0.6 || this.o < 0.05) this.od *= -1;
      if (this.y < -10) this.reset(false);
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.o);
      ctx.fillStyle = '#c9a84c';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: 90 }, () => new Particle());
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    const g = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W,H)*0.7);
    g.addColorStop(0, 'rgba(20,14,0,0)');
    g.addColorStop(1, 'rgba(8,8,8,0.5)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(frame);
  }

  window.addEventListener('resize', () => { resize(); particles.forEach(p => p.reset(true)); });
  init();
  frame();
}

/* ============================================================
   LIVE AGE COUNTER
   Updates every second with your exact age in years (6 decimals),
   plus total months, days, hours, and seconds lived.
   ============================================================ */
function initLiveAge() {
  const BIRTH = CONFIG.birthday;

  const elExact   = document.getElementById('ageExact');
  const elMonths  = document.getElementById('ageMonths');
  const elDays    = document.getElementById('ageDays');
  const elHours   = document.getElementById('ageHours');
  const elSeconds = document.getElementById('ageSeconds');
  const elQuote   = document.getElementById('ageQuote');

  const quotes = [
    `Every second is a line of code the universe wrote just for you.`,
    `More uptime than any server I've ever deployed.`,
    `${new Date().getFullYear() - 2002} years of continuous runtime. Zero critical failures.`,
    `Born in debug mode. Still shipping features.`,
    `Stable release after 24 years of beta testing.`,
  ];

  // Pick one quote for this session
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  function fmt(n) {
    // Format large numbers with commas
    return Math.floor(n).toLocaleString('en-US');
  }

  function tick() {
    const now  = new Date();
    const ms   = now - BIRTH;           // total milliseconds lived
    const secs = ms / 1000;
    const mins = secs / 60;
    const hrs  = mins / 60;
    const days = hrs  / 24;
    const yrs  = days / 365.25;

    // Exact age to 6 decimal places
    if (elExact)   elExact.textContent   = yrs.toFixed(6);
    if (elMonths)  elMonths.textContent  = fmt(yrs * 12);
    if (elDays)    elDays.textContent    = fmt(days);
    if (elHours)   elHours.textContent   = fmt(hrs * (2/3)); // ~16h awake/day
    if (elSeconds) elSeconds.textContent = fmt(secs);
    if (elQuote && !elQuote.textContent)  elQuote.textContent = `"${quote}"`;
  }

  tick();
  setInterval(tick, 1000);
}

/* ============================================================
   FACTS GRID
   ============================================================ */
function initFacts() {
  const grid = document.querySelector('.facts__grid');
  if (!grid) return;

  const catMeta = {
    music:  { icon: '♪', label: 'Music'   },
    mind:   { icon: '◈', label: 'Mind'    },
    habit:  { icon: '○', label: 'Habit'   },
    quiet:  { icon: '◇', label: 'Quiet'   },
    edge:   { icon: '◆', label: 'Edge'    },
    wander: { icon: '◉', label: 'Wander'  },
    warm:   { icon: '◎', label: 'Warm'    },
  };

  CONFIG.facts.forEach((fact, i) => {
    const meta = catMeta[fact.cat] || catMeta.habit;
    const card = document.createElement('div');
    card.className = `fact-card fact-card--${fact.cat}`;
    card.style.transitionDelay = `${(i % 6) * 55}ms`;
    card.innerHTML = `
      <div class="fact-card__top">
        <span class="fact-card__icon">${meta.icon}</span>
        <span class="fact-card__num">${String(i + 1).padStart(2, '0')}</span>
      </div>
      <p class="fact-card__text">${fact.text}</p>
      <span class="fact-card__cat">${meta.label}</span>
    `;
    grid.appendChild(card);
  });
}

/* ============================================================
   GUESTBOOK FORM
   ============================================================ */
function initGuestbook() {
  const form    = document.getElementById('guestbookForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn  = form.querySelector('button[type="submit"]');
    const text = btn.querySelector('.btn__text');
    btn.disabled = true;
    text.textContent = 'Sending…';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        form.reset();
        success.textContent  = 'Thank you — your words are now part of this story.';
        text.textContent     = 'Message Sent!';
      } else {
        success.textContent  = 'Something went wrong. Please try again.';
        text.textContent     = 'Try Again';
        btn.disabled = false;
      }
    } catch {
      success.textContent = 'Connect Formspree to enable live messages!';
      text.textContent    = 'Leave Your Mark';
      btn.disabled = false;
    }
  });
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal, .fact-card');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

  els.forEach(el => obs.observe(el));
}

/* ============================================================
   BACK TO TOP
   ============================================================ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ============================================================
   FOOTER YEAR
   ============================================================ */
function initFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

/* ============================================================
   ACTIVE NAV LINK
   ============================================================ */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === `#${e.target.id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => obs.observe(s));
}

/* ============================================================
   BOOT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNav();
  initHeroCanvas();
  initLiveAge();
  initFacts();
  initGuestbook();
  initScrollReveal();
  initBackToTop();
  initFooterYear();
  initActiveNav();
});
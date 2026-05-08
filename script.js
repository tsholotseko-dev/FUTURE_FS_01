/* ═══════════════════════════════════════════════════
   TSHOLOFELO TSEKO — PORTFOLIO  |  script.js
   Handles: Matrix canvas, typed text, terminal animation,
   scroll effects, navbar, counter, contact form
════════════════════════════════════════════════════ */

/* ──────────────────────────────────────────────────
   1. MATRIX RAIN (Background Canvas)
────────────────────────────────────────────────── */
(function initMatrix() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Characters: binary + hex + cyber symbols
  const CHARS = '01アイウエオカキクケコ0123456789ABCDEF<>{}[]|/\\';
  const FONT_SIZE = 13;
  let columns = [];
  let animId;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const numCols = Math.floor(canvas.width / FONT_SIZE);
    columns = Array.from({ length: numCols }, () => Math.random() * canvas.height / FONT_SIZE * -1);
  }

  function draw() {
    ctx.fillStyle = 'rgba(6, 10, 15, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00d2ff';
    ctx.font = `${FONT_SIZE}px "Syne Mono", monospace`;

    for (let i = 0; i < columns.length; i++) {
      const char = CHARS[Math.floor(Math.random() * CHARS.length)];
      ctx.fillText(char, i * FONT_SIZE, columns[i] * FONT_SIZE);

      if (columns[i] * FONT_SIZE > canvas.height && Math.random() > 0.975) {
        columns[i] = 0;
      }
      columns[i]++;
    }

    animId = requestAnimationFrame(draw);
  }

  // Pause when tab not visible (performance)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      animId = requestAnimationFrame(draw);
    }
  });

  window.addEventListener('resize', resize);
  resize();
  draw();
})();


/* ──────────────────────────────────────────────────
   2. TYPED TEXT EFFECT (Hero Role)
────────────────────────────────────────────────── */
(function initTypedText() {
  const el = document.getElementById('role-text');
  if (!el) return;

  const phrases = [
    'Cybersecurity Analyst',
    'Full-Stack Developer',
    'Infrastructure Engineer',
    'Penetration Tester',
    'Web App Builder',
    'Security Researcher',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let isPaused    = false;

  function type() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    // Typing speed (delete faster)
    let delay = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === current.length) {
      // Pause at end before deleting
      if (!isPaused) {
        isPaused = true;
        setTimeout(() => {
          isPaused = false;
          isDeleting = true;
          type();
        }, 2000);
        return;
      }
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  // Start after a short delay so hero loads first
  setTimeout(type, 800);
})();


/* ──────────────────────────────────────────────────
   3. TERMINAL ANIMATION (Hero Visual)
────────────────────────────────────────────────── */
(function initTerminal() {
  const body = document.getElementById('terminal-body');
  if (!body) return;

  // Lines to animate one by one
  const lines = [
    { type: 'prompt', text: 'whoami', out: 'tsholofelo_tseko' },
    { type: 'prompt', text: 'cat role.txt', out: 'Cybersecurity Analyst | Web Developer' },
    { type: 'prompt', text: 'nmap -sV localhost', out: 'PORT   STATE  SERVICE\n443/tcp open  https\n80/tcp  open  http\n22/tcp  open  ssh' },
    { type: 'prompt', text: 'ping -c 1 opportunities.io', out: '1 packet transmitted, 1 received, 0% packet loss\n<span class="t-green">✓ Connection established</span>' },
    { type: 'prompt', text: 'cat skills.txt | grep -i security', out: 'Network Security, Pen Testing, SIEM, Ethical Hacking...' },
    { type: 'prompt', text: 'echo $STATUS', out: '<span class="t-green">AVAILABLE_FOR_HIRE=true</span>' },
    { type: 'prompt', text: '_', out: null },
  ];

  let lineIdx  = 0;
  let charIdx  = 0;
  let outputEl = null;

  function appendLine(html) {
    const span = document.createElement('span');
    span.className = 't-line';
    span.innerHTML = html;
    body.appendChild(span);
    // Auto-scroll
    body.scrollTop = body.scrollHeight;
  }

  function typeNext() {
    if (lineIdx >= lines.length) return;

    const line = lines[lineIdx];

    if (charIdx === 0) {
      // Create the prompt line
      outputEl = document.createElement('span');
      outputEl.className = 't-line';
      outputEl.innerHTML = '<span class="t-prompt">$ </span><span class="t-cmd"></span>';
      body.appendChild(outputEl);
    }

    const cmdSpan = outputEl.querySelector('.t-cmd');

    if (line.text && charIdx < line.text.length) {
      // Still typing command
      cmdSpan.textContent += line.text[charIdx];
      charIdx++;
      setTimeout(typeNext, 55 + Math.random() * 40);
    } else {
      // Command done — show output after a pause
      charIdx = 0;
      lineIdx++;
      if (line.out) {
        setTimeout(() => {
          // Split by newline for multi-line output
          line.out.split('\n').forEach(outLine => {
            appendLine(`<span class="t-out">${outLine}</span>`);
          });
          appendLine(''); // blank spacer
          setTimeout(typeNext, 300);
        }, 250);
      } else {
        // Last blinking cursor line — just add a blinking prompt
        setTimeout(() => {
          appendLine('<span class="t-prompt">$ </span><span class="logo-cursor">_</span>');
        }, 400);
      }
    }
  }

  // Delay start so fonts load
  setTimeout(typeNext, 1200);
})();


/* ──────────────────────────────────────────────────
   4. NAVBAR SCROLL EFFECT + ACTIVE LINK
────────────────────────────────────────────────── */
(function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const links   = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Scrolled style
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlighting
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) {
        currentId = sec.getAttribute('id');
      }
    });

    links.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === currentId);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


/* ──────────────────────────────────────────────────
   5. MOBILE MENU
────────────────────────────────────────────────── */
(function initMobileMenu() {
  const burger  = document.getElementById('nav-burger');
  const navList = document.getElementById('nav-links');
  const links   = navList.querySelectorAll('.nav-link');

  function close() {
    burger.classList.remove('open');
    navList.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', () => {
    const isOpen = navList.classList.contains('open');
    if (isOpen) {
      close();
    } else {
      burger.classList.add('open');
      navList.classList.add('open');
      burger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  });

  links.forEach(link => link.addEventListener('click', close));
})();


/* ──────────────────────────────────────────────────
   6. SCROLL REVEAL ANIMATIONS
────────────────────────────────────────────────── */
(function initScrollReveal() {
  const elements = document.querySelectorAll('[data-animate="fade-up"]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.delay || '0', 10);
          setTimeout(() => el.classList.add('in-view'), delay);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
})();


/* ──────────────────────────────────────────────────
   7. ANIMATED COUNTERS (Hero Stats)
────────────────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-count]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el    = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const dur   = 1200;
        const step  = 16;
        const steps = dur / step;
        const inc   = target / steps;
        let current = 0;

        const timer = setInterval(() => {
          current += inc;
          if (current >= target) {
            el.textContent = target + '+';
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(current) + '+';
          }
        }, step);

        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
})();


/* ──────────────────────────────────────────────────
   8. CONTACT FORM (Validation + Fake Submit)
────────────────────────────────────────────────── */
(function initContactForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  function validate(field) {
    const val = field.value.trim();
    if (!val) { field.classList.add('error'); return false; }
    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      field.classList.add('error'); return false;
    }
    field.classList.remove('error');
    return true;
  }

  // Live validation on blur
  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('blur', () => validate(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) validate(field);
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    const fields = form.querySelectorAll('input[required], textarea[required]');
    let allValid = true;
    fields.forEach(f => { if (!validate(f)) allValid = false; });
    if (!allValid) return;

    // Simulate sending
    const submitBtn  = form.querySelector('.form-submit');
    const submitText = submitBtn.querySelector('.submit-text');

    submitBtn.disabled = true;
    submitText.textContent = 'Sending...';

    setTimeout(() => {
      form.reset();
      submitBtn.disabled  = false;
      submitText.textContent = 'Send Message';
      success.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
      success.classList.add('visible');

      setTimeout(() => success.classList.remove('visible'), 6000);
    }, 1600);
  });
})();


/* ──────────────────────────────────────────────────
   9. SMOOTH SCROLL (for older browsers)
────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});


/* ──────────────────────────────────────────────────
   10. SKILL PILLS — HOVER GLOW
────────────────────────────────────────────────── */
document.querySelectorAll('.pill').forEach(pill => {
  pill.addEventListener('mouseenter', () => {
    pill.style.boxShadow = '0 0 10px rgba(0,210,255,0.2)';
  });
  pill.addEventListener('mouseleave', () => {
    pill.style.boxShadow = '';
  });
});
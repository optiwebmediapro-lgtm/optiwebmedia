/* ═══════════════════════════════════════════════════
   Optiweb Media × Formeduka — main.js
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar scroll ──────────────────────────────── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  /* ── Burger menu ────────────────────────────────── */
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobile-menu');
  burger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });

  /* ── Scroll reveal (IntersectionObserver) ────────── */
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => observer.observe(el));

  /* ── Gallery modal ──────────────────────────────── */
  const modal = document.getElementById('gallery-modal');
  const modalClose = document.getElementById('modal-close');

  document.querySelectorAll('[data-gallery]').forEach(card => {
    card.addEventListener('click', () => {
      const d = JSON.parse(card.dataset.gallery);
      document.getElementById('modal-preview-wrap').innerHTML = buildMiniMockup(d, true);
      document.getElementById('modal-preview-wrap').style.background = `linear-gradient(160deg, ${d.from}25, ${d.to}10)`;
      document.getElementById('modal-icon').style.background = `linear-gradient(135deg, ${d.from}, ${d.to})`;
      document.getElementById('modal-icon').textContent = d.sector[0];
      document.getElementById('modal-title').textContent = d.sector;
      document.getElementById('modal-tagline').textContent = d.tagline;
      document.getElementById('modal-desc').textContent = d.description;
      const tagsEl = document.getElementById('modal-tags');
      tagsEl.innerHTML = d.tags.map(t => `<span class="modal-tag" style="background:${d.from}15;border:1px solid ${d.from}30;color:${d.to}">${t}</span>`).join('');
      const cta = document.getElementById('modal-cta');
      cta.style.background = `linear-gradient(135deg, ${d.from}, ${d.to})`;
      cta.style.boxShadow = `0 8px 24px ${d.from}40`;
      modal.classList.add('open');
    });
  });

  modalClose.addEventListener('click', () => modal.classList.remove('open'));
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });

  /* ── FAQ accordion ──────────────────────────────── */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
  // Open first by default
  const firstFaq = document.querySelector('.faq-item');
  if (firstFaq) firstFaq.classList.add('open');

  /* ── Multi-step form ────────────────────────────── */
  const TOTAL_STEPS = 6;
  let currentStep = 0;

  const progressFill = document.getElementById('form-progress-fill');
  const stepLabel = document.getElementById('form-step-label');
  const stepDots = document.querySelectorAll('.step-dot-inner');
  const btnNext = document.getElementById('btn-next');
  const btnBack = document.getElementById('btn-back');
  const btnSubmit = document.getElementById('btn-submit');
  const formCard = document.getElementById('form-card');
  const formSuccess = document.getElementById('form-success');

  function updateStepUI() {
    // Progress bar
    progressFill.style.width = `${((currentStep + 1) / TOTAL_STEPS) * 100}%`;
    stepLabel.textContent = `Étape ${currentStep + 1} / ${TOTAL_STEPS}`;
    // Dots
    stepDots.forEach((dot, i) => {
      dot.classList.remove('active', 'done');
      if (i < currentStep) {
        dot.classList.add('done');
        dot.innerHTML = checkIcon();
      } else if (i === currentStep) {
        dot.classList.add('active');
        dot.innerHTML = stepIcons[i];
      } else {
        dot.innerHTML = stepIcons[i];
      }
    });
    // Show/hide steps
    document.querySelectorAll('.form-step').forEach((s, i) => {
      s.classList.toggle('active', i === currentStep);
    });
    // Back button
    btnBack.style.display = currentStep > 0 ? 'flex' : 'none';
    // Next / Submit
    if (currentStep === TOTAL_STEPS - 1) {
      btnNext.style.display = 'none';
      btnSubmit.style.display = 'flex';
    } else {
      btnNext.style.display = 'flex';
      btnSubmit.style.display = 'none';
    }
    // Radio for has-website reveal
    syncUrlReveal();
  }

  const stepIcons = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" d="M2 12h20"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>',
  ];

  function checkIcon() {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>';
  }

  // Radio options
  document.querySelectorAll('.radio-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      const name = opt.dataset.name;
      document.querySelectorAll(`.radio-opt[data-name="${name}"]`).forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      opt.querySelector('input').checked = true;
      if (name === 'hasWebsite') syncUrlReveal();
    });
  });

  function syncUrlReveal() {
    const selected = document.querySelector('.radio-opt[data-name="hasWebsite"].selected');
    const urlReveal = document.getElementById('url-reveal');
    if (urlReveal) {
      urlReveal.classList.toggle('show', selected && selected.dataset.value === 'yes');
    }
  }

  // Validation per step
  function validateStep(step) {
    let valid = true;
    const stepEl = document.querySelectorAll('.form-step')[step];

    const clearErr = (field) => {
      const err = field.nextElementSibling;
      if (err && err.classList.contains('err')) err.classList.remove('show');
      field.style.borderColor = '';
    };
    const showErr = (field, msg) => {
      let err = field.nextElementSibling;
      if (!err || !err.classList.contains('err')) {
        err = document.createElement('p');
        err.className = 'err';
        field.parentNode.insertBefore(err, field.nextSibling);
      }
      err.textContent = msg;
      err.classList.add('show');
      field.style.borderColor = 'rgba(248,113,113,0.6)';
      valid = false;
    };

    if (step === 0) {
      const firstName = stepEl.querySelector('[name="firstName"]');
      const lastName = stepEl.querySelector('[name="lastName"]');
      const phone = stepEl.querySelector('[name="phone"]');
      const email = stepEl.querySelector('[name="email"]');
      clearErr(firstName); clearErr(lastName); clearErr(phone); clearErr(email);
      if (!firstName.value || firstName.value.length < 2) showErr(firstName, 'Prénom requis (min. 2 caractères)');
      if (!lastName.value || lastName.value.length < 2) showErr(lastName, 'Nom requis (min. 2 caractères)');
      if (!phone.value || !/^(?:\+33|0)[1-9][0-9]{8}$/.test(phone.value.replace(/\s/g,''))) showErr(phone, 'Numéro de téléphone invalide');
      if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) showErr(email, 'Email invalide');
    }
    if (step === 1) {
      const company = stepEl.querySelector('[name="companyName"]');
      const industry = stepEl.querySelector('[name="industry"]');
      const employees = stepEl.querySelector('[name="employees"]');
      clearErr(company); clearErr(industry); clearErr(employees);
      if (!company.value || company.value.length < 2) showErr(company, "Nom de l'entreprise requis");
      if (!industry.value) showErr(industry, 'Veuillez sélectionner votre secteur');
      if (!employees.value) showErr(employees, 'Veuillez sélectionner le nombre de salariés');
    }
    if (step === 3) {
      const sel = document.querySelector('.radio-opt[data-name="need"].selected');
      if (!sel) {
        document.getElementById('need-err').classList.add('show');
        valid = false;
      } else {
        document.getElementById('need-err').classList.remove('show');
      }
    }
    if (step === 4) {
      const sel = document.querySelector('.radio-opt[data-name="goal"].selected');
      if (!sel) {
        document.getElementById('goal-err').classList.add('show');
        valid = false;
      } else {
        document.getElementById('goal-err').classList.remove('show');
      }
    }
    return valid;
  }

  btnNext.addEventListener('click', () => {
    if (!validateStep(currentStep)) return;
    currentStep++;
    updateStepUI();
  });
  btnBack.addEventListener('click', () => {
    currentStep--;
    updateStepUI();
  });

  // Form submit
  document.getElementById('main-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<svg class="spin" xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg> Envoi en cours…';

    const formData = {
      firstName: document.querySelector('[name="firstName"]').value,
      lastName: document.querySelector('[name="lastName"]').value,
      phone: document.querySelector('[name="phone"]').value,
      email: document.querySelector('[name="email"]').value,
      companyName: document.querySelector('[name="companyName"]').value,
      industry: document.querySelector('[name="industry"]').value,
      employees: document.querySelector('[name="employees"]').value,
      hasWebsite: document.querySelector('.radio-opt[data-name="hasWebsite"].selected')?.dataset.value || 'no',
      websiteUrl: document.querySelector('[name="websiteUrl"]')?.value || '',
      need: document.querySelector('.radio-opt[data-name="need"].selected')?.dataset.value || '',
      goal: document.querySelector('.radio-opt[data-name="goal"].selected')?.dataset.value || '',
      knowsOpco: document.querySelector('.radio-opt[data-name="knowsOpco"].selected')?.dataset.value || 'unknown',
      comment: document.querySelector('[name="comment"]')?.value || '',
    };

    try {
      // ─── Remplace l'URL par ton endpoint Formspree ou Make/Zapier ───
      const res = await fetch('https://formspree.io/f/xeewkpod', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        formCard.style.display = 'none';
        formSuccess.classList.add('show');
      } else {
        throw new Error('Erreur');
      }
    } catch {
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = '✓ Envoyer ma demande';
      alert('Une erreur est survenue. Veuillez réessayer ou nous contacter directement.');
    }
  });

  // Init form UI
  updateStepUI();

  /* ── Gallery helper ─────────────────────────────── */
  function buildMiniMockup(d, big = false) {
    const size = big ? '' : '';
    return `
      <div class="mini-browser">
        <div class="mini-bar">
          <div class="mini-dots">
            <div class="mini-dot" style="background:#ef4444;opacity:.6"></div>
            <div class="mini-dot" style="background:#eab308;opacity:.6"></div>
            <div class="mini-dot" style="background:#22c55e;opacity:.6"></div>
          </div>
          <div class="mini-url">www.${d.slug}.fr</div>
        </div>
        <div class="mini-body" style="background:linear-gradient(160deg,${d.from}18,${d.to}08)">
          <div class="mini-line-lg" style="background:linear-gradient(90deg,${d.from},${d.to})"></div>
          <div class="mini-line" style="width:55%"></div>
          <div class="mini-btns">
            <div class="mini-btn" style="background:linear-gradient(90deg,${d.from},${d.to})">En savoir +</div>
            <div class="mini-btn" style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);color:#64748b">Contact</div>
          </div>
          <div class="mini-grid">
            ${[0,1,2].map(() => `<div class="mini-card" style="background:${d.from}18;border:1px solid ${d.from}20"></div>`).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // Inject mini mockups into gallery cards
  document.querySelectorAll('[data-gallery]').forEach(card => {
    const d = JSON.parse(card.dataset.gallery);
    const wrap = card.querySelector('.gallery-preview');
    wrap.style.background = `linear-gradient(160deg,${d.from}18,${d.to}08,rgba(15,14,46,.4))`;
    wrap.innerHTML = buildMiniMockup(d);
  });

});

/* ── Spinner CSS (inline) ──────────────────────────── */
const style = document.createElement('style');
style.textContent = `.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(style);

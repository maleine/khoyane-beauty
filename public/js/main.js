// ===================================
// KHOYANE BEAUTY — JavaScript Premium V2
// ===================================

window.addEventListener('load', function () {
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = '0';
      loader.style.transform = 'scale(1.05)';
      loader.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
      setTimeout(() => { loader.style.visibility = 'hidden'; document.body.classList.add('page-loaded'); }, 700);
    }, 1400);
  }
});

document.addEventListener('DOMContentLoaded', function () {

  // ── Back to top ──
  const backBtn = document.getElementById('backToTop');
  if (backBtn) {
    window.addEventListener('scroll', () => { backBtn.style.opacity = window.scrollY > 300 ? '1' : '0'; });
    backBtn.style.opacity = '0'; backBtn.style.transition = 'opacity 0.3s';
  }

  // ── Newsletter form ──
  const form = document.getElementById('newsletterForm');
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const email = document.getElementById('newsletterEmail').value;
      const msg = document.getElementById('newsletterMsg');
      try {
        const res = await fetch('/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
        const data = await res.json();
        msg.innerHTML = `<span class="${data.success ? 'text-success' : 'text-danger'}">${data.message}</span>`;
        if (data.success) form.reset();
      } catch (err) { msg.innerHTML = '<span class="text-danger">Erreur réseau.</span>'; }
    });
  }

  // ── Navbar scroll ──
  const navbar = document.querySelector('.main-navbar');
  if (navbar) window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 50));

  // ── Reveal animations ──
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObs.unobserve(entry.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal-fade, .reveal-slide-left, .reveal-slide-right, .reveal-scale, .animate-on-scroll').forEach(el => revealObs.observe(el));

  // Cards stagger entrance
  document.querySelectorAll('.service-card, .blog-card, .product-card, .testimonial-card').forEach((el, idx) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.08}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.08}s`;
    new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } });
    }, { threshold: 0.1 }).observe(el);
  });

  // Stagger children
  document.querySelectorAll('.animate-stagger').forEach(parent => {
    Array.from(parent.children).forEach((child, i) => {
      child.style.opacity = '0'; child.style.transform = 'translateY(30px)';
      child.style.transition = `opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s, transform 0.55s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s`;
    });
    new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { Array.from(e.target.children).forEach(c => { c.style.opacity = '1'; c.style.transform = 'translateY(0)'; }); } });
    }, { threshold: 0.1 }).observe(parent);
  });

  // ── Counter animation ──
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target || el.innerText.replace(/[^\d.]/g, ''));
    const suffix = el.innerText.replace(/[\d.]/g, '');
    if (isNaN(target)) return;
    const duration = 2000; const startTime = performance.now(); el.classList.add('counting');
    function update(t) {
      const p = Math.min((t - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      el.innerText = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(update);
      else { el.innerText = target + suffix; el.classList.remove('counting'); }
    }
    requestAnimationFrame(update);
  }
  const cntObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const num = e.target.innerText.replace(/[^\d.]/g, '');
        if (num) { e.target.dataset.target = num; animateCounter(e.target); cntObs.unobserve(e.target); }
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-number').forEach(el => cntObs.observe(el));

  // ── Particules premium ──
  const particlesContainer = document.querySelector('.hero-particles');
  if (particlesContainer) {
    for (let i = 0; i < 12; i++) {
      const gem = document.createElement('div');
      gem.className = 'hero-floating-gem';
      gem.style.cssText = `left:${10+Math.random()*80}%;top:${20+Math.random()*60}%;--dur:${3+Math.random()*4}s;--delay:${Math.random()*5}s;width:${4+Math.random()*6}px;height:${4+Math.random()*6}px;`;
      particlesContainer.appendChild(gem);
    }
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'hero-particle';
      p.style.cssText = `left:${Math.random()*100}%;top:${30+Math.random()*65}%;--dur:${2+Math.random()*3}s;--delay:${Math.random()*4}s;width:${1+Math.random()*3}px;height:${1+Math.random()*3}px;opacity:${0.2+Math.random()*0.5};`;
      particlesContainer.appendChild(p);
    }
  }

  // ── Morphing shapes ──
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    const s1 = document.createElement('div'); s1.className = 'hero-morph-shape';
    s1.style.cssText = 'width:400px;height:400px;background:rgba(155,89,182,0.12);top:-10%;right:-5%;animation-duration:10s;';
    const s2 = document.createElement('div'); s2.className = 'hero-morph-shape';
    s2.style.cssText = 'width:300px;height:300px;background:rgba(233,30,140,0.08);bottom:5%;left:-5%;animation-duration:12s;animation-delay:-4s;';
    heroSection.appendChild(s1); heroSection.appendChild(s2);
  }

  // ── Hero dots ──
  const dots = document.querySelectorAll('.hero-dot');
  if (dots.length > 0) {
    let currentDot = 0;
    setInterval(() => { dots[currentDot].classList.remove('active'); currentDot = (currentDot + 1) % dots.length; dots[currentDot].classList.add('active'); }, 3500);
  }

  // ── Section titles ──
  const titleObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; titleObs.unobserve(e.target); } });
  }, { threshold: 0.2 });
  document.querySelectorAll('.section-title').forEach(el => {
    el.style.opacity = '0'; el.style.transform = 'translateY(25px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    titleObs.observe(el);
  });

  // ── Tarif rows ──
  const tarifObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateX(0)'; tarifObs.unobserve(e.target); } });
  }, { threshold: 0.2 });
  document.querySelectorAll('.tarif-row').forEach((row, i) => {
    row.style.opacity = '0'; row.style.transform = 'translateX(-20px)';
    row.style.transition = `opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.06}s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.06}s`;
    tarifObs.observe(row);
  });

  // ── About parallax ──
  const aboutImg1 = document.querySelector('.about-img-1');
  const aboutImg2 = document.querySelector('.about-img-2');
  if (aboutImg1 || aboutImg2) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (aboutImg1) aboutImg1.style.transform = `translateY(${scrollY * 0.04}px)`;
      if (aboutImg2) aboutImg2.style.transform = `translateY(${-scrollY * 0.03}px)`;
    });
  }

  // ── Toast ──
  window.showToast = function(msg, duration = 3000) {
    let toast = document.querySelector('.toast-notification');
    if (!toast) { toast = document.createElement('div'); toast.className = 'toast-notification'; document.body.appendChild(toast); }
    toast.textContent = msg; toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
  };

  // ── Ripple buttons ──
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = '@keyframes rippleClick { to { transform: scale(10); opacity: 0; } }';
  document.head.appendChild(rippleStyle);
  document.querySelectorAll('.btn').forEach(btn => {
    btn.style.position = 'relative'; btn.style.overflow = 'hidden';
    btn.addEventListener('click', function(e) {
      const rect = btn.getBoundingClientRect();
      const r = document.createElement('span');
      r.style.cssText = `position:absolute;border-radius:50%;background:rgba(255,255,255,0.3);width:20px;height:20px;left:${e.clientX-rect.left-10}px;top:${e.clientY-rect.top-10}px;animation:rippleClick 0.5s ease-out forwards;pointer-events:none;`;
      btn.appendChild(r); setTimeout(() => r.remove(), 600);
    });
  });

  // ── Prix remise glow ──
  document.querySelectorAll('.prix-remise').forEach(el => el.classList.add('service-price-glow'));

  // ── Section pre animate ──
  document.querySelectorAll('.section-pre').forEach(el => {
    el.style.opacity = '0'; el.style.transform = 'translateX(-10px)'; el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateX(0)'; } });
    }, { threshold: 0.3 }).observe(el);
  });

});

function toggleVideo() {
  const video = document.getElementById('bgVideo');
  const icon = document.getElementById('playIcon');
  if (!video) return;
  if (video.paused) { video.play(); icon.className = 'bi bi-pause-fill'; }
  else { video.pause(); icon.className = 'bi bi-play-fill'; }
}

/* Verdant Roasters — JavaScript */
// Mobile Menu
const hamburger = document.getElementById('hamburger');
const overlay = document.getElementById('mobileOverlay');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
});
overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    hamburger.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}));

// Scroll Reveal
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });
revealEls.forEach(el => observer.observe(el));

// Counter Animation
document.querySelectorAll('[data-count]').forEach(el => {
    const cObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            const target = parseInt(el.dataset.count);
            let cur = 0;
            const step = Math.max(1, Math.floor(target / 30));
            const t = setInterval(() => {
                cur += step;
                if (cur >= target) { cur = target; clearInterval(t); }
                el.textContent = cur;
            }, 40);
            cObs.unobserve(el);
        });
    }, { threshold: 0.5 });
    cObs.observe(el);
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const t = document.querySelector(a.getAttribute('href'));
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
});

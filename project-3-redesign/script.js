/* FinFlow Redesign — JavaScript */
const hamburger = document.getElementById('hamburger');
const overlay = document.getElementById('mobileOverlay');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
});
overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    hamburger.classList.remove('active'); overlay.classList.remove('active');
    document.body.style.overflow = '';
}));

const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
reveals.forEach(el => obs.observe(el));

document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const t = document.querySelector(a.getAttribute('href'));
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
});

/* ============================================
   VOID — JavaScript Engine
   ============================================ */

// ========== LOADER ==========
const loader = document.getElementById('loader');
const progress = document.getElementById('loaderProgress');
const pct = document.getElementById('loaderPct');
let loadVal = 0;
const loadInterval = setInterval(() => {
    loadVal += Math.random() * 8 + 2;
    if (loadVal >= 100) {
        loadVal = 100;
        clearInterval(loadInterval);
        setTimeout(() => loader.classList.add('hidden'), 400);
    }
    progress.style.width = loadVal + '%';
    pct.textContent = Math.floor(loadVal) + '%';
}, 80);

// ========== MOUSE TRACKING ==========
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    document.getElementById('coordX').textContent = 'X: ' + String(e.clientX).padStart(4, '0');
    document.getElementById('coordY').textContent = 'Y: ' + String(e.clientY).padStart(4, '0');
});

// ========== PARTICLE SYSTEM ==========
const pCanvas = document.getElementById('particleCanvas');
const pCtx = pCanvas.getContext('2d');
let particles = [];

function resizeParticleCanvas() {
    pCanvas.width = window.innerWidth;
    pCanvas.height = window.innerHeight;
}
resizeParticleCanvas();
window.addEventListener('resize', resizeParticleCanvas);

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * pCanvas.width;
        this.y = Math.random() * pCanvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
            this.x -= (dx / dist) * 2;
            this.y -= (dy / dist) * 2;
            this.opacity = Math.min(1, this.opacity + 0.02);
        }
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > pCanvas.width || this.y < 0 || this.y > pCanvas.height) this.reset();
    }
    draw() {
        pCtx.beginPath();
        pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        pCtx.fillStyle = `rgba(0, 255, 136, ${this.opacity})`;
        pCtx.fill();
    }
}

for (let i = 0; i < 200; i++) particles.push(new Particle());

function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                pCtx.beginPath();
                pCtx.moveTo(particles[i].x, particles[i].y);
                pCtx.lineTo(particles[j].x, particles[j].y);
                pCtx.strokeStyle = `rgba(0, 255, 136, ${0.08 * (1 - dist / 100)})`;
                pCtx.lineWidth = 0.5;
                pCtx.stroke();
            }
        }
    }
}

// ========== CURSOR TRAIL ==========
const cCanvas = document.getElementById('cursorCanvas');
const cCtx = cCanvas.getContext('2d');
let trail = [];

function resizeCursorCanvas() {
    cCanvas.width = window.innerWidth;
    cCanvas.height = window.innerHeight;
}
resizeCursorCanvas();
window.addEventListener('resize', resizeCursorCanvas);

document.addEventListener('mousemove', e => {
    for (let i = 0; i < 3; i++) {
        trail.push({
            x: e.clientX + (Math.random() - 0.5) * 8,
            y: e.clientY + (Math.random() - 0.5) * 8,
            life: 1,
            size: Math.random() * 3 + 1,
            color: Math.random() > 0.5 ? '0,255,136' : '255,0,85'
        });
    }
});

function updateTrail() {
    cCtx.clearRect(0, 0, cCanvas.width, cCanvas.height);
    trail = trail.filter(p => p.life > 0);
    trail.forEach(p => {
        p.life -= 0.025;
        p.size *= 0.98;
        p.y -= 0.3;
        cCtx.beginPath();
        cCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        cCtx.fillStyle = `rgba(${p.color}, ${p.life * 0.6})`;
        cCtx.fill();
    });
}

// ========== WARP FIELD ==========
const warpCanvas = document.getElementById('warpCanvas');
const wCtx = warpCanvas.getContext('2d');
let stars = [];

function resizeWarp() {
    warpCanvas.width = warpCanvas.offsetWidth;
    warpCanvas.height = warpCanvas.offsetHeight;
    stars = [];
    for (let i = 0; i < 400; i++) {
        stars.push({
            x: (Math.random() - 0.5) * warpCanvas.width * 2,
            y: (Math.random() - 0.5) * warpCanvas.height * 2,
            z: Math.random() * warpCanvas.width,
            pz: 0
        });
    }
}
resizeWarp();
window.addEventListener('resize', resizeWarp);

function drawWarp() {
    wCtx.fillStyle = 'rgba(0,0,0,0.15)';
    wCtx.fillRect(0, 0, warpCanvas.width, warpCanvas.height);

    const cx = warpCanvas.width / 2;
    const cy = warpCanvas.height / 2;
    const speed = 8 + ((mouseX / window.innerWidth) * 20);

    stars.forEach(s => {
        s.pz = s.z;
        s.z -= speed;
        if (s.z <= 0) {
            s.x = (Math.random() - 0.5) * warpCanvas.width * 2;
            s.y = (Math.random() - 0.5) * warpCanvas.height * 2;
            s.z = warpCanvas.width;
            s.pz = s.z;
        }
        const sx = (s.x / s.z) * cx + cx;
        const sy = (s.y / s.z) * cy + cy;
        const px = (s.x / s.pz) * cx + cx;
        const py = (s.y / s.pz) * cy + cy;
        const size = (1 - s.z / warpCanvas.width) * 3;

        wCtx.beginPath();
        wCtx.moveTo(px, py);
        wCtx.lineTo(sx, sy);
        const brightness = 1 - s.z / warpCanvas.width;
        wCtx.strokeStyle = `rgba(0, 255, 204, ${brightness})`;
        wCtx.lineWidth = size;
        wCtx.stroke();
    });
}

// ========== FPS COUNTER ==========
let frameCount = 0;
let lastFpsTime = performance.now();
const fpsEl = document.getElementById('fps');

// ========== MAIN LOOP ==========
function animate() {
    // Particles
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();

    // Cursor trail
    updateTrail();

    // Warp
    const warpRect = warpCanvas.getBoundingClientRect();
    if (warpRect.top < window.innerHeight && warpRect.bottom > 0) {
        drawWarp();
    }

    // FPS
    frameCount++;
    const now = performance.now();
    if (now - lastFpsTime >= 1000) {
        fpsEl.textContent = 'FPS: ' + frameCount;
        frameCount = 0;
        lastFpsTime = now;
    }

    requestAnimationFrame(animate);
}
animate();

// ========== SCROLL REVEAL ==========
const revealEls = document.querySelectorAll('.reveal, .split-reveal, .terminal-block');
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.2 });
revealEls.forEach(el => revealObs.observe(el));

// ========== RANDOM GLITCH FLASH ==========
setInterval(() => {
    const el = document.querySelector('.hero-title');
    if (!el) return;
    el.style.textShadow = `
        ${(Math.random()-0.5)*10}px ${(Math.random()-0.5)*5}px 0 rgba(255,0,85,0.7),
        ${(Math.random()-0.5)*10}px ${(Math.random()-0.5)*5}px 0 rgba(0,255,204,0.7)
    `;
    setTimeout(() => { el.style.textShadow = 'none'; }, 100);
}, 3000);

// ========== SCROLL PARALLAX FOR SECTION NUMS ==========
window.addEventListener('scroll', () => {
    document.querySelectorAll('.section-num').forEach(num => {
        const rect = num.parentElement.getBoundingClientRect();
        const offset = (window.innerHeight - rect.top) * 0.05;
        num.style.transform = `translateY(${offset}px)`;
    });
});


// ---- Custom Cursor ----
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animCursor() {
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animCursor);
}
animCursor();
document.querySelectorAll('a, button, .project-card, .skill-card, .stat-box').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.width = '20px'; cursor.style.height = '20px';
        ring.style.width = '56px'; ring.style.height = '56px';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.width = '12px'; cursor.style.height = '12px';
        ring.style.width = '36px'; ring.style.height = '36px';
    });
});

// ---- Nav scroll ----
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ---- Hamburger ----
const ham = document.getElementById('hamburger');
const mNav = document.getElementById('mobileNav');
ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    mNav.classList.toggle('open');
});
document.querySelectorAll('.mobile-link').forEach(l => {
    l.addEventListener('click', () => {
        ham.classList.remove('open');
        mNav.classList.remove('open');
    });
});

// ---- Scroll reveal ----
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            // Animate skill bars
            e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
                bar.style.width = bar.dataset.w + '%';
            });
        }
    });
}, { threshold: 0.12 });
reveals.forEach(r => observer.observe(r));

// Also observe skill cards that aren't wrapped in reveal
document.querySelectorAll('.skill-card').forEach(card => {
    const ioC = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.querySelectorAll('.skill-bar-fill').forEach(b => b.style.width = b.dataset.w + '%');
            }
        });
    }, { threshold: 0.2 });
    ioC.observe(card);
});

// ---- Project filter ----
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('.project-card').forEach(card => {
            if (filter === 'all' || card.dataset.cat === filter) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// ---- Contact form ----
document.getElementById('formBtn').addEventListener('click', () => {
    const name = document.getElementById('fname').value.trim();
    const email = document.getElementById('femail').value.trim();
    const msg = document.getElementById('fmsg').value.trim();
    if (!name || !email || !msg) { alert('Please fill in all fields.'); return; }
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    document.getElementById('fname').value = '';
    document.getElementById('femail').value = '';
    document.getElementById('fmsg').value = '';
    setTimeout(() => toast.classList.remove('show'), 3500);
});

// ---- Smooth active nav highlight ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 200) current = s.id;
    });
    navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + current ? 'var(--accent)' : '';
    });
});

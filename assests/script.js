
// ---- Theme toggle (dark/light) ----
const THEME_KEY = 'portfolio-theme';
const htmlEl = document.documentElement;

function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
}

function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) {
        applyTheme(saved);
    } else {
        const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        applyTheme(prefersLight ? 'light' : 'dark');
    }
}

function toggleTheme() {
    const current = htmlEl.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    applyTheme(current === 'light' ? 'dark' : 'light');
}

initTheme();
document.getElementById('themeToggle').addEventListener('click', toggleTheme);
document.getElementById('themeToggleMobile').addEventListener('click', toggleTheme);

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
document.querySelectorAll('a, button, .project-card, .stat-box, .cert-card, .cert-preview-btn, .theme-toggle').forEach(el => {
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
// Uses Formspree (https://formspree.io) so the form works from a static
// site with no backend of your own. Sign up for a free account, create a
// form, and replace FORM_ID below with the ID from your Formspree dashboard.
// const FORMSPREE_ENDPOINT = 'https://formspree.io/f/FORM_ID';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mkodrryy';

const contactForm = document.getElementById('contactForm');
const formBtn = document.getElementById('formBtn');
const toast = document.getElementById('toast');

function showToast(message, isError = false) {
    toast.textContent = message;
    toast.classList.toggle('toast-error', isError);
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
}

function setFieldError(fieldId, message) {
    const errorEl = document.getElementById(fieldId + 'Error');
    const inputEl = document.getElementById(fieldId);
    if (errorEl) errorEl.textContent = message;
    if (inputEl) inputEl.classList.toggle('input-invalid', !!message);
}

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateForm(name, email, message) {
    let valid = true;
    setFieldError('fname', '');
    setFieldError('femail', '');
    setFieldError('fmsg', '');

    if (!name) { setFieldError('fname', 'Please enter your name.'); valid = false; }
    if (!email) { setFieldError('femail', 'Please enter your email.'); valid = false; }
    else if (!isValidEmail(email)) { setFieldError('femail', 'Please enter a valid email address.'); valid = false; }
    if (!message) { setFieldError('fmsg', 'Please enter a message.'); valid = false; }

    return valid;
}

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('fname');
    const emailInput = document.getElementById('femail');
    const msgInput = document.getElementById('fmsg');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = msgInput.value.trim();

    if (!validateForm(name, email, message)) return;

    formBtn.disabled = true;
    const originalLabel = formBtn.querySelector('.btn-label').textContent;
    formBtn.querySelector('.btn-label').textContent = 'Sending…';

    try {
        const response = await fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message })
        });

        if (response.ok) {
            showToast("✓ Message sent! I'll reply within 24h.");
            contactForm.reset();
        } else {
            const data = await response.json().catch(() => null);
            const errorMsg = data && data.errors
                ? data.errors.map(er => er.message).join(', ')
                : 'Something went wrong. Please try again or email me directly.';
            showToast(errorMsg, true);
        }
    } catch (err) {
        showToast('Network error — please check your connection and try again.', true);
    } finally {
        formBtn.disabled = false;
        formBtn.querySelector('.btn-label').textContent = originalLabel;
    }
});

// ---- Certificate preview modal ----
const certModal = document.getElementById('certModal');
const certModalImg = document.getElementById('certModalImg');
const certModalCaption = document.getElementById('certModalCaption');
const certModalClose = document.getElementById('certModalClose');
const certModalBackdrop = document.getElementById('certModalBackdrop');

function openCertModal(imgSrc, title) {
    certModalImg.src = imgSrc;
    certModalImg.alt = title;
    certModalCaption.textContent = title;
    certModal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCertModal() {
    certModal.classList.remove('open');
    document.body.style.overflow = '';
    certModalImg.src = '';
}

document.querySelectorAll('.cert-preview-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        openCertModal(btn.dataset.certImg, btn.dataset.certTitle);
    });
});

certModalClose.addEventListener('click', closeCertModal);
certModalBackdrop.addEventListener('click', closeCertModal);
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && certModal.classList.contains('open')) closeCertModal();
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

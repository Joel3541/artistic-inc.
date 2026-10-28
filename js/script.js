// DOM Elements
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const contactForm = document.getElementById('contactForm');
const filterBtns = document.querySelectorAll('.filter-btn');
const currentYearSpan = document.getElementById('currentYear');

// Set current year in footer
if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
}

// Navbar scroll effect
function handleNavbarScroll() {
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    if (mobileMenu && mobileMenuBtn) {
        mobileMenu.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    }
}

// Smooth scroll to section (Accounts for fixed navbar height)
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        // Calculate navbar height to offset the scroll (so title isn't hidden under nav)
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - navbarHeight;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });

        // Close mobile menu if open
        if (mobileMenu) mobileMenu.classList.remove('active');
        if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
    }
}

// Portfolio filter functionality
function filterPortfolio(filterValue) {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        const category = item.getAttribute('data-category');
        
        if (filterValue === 'all' || category === filterValue) {
            item.classList.remove('hidden');
            item.classList.add('visible');
            item.style.display = 'block'; // Ensure it takes up layout space
        } else {
            item.classList.remove('visible');
            item.classList.add('hidden');
            // Wait for CSS transition to finish before removing from layout
            setTimeout(() => {
                if (item.classList.contains('hidden')) {
                    item.style.display = 'none';
                }
            }, 300);
        }
    });
}

// Handle filter button clicks
function handleFilterClick(e) {
    const filterValue = e.target.getAttribute('data-filter');
    
    // Update active button styling
    filterBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Filter portfolio items
    filterPortfolio(filterValue);
}

// ============================================================
// Contact form delivery
// ------------------------------------------------------------
// Paste your Formspree endpoint below to receive submissions by
// email. Get one free at https://formspree.io (New Form -> copy
// the URL). Until it is filled in, the form falls back to opening
// the visitor's email app with the message pre-filled, so an
// enquiry is never silently lost.
// ============================================================
const FORM_ENDPOINT = 'https://formspree.io/f/xbgddzry';
const CONTACT_EMAIL = 'joeljacksonduker@gmail.com';
const CONTACT_WHATSAPP = '233264842982';

// Show a status message under the form instead of a browser alert
function setFormStatus(message, state) {
    let box = document.getElementById('formStatus');
    if (!box) {
        box = document.createElement('p');
        box.id = 'formStatus';
        box.setAttribute('role', 'status');
        box.setAttribute('aria-live', 'polite');
        box.style.marginTop = '1rem';
        box.style.fontSize = '0.95rem';
        box.style.lineHeight = '1.5';
        contactForm.appendChild(box);
    }
    box.innerHTML = message;
    box.style.color = state === 'error' ? '#f87171'
                    : state === 'success' ? '#4ade80'
                    : 'inherit';
}

// Last-resort delivery: hand the message to the visitor's email app
function fallbackToMailto(data) {
    const body =
        'Name: ' + data.name + '\n' +
        'Email: ' + data.email + '\n\n' +
        data.message;
    const href = 'mailto:' + CONTACT_EMAIL +
        '?subject=' + encodeURIComponent(data.subject) +
        '&body=' + encodeURIComponent(body);
    window.location.href = href;
    setFormStatus(
        'Opening your email app to send this message. ' +
        'If nothing happens, reach me directly on ' +
        '<a href="https://wa.me/' + CONTACT_WHATSAPP + '" target="_blank" rel="noopener">WhatsApp</a> or at ' +
        '<a href="mailto:' + CONTACT_EMAIL + '">' + CONTACT_EMAIL + '</a>.',
        'info'
    );
}

// Handle contact form submission
async function handleContactFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };

    // No endpoint configured yet - don't pretend the message was sent
    if (!FORM_ENDPOINT) {
        fallbackToMailto(data);
        return;
    }

    // Make the notification email scannable in the inbox
    formData.set('_subject', 'Artistic Inc. enquiry: ' + data.subject);

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalLabel = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
    }
    setFormStatus('Sending your message...', 'info');

    try {
        const response = await fetch(FORM_ENDPOINT, {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: formData
        });

        if (!response.ok) throw new Error('Request failed: ' + response.status);

        setFormStatus(
            'Thanks ' + data.name + ' - your message is on its way. ' +
            'I reply within 24 hours; for anything urgent, ping me on ' +
            '<a href="https://wa.me/' + CONTACT_WHATSAPP + '" target="_blank" rel="noopener">WhatsApp</a>.',
            'success'
        );
        contactForm.reset();
    } catch (err) {
        console.error('Contact form submission failed:', err);
        setFormStatus(
            'That did not go through. Please email ' +
            '<a href="mailto:' + CONTACT_EMAIL + '">' + CONTACT_EMAIL + '</a> or message me on ' +
            '<a href="https://wa.me/' + CONTACT_WHATSAPP + '" target="_blank" rel="noopener">WhatsApp</a>.',
            'error'
        );
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalLabel;
        }
    }
}

// Handle navigation link clicks
function handleNavLinkClick(e) {
    const href = e.currentTarget.getAttribute('href');
    // Only hijack same-page anchors; let real links (service pages) navigate
    if (href && href.startsWith('#')) {
        e.preventDefault();
        scrollToSection(href.substring(1));
    }
}

// Modern Scroll Animation using Intersection Observer (Better performance)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 // Triggers when 15% of the item is visible
};

const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target); // Stop observing once animated
        }
    });
}, observerOptions);

// Initialize animations
function initAnimations() {
    const animatedElements = document.querySelectorAll('.portfolio-item, .service-card, .contact-card, .skill-card, .review-card');
    
    animatedElements.forEach((element) => {
        // Set initial hidden state
        element.style.opacity = '0';
        element.style.transform = 'translateY(40px)';
        element.style.transition = 'all 0.6s ease-out';
        
        // Observe element
        scrollObserver.observe(element);
    });
}

// --- EVENT LISTENERS ---

// Scroll events
window.addEventListener('scroll', handleNavbarScroll);

// Mobile Menu events
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
}

// Navigation links setup
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', handleNavLinkClick);
});

// Portfolio Filter setup
filterBtns.forEach(btn => {
    btn.addEventListener('click', handleFilterClick);
});

// Contact Form setup
if (contactForm) {
    contactForm.addEventListener('submit', handleContactFormSubmit);
}

// Service buttons setup
document.querySelectorAll('.service-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        scrollToSection('contact');
    });
});

// Handle window resize (fixes mobile menu staying open if screen is rotated/expanded)
window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    }
});

// Initialize everything on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    // Initial check for navbar
    handleNavbarScroll();
    
    // Setup animations
    initAnimations();
    
    // Ensure all portfolio items show properly on load
    filterPortfolio('all');
});

// Expose scrollToSection function globally for inline onclick HTML attributes
window.scrollToSection = scrollToSection;


// --- NEW BACK TO TOP LOGIC ---
const backToTopBtn = document.getElementById('backToTopBtn');

if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Make sure the new timeline cards are animated!
function initAnimations() {
    // I added .timeline-item to this list so they fade in as you scroll!
    const animatedElements = document.querySelectorAll('.portfolio-item, .service-card, .contact-card, .skill-card, .review-card, .timeline-item');
    
    animatedElements.forEach((element) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(40px)';
        element.style.transition = 'all 0.6s ease-out';
        scrollObserver.observe(element);
    });
}


// ============================================================
// Telegram button
// ------------------------------------------------------------
// Telegram has no equivalent of wa.me's ?text= for a direct message
// to a person: ?text= only works for the share dialog (which makes the
// visitor pick a recipient) and for bots. So the opening line is copied
// to the clipboard on click and the chat opens ready to paste.
// If the clipboard is unavailable the link still opens the chat, which
// is the behaviour a plain Telegram link would have given anyway.
// ============================================================
(function () {
    // script.js is loaded before the floating buttons in the markup, so wait
    // for the DOM rather than querying for an element that does not exist yet.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTelegramFab);
    } else {
        initTelegramFab();
    }

    function initTelegramFab() {
    var fab = document.querySelector('.telegram-fab');
    if (!fab) return;

    var message = fab.getAttribute('data-prefill') || '';
    var toast;

    function showToast(text) {
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'fab-toast';
            toast.setAttribute('role', 'status');
            toast.setAttribute('aria-live', 'polite');
            document.body.appendChild(toast);
        }
        toast.textContent = text;
        // next frame, so the transition runs from the hidden state
        requestAnimationFrame(function () { toast.classList.add('is-visible'); });
        clearTimeout(showToast._t);
        showToast._t = setTimeout(function () {
            toast.classList.remove('is-visible');
        }, 5000);
    }

    function copyLegacy(text) {
        try {
            var ta = document.createElement('textarea');
            ta.value = text;
            ta.setAttribute('readonly', '');
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            var ok = document.execCommand('copy');
            document.body.removeChild(ta);
            return ok;
        } catch (e) {
            return false;
        }
    }

    fab.addEventListener('click', function () {
        // Never block the link: the chat opens whether or not the copy works.
        if (!message) return;

        var copied = function () {
            showToast('Your opening message is copied — just paste it into the chat.');
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(message).then(copied)['catch'](function () {
                if (copyLegacy(message)) copied();
            });
        } else if (copyLegacy(message)) {
            copied();
        }
    });
    }
})();


// ============================================================
// Project detail view
// ------------------------------------------------------------
// The "View Details" buttons previously did nothing at all. This
// builds a detail panel from whatever is already in the clicked
// .portfolio-item, so adding a project to the grid is enough --
// no JS changes needed for new work.
// ============================================================
(function () {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProjectViewer);
    } else {
        initProjectViewer();
    }

    function initProjectViewer() {
        var grid = document.getElementById('portfolioGrid');
        if (!grid) return;

        var WA = '233264842982';
        var overlay, panel, figure, body, counter, lastFocused;
        var items = [];      // the set currently navigable (respects the active filter)
        var index = 0;

        function visibleItems() {
            return Array.prototype.filter.call(
                grid.querySelectorAll('.portfolio-item'),
                function (el) { return el.offsetParent !== null; }
            );
        }

        function build() {
            overlay = document.createElement('div');
            overlay.className = 'pv-overlay';
            overlay.setAttribute('role', 'dialog');
            overlay.setAttribute('aria-modal', 'true');
            overlay.setAttribute('aria-label', 'Project details');
            overlay.innerHTML =
                '<div class="pv-panel">' +
                  '<figure class="pv-figure"><img alt=""></figure>' +
                  '<div class="pv-body"></div>' +
                  '<button class="pv-close" type="button" aria-label="Close">&times;</button>' +
                  '<button class="pv-nav pv-prev" type="button" aria-label="Previous project">&#8249;</button>' +
                  '<button class="pv-nav pv-next" type="button" aria-label="Next project">&#8250;</button>' +
                  '<span class="pv-counter"></span>' +
                '</div>';
            document.body.appendChild(overlay);

            panel   = overlay.querySelector('.pv-panel');
            figure  = overlay.querySelector('.pv-figure img');
            body    = overlay.querySelector('.pv-body');
            counter = overlay.querySelector('.pv-counter');

            overlay.querySelector('.pv-close').addEventListener('click', close);
            overlay.querySelector('.pv-prev').addEventListener('click', function () { step(-1); });
            overlay.querySelector('.pv-next').addEventListener('click', function () { step(1); });
            overlay.addEventListener('click', function (e) {
                if (e.target === overlay) close();
            });
        }

        function render() {
            var item = items[index];
            if (!item) return;

            var img   = item.querySelector('.portfolio-image img');
            var title = item.querySelector('.portfolio-title');
            var desc  = item.querySelector('.portfolio-description');
            var badge = item.querySelector('.portfolio-badge');
            var tags  = item.querySelectorAll('.skill-tag');

            figure.src = img ? img.getAttribute('src') : '';
            figure.alt = img ? (img.getAttribute('alt') || '') : '';

            var titleText = title ? title.textContent.trim() : 'Project';
            var parts = [];

            if (badge) {
                parts.push('<span class="pv-badge">' + badge.textContent.trim() + '</span>');
            }
            parts.push('<h3 class="pv-title">' + titleText + '</h3>');
            if (desc && desc.textContent.trim()) {
                parts.push('<p class="pv-desc">' + desc.textContent.trim() + '</p>');
            }
            if (tags.length) {
                parts.push('<p class="pv-meta-label">Made with</p>');
                var t = '<div class="pv-tags">';
                Array.prototype.forEach.call(tags, function (tag) {
                    t += '<span class="pv-tag">' + tag.textContent.trim() + '</span>';
                });
                parts.push(t + '</div>');
            }

            var msg = 'Hi Joel, I saw "' + titleText +
                      '" on your portfolio and I’d like to discuss something similar.';
            parts.push(
                '<div class="pv-cta">' +
                  '<a class="pv-wa" href="https://wa.me/' + WA + '?text=' + encodeURIComponent(msg) + '"' +
                     ' target="_blank" rel="noopener">' +
                    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
                      '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.15-.174.2-.298.3-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.896 9.83 9.83 0 0 1 2.893 6.994c-.003 5.45-4.437 9.886-9.885 9.886m8.413-18.297A11.82 11.82 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.82 11.82 0 0 0 20.465 3.49"/>' +
                    '</svg>Discuss a project like this</a>' +
                  '<a class="pv-alt" href="#contact">Other ways to reach me</a>' +
                '</div>'
            );

            body.innerHTML = parts.join('');
            body.querySelector('.pv-alt').addEventListener('click', close);

            counter.textContent = (index + 1) + ' / ' + items.length;
            var multiple = items.length > 1;
            overlay.querySelector('.pv-prev').hidden = !multiple;
            overlay.querySelector('.pv-next').hidden = !multiple;
            counter.hidden = !multiple;
        }

        function step(dir) {
            if (!items.length) return;
            index = (index + dir + items.length) % items.length;
            render();
        }

        function open(item, trigger) {
            if (!overlay) build();
            items = visibleItems();
            index = items.indexOf(item);
            if (index < 0) { items = [item]; index = 0; }

            lastFocused = trigger || document.activeElement;
            render();
            overlay.classList.add('is-open');
            document.body.classList.add('pv-locked');
            // the overlay is visibility:hidden until the class lands, and a
            // hidden element cannot take focus -- so move focus next frame
            // setTimeout rather than rAF: rAF is paused on a hidden tab
            setTimeout(function () {
                overlay.querySelector('.pv-close').focus();
            }, 0);
        }

        function close() {
            if (!overlay) return;
            overlay.classList.remove('is-open');
            document.body.classList.remove('pv-locked');
            if (lastFocused && lastFocused.focus) lastFocused.focus();
        }

        // Delegated, so projects added to the grid later are picked up too
        grid.addEventListener('click', function (e) {
            // The 'View Details' button only appears on hover, which leaves
            // touch users with no way in -- so the whole card opens it.
            var item = e.target.closest('.portfolio-item');
            if (!item) return;
            e.preventDefault();
            open(item, e.target.closest('.portfolio-btn') || item);
        });

        document.addEventListener('keydown', function (e) {
            if (!overlay || !overlay.classList.contains('is-open')) return;
            if (e.key === 'Escape') { close(); return; }
            if (e.key === 'ArrowLeft') { step(-1); return; }
            if (e.key === 'ArrowRight') { step(1); return; }
            if (e.key === 'Tab') {
                // keep focus inside the dialog
                var f = panel.querySelectorAll('button:not([hidden]), a[href]');
                if (!f.length) return;
                var first = f[0], last = f[f.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault(); last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault(); first.focus();
                }
            }
        });
    }
})();

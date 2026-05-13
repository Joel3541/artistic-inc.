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

// Handle contact form submission
function handleContactFormSubmit(e) {
    e.preventDefault();
    
    // Grab form data
    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    // Here you would normally send the data to a server (e.g., via fetch/AJAX)
    console.log('Form submitted:', data);
    
    // Show success message and reset form
    alert("Thank you for your message! I'll get back to you soon.");
    contactForm.reset();
}

// Handle navigation link clicks
function handleNavLinkClick(e) {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (href && href.startsWith('#')) {
        const sectionId = href.substring(1);
        scrollToSection(sectionId);
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

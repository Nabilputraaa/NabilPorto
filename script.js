// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const backToTop = document.getElementById('back-to-top');
const navbar = document.getElementById('navbar');
const contactForm = document.getElementById('contact-form');

// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.bindEvents();
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    bindEvents() {
        themeToggle.addEventListener('click', () => this.toggleTheme());
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.handleScroll();
    }

    bindEvents() {
        // Mobile menu toggle
        navToggle.addEventListener('click', () => this.toggleMobileMenu());

        // Close mobile menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.smoothScroll(e));
        });

        // Handle scroll events
        window.addEventListener('scroll', () => this.handleScroll());
    }

    toggleMobileMenu() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    }

    closeMobileMenu() {
        navMenu


.classList.remove('active');
        navToggle.classList.remove('active');
    }

    smoothScroll(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    handleScroll() {
        const scrollY = window.scrollY;
        
        // Navbar background on scroll
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button
        if (scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }

        // Active navigation link
        this.updateActiveNavLink();
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
}

// Animation Manager
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.animateCounters();
        this.animateProgressBars();
        this.setupTypingEffect();
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe all sections
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });

        // Observe skill items
        document.querySelectorAll('.skill-item').forEach(item => {
            observer.observe(item);
        });

        // Observe project cards
        document.querySelectorAll('.project-card').forEach(card => {
            observer.observe(card);
        });
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const observerOptions = {
            threshold: 0.5
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        const observerOptions = {
            threshold: 0.5
        };

        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const width = progressBar.getAttribute('data-width');
                    setTimeout(() => {
                        progressBar.style.width = width + '%';
                    }, 200);
                    progressObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        progressBars.forEach(bar => {
            progressObserver.observe(bar);
        });
    }

    setupTypingEffect() {
        const typedElement = document.getElementById('typed-name');
        if (typedElement) {
            const text = typedElement.textContent;
            typedElement.textContent = '';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    typedElement.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                }
            };
            
            setTimeout(typeWriter, 1000);
        }
    }
}

// Project Filter Manager
class ProjectFilterManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => this.filterProjects(e));
        });
    }

    filterProjects(e) {
        const filterValue = e.target.getAttribute('data-filter');
        const projectCards = document.querySelectorAll('.project-card');
        const filterButtons = document.querySelectorAll('.filter-btn');

        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        // Filter projects
        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filterValue === 'all' || category === filterValue) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
}

// Form Manager
class FormManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Floating label effect
        const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
        formInputs.forEach(input => {
            input.addEventListener('focus', () => this.handleInputFocus(input));
            input.addEventListener('blur', () => this.handleInputBlur(input));
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        if (this.validateForm(data)) {
            this.showMessage('Terima kasih! Pesan Anda telah terkirim.', 'success');
            contactForm.reset();
        } else {
            this.showMessage('Mohon lengkapi semua field yang diperlukan.', 'error');
        }
    }

    validateForm(data) {
        return data.name && data.email && data.subject && data.message;
    }

    handleInputFocus(input) {
        input.parentElement.classList.add('focused');
    }

    handleInputBlur(input) {
        if (!input.value) {
            input.parentElement.classList.remove('focused');
        }
    }

    showMessage(message, type) {
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `form-message ${type}`;
        messageEl.textContent = message;
        
        // Style the message
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            ${type === 'success' ? 'background: #10b981;' : 'background: #ef4444;'}
        `;
        
        document.body.appendChild(messageEl);
        
        // Animate in
        setTimeout(() => {
            messageEl.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            messageEl.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(messageEl);
            }, 300);
        }, 3000);
    }
}

// Utility Functions
class Utils {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    new ThemeManager();
    new NavigationManager();
    new AnimationManager();
    new ProjectFilterManager();
    new FormManager();

    // Back to top button functionality
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Add loading animation
    document.body.classList.add('loaded');

    // Preload images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.dataset.src) {
            img.src = img.dataset.src;
        }
    });

    // Add parallax effect to hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', Utils.throttle(() => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            hero.style.transform = `translateY(${parallax}px)`;
        }, 10));
    }

    // Add mouse cursor effect
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: var(--primary-color);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
        mix-blend-mode: difference;
    `;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
        cursor.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });

    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-item');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
        });
    });
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.title = '👋 Come back! - Nabil Putra Aditya';
    } else {
        document.title = 'Nabil Putra Aditya - Web Developer & UI/UX Designer';
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    .loaded {
        animation: fadeIn 0.5s ease-in;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .animate-in {
        animation: slideInUp 0.6s ease-out;
    }

    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .navbar.scrolled {
        background: rgba(255, 255, 255, 0.98) !important;
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }

    [data-theme="dark"] .navbar.scrolled {
        background: rgba(15, 23, 42, 0.98) !important;
    }

    .form-group.focused label {
        top: -10px !important;
        left: 10px !important;
        font-size: 0.8rem !important;
        color: var(--primary-color) !important;
        background: var(--surface-color) !important;
        padding: 0 5px !important;
    }

    .custom-cursor {
        transition: transform 0.2s ease !important;
    }

    @media (max-width: 768px) {
        .custom-cursor {
            display: none;
        }
    }
`;
document.head.appendChild(style);


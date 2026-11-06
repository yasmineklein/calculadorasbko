// Theme Manager (Modo Claro/Escuro Avançado)
class ThemeManager {
    constructor() {
        this.dropdown = document.querySelector('.theme-dropdown');
        this.btn = document.getElementById('themeDropdownBtn');
        this.options = document.querySelectorAll('.theme-option');
        this.body = document.body;
        this.init();
    }

    init() {
        if (!this.dropdown) return;

        
        const savedTheme = localStorage.getItem('theme') || 'auto';
        this.applyTheme(savedTheme);

        this.btn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            this.dropdown.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!this.dropdown.contains(e.target)) {
                this.dropdown.classList.remove('active');
            }
        });

        this.options.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.getAttribute('data-theme');
                this.applyTheme(theme);
                this.dropdown.classList.remove('active');
            });
        });

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (localStorage.getItem('theme') === 'auto') {
                this.applyTheme('auto');
            }
        });
    }

    applyTheme(theme) {

        localStorage.setItem('theme', theme);

        this.options.forEach(opt => {
            if (opt.getAttribute('data-theme') === theme) {
                opt.classList.add('selected');
            } else {
                opt.classList.remove('selected');
            }
        });

        let isDark = true;
        
        if (theme === 'light') {
            isDark = false;
        } else if (theme === 'dark') {
            isDark = true;
        } else if (theme === 'auto') {

            isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        }

        if (isDark) {
            this.body.classList.remove('light-mode');
        } else {
            this.body.classList.add('light-mode');
        }
    }
}

class Navigation {
    constructor() {
        this.nav = document.querySelector('.nav');
        this.navToggle = document.querySelector('.nav-toggle');
        this.navLinks = document.querySelector('.nav-links');
        
        this.init();
    }

    init() {
        this.setupScrollEffect();
        this.setupSmoothScrolling();
        this.setupMobileMenu();
        this.setupActiveNavLinks();
    }

    setupScrollEffect() {
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                this.nav.style.background = 'rgba(0, 26, 51, 0.98)';
                this.nav.style.backdropFilter = 'blur(20px)';
            } else {
                this.nav.style.background = 'transparent';
                this.nav.style.backdropFilter = 'blur(10px)';
            }
            
            if (window.innerWidth <= 768) {
                if (currentScroll > lastScroll && currentScroll > 100) {
                    this.nav.style.transform = 'translateY(-100%)';
                } else {
                    this.nav.style.transform = 'translateY(0)';
                }
            }
            
            lastScroll = currentScroll;
        });
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    this.closeMobileMenu();
                }
            });
        });
    }

    setupMobileMenu() {
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
        
        document.addEventListener('click', (e) => {
            if (!this.nav.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        this.navLinks.classList.toggle('active');
        this.navToggle.classList.toggle('active');
        document.body.classList.toggle('nav-open');
    }

    closeMobileMenu() {
        this.navLinks.classList.remove('active');
        this.navToggle.classList.remove('active');
        document.body.classList.remove('nav-open');
    }

    setupActiveNavLinks() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        
        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    
                    navLinks.forEach(link => link.classList.remove('active'));
                    
                    const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, observerOptions);
        
        sections.forEach(section => {
            observer.observe(section);
        });
    }
}

class AnimationOnScroll {
    constructor() {
        this.observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };
        
        this.init();
    }

    init() {
        this.observer = new IntersectionObserver(this.handleIntersection.bind(this), this.observerOptions);
        this.observeElements();
    }

    observeElements() {
        const elements = document.querySelectorAll('.card, .section-title');
        
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            this.observer.observe(el);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                this.observer.unobserve(entry.target);
            }
        });
    }
}

class ParallaxEffect {
    constructor() {
        this.elements = document.querySelectorAll('.hero-image, .profile-img');
        this.init();
    }

    init() {
        if (window.innerWidth > 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            window.addEventListener('scroll', this.handleScroll.bind(this));
        }
    }

    handleScroll() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;
        
        this.elements.forEach(element => {
            element.style.transform = `translateY(${rate}px)`;
        });
    }
}

class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.preloadCriticalResources();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    preloadCriticalResources() {

        const profileImg = new Image();
        profileImg.src = 'octopus.png'; 
    }
}

let navInstance;

document.addEventListener('DOMContentLoaded', () => {

    setTimeout(() => {
        const titleElement = document.querySelector('#typed-title');
        const subtitleElement = document.querySelector('#typed-subtitle');

        if (titleElement) {
            titleElement.textContent = '';
            
            new Typed('#typed-title', {
                strings: ['BackOffice', 'BKO'],
                typeSpeed: 100,
                startDelay: 800,
                backSpeed: 70,
                backDelay: 3000,
                loop: true,
                showCursor: false,
                fadeOut: false,
                preStringTyped: function() {
                    titleElement.style.minHeight = '1.2em';
                }
            });
        }

        if (subtitleElement) {
            setTimeout(() => {
                new Typed('#typed-subtitle', {
                    strings: [
                        'Automação', 
                        'Calculadoras'
                    ],
                    typeSpeed: 60,
                    backSpeed: 40,
                    backDelay: 2000,
                    startDelay: 500,
                    loop: true,
                    showCursor: false,
                    fadeOut: false,
                    contentType: 'html',
                    smartBackspace: false
                });
            }, 2500); 
        }
    }, 100);

    navInstance = new Navigation();
    new AnimationOnScroll();
    new ParallaxEffect();
    new PerformanceOptimizer();
    
    new ThemeManager();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        navInstance?.closeMobileMenu();
    }
    
    if (e.altKey) {
        const sections = ['home', 'menu'];
        const currentSection = document.querySelector('.nav-links a.active')?.getAttribute('href')?.substring(1) || 'home';
        const currentIndex = sections.indexOf(currentSection);
        
        if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
            document.querySelector(`#${sections[currentIndex + 1]}`).scrollIntoView({ behavior: 'smooth' });
        } else if (e.key === 'ArrowUp' && currentIndex > 0) {
            document.querySelector(`#${sections[currentIndex - 1]}`).scrollIntoView({ behavior: 'smooth' });
        }
    }
});

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    document.body.style.opacity = '1';
    
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }
});

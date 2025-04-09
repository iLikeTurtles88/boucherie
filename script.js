/**
 * Boucherie Dubois - Script Principal (Style 3 - Moderne/Épuré V2)
 * Gère les interactions : menu mobile, scroll, animations, formulaire, accordéon produits...
 */
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // --- Sélection des éléments DOM ---
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTopButton = document.getElementById('back-to-top');
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const yearSpan = document.getElementById('current-year');
    const allSections = document.querySelectorAll('main section[id], .intro-block[id]');
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const productCategories = document.querySelectorAll('.product-category'); // Sélection accordéon

    // --- État et Configuration ---
    let isMenuOpen = false;
    let lastFocusedElement;

    // --- Fonctions Utilitaires ---
    const debounce = (func, wait = 15, immediate = false) => {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() { timeout = null; if (!immediate) func.apply(context, args); };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    // --- Fonctionnalités ---

    /** Effet Scroll sur l'En-tête */
    const handleHeaderScroll = () => {
        if (!header) return;
        if (window.scrollY >= 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    /** Menu Mobile : Ouverture/Fermeture et Gestion du Focus */
    const openMenu = () => {
        if (!navMenu || !navClose) return;
        lastFocusedElement = document.activeElement;
        navMenu.classList.add('active');
        navMenu.removeAttribute('tabindex');
        navClose.focus();
        isMenuOpen = true;
        document.body.style.overflow = 'hidden';
        navMenu.addEventListener('keydown', trapFocus);
    };

    const closeMenu = () => {
        if (!navMenu || !navToggle) return;
        navMenu.classList.remove('active');
        navMenu.setAttribute('tabindex', '-1');
        isMenuOpen = false;
        document.body.style.overflow = '';
        navMenu.removeEventListener('keydown', trapFocus);
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        } else {
             navToggle.focus();
        }
    };

    const trapFocus = (e) => {
        if (!isMenuOpen || !navMenu) return;
        if (e.key !== 'Tab') return;
        const focusableElements = Array.from(navMenu.querySelectorAll('a[href], button:not([disabled])'));
        if (focusableElements.length === 0) return;
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        if (e.shiftKey) {
            if (document.activeElement === firstElement) { lastElement.focus(); e.preventDefault(); }
        } else {
            if (document.activeElement === lastElement) { firstElement.focus(); e.preventDefault(); }
        }
    };

    if (navToggle) navToggle.addEventListener('click', openMenu);
    if (navClose) navClose.addEventListener('click', closeMenu);
    navLinks.forEach(link => link.addEventListener('click', () => { if (isMenuOpen) closeMenu(); }));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isMenuOpen) closeMenu(); });


    /** Bouton Retour en Haut */
    const handleBackToTop = () => {
        if (!backToTopButton) return;
        if (window.scrollY >= 400) { backToTopButton.classList.add('visible'); }
        else { backToTopButton.classList.remove('visible'); }
    };
    if (backToTopButton) {
        backToTopButton.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    }

    /** Smooth Scroll */
     document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#' || href.length <= 1) return;
            if (this.id === 'back-to-top') return;
            if (this.classList.contains('logo') && href === '#') {
                 e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); if (isMenuOpen) closeMenu(); return;
            }
            try {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    const headerOffset = header?.offsetHeight || 70;
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - headerOffset - 15;
                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                    if (isMenuOpen) closeMenu();
                }
            } catch (error) {
                console.warn(`Smooth scroll target not found or invalid selector: ${href}`, error);
            }
        });
    });

    /** Mise en évidence du Lien de Navigation Actif */
    const activateNavLink = (sectionId) => {
        navLinks.forEach(link => {
            link.classList.remove('active-link');
            link.removeAttribute('aria-current');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active-link');
                link.setAttribute('aria-current', 'page');
            }
        });
    };
    const sectionObserverOptions = { root: null, rootMargin: `-${header?.offsetHeight || 70}px 0px -60% 0px`, threshold: 0 };
    const sectionObserverCallback = (entries, observer) => {
        entries.forEach(entry => { if (entry.isIntersecting) { activateNavLink(entry.target.id); } });
    };
    if (window.IntersectionObserver && allSections.length > 0) {
        const sectionObserver = new IntersectionObserver(sectionObserverCallback, sectionObserverOptions);
        allSections.forEach(section => { if(section.id) sectionObserver.observe(section); });
    } else { console.warn("IntersectionObserver not supported..."); }

    /** Animation des Éléments au Scroll */
    const animateObserverOptions = { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.1 };
    const animateObserverCallback = (entries, observer) => {
        entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
    };
     if (window.IntersectionObserver && animatedElements.length > 0) {
        const animateObserver = new IntersectionObserver(animateObserverCallback, animateObserverOptions);
        animatedElements.forEach(elem => animateObserver.observe(elem));
     } else { animatedElements.forEach(elem => elem.classList.add('visible')); }

    /** Mise à Jour Année Footer */
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    /** Gestion Accordéon Produits */
    if (productCategories.length > 0) {
        productCategories.forEach(category => {
            category.addEventListener('click', handleProductClick);
            category.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleProductClick.call(category); } });
        });
    }
    function handleProductClick() {
        const detailsDiv = this.querySelector('.product-details');
        const isCurrentlyOpen = this.classList.contains('active');
        // 1. Fermer tous les autres
        productCategories.forEach(cat => {
            if (cat !== this) {
                const otherDetails = cat.querySelector('.product-details');
                cat.classList.remove('active'); cat.setAttribute('aria-expanded', 'false');
                if (otherDetails) { otherDetails.style.maxHeight = null; otherDetails.classList.remove('active'); }
            }
        });
        // 2. Ouvrir/fermer celui-ci
        if (isCurrentlyOpen) {
            this.classList.remove('active'); this.setAttribute('aria-expanded', 'false');
            if (detailsDiv) { detailsDiv.style.maxHeight = null; detailsDiv.classList.remove('active'); }
        } else {
            this.classList.add('active'); this.setAttribute('aria-expanded', 'true');
            if (detailsDiv) {
                detailsDiv.classList.add('active');
                requestAnimationFrame(() => { detailsDiv.style.maxHeight = detailsDiv.scrollHeight + "px"; });
                 setTimeout(() => { this.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 400);
            }
        }
    }

    /** Gestion Formulaire de Contact */
    if (contactForm && formStatus) {
        const honeypotField = contactForm.querySelector('input[name="website-url"]');
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); formStatus.textContent = ''; formStatus.className = 'form-status'; let isValid = true;
            if (honeypotField && honeypotField.value !== '') { console.warn('Honeypot field filled.'); return; }
            const requiredFields = contactForm.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                const trimmedValue = field.value.trim();
                if (!trimmedValue) { isValid = false; field.setAttribute('aria-invalid', 'true'); field.style.borderColor = 'var(--error-color)'; }
                else { field.setAttribute('aria-invalid', 'false'); field.style.borderColor = ''; }
                if (field.type === 'email' && trimmedValue) {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(trimmedValue)) { isValid = false; field.setAttribute('aria-invalid', 'true'); field.style.borderColor = 'var(--error-color)'; }
                }
            });
            if (!isValid) { formStatus.textContent = 'Veuillez vérifier les champs indiqués.'; formStatus.className = 'form-status error'; const firstInvalidField = contactForm.querySelector('[aria-invalid="true"]'); firstInvalidField?.focus(); return; }
            formStatus.textContent = 'Envoi en cours...'; formStatus.className = 'form-status info';
            const submitButton = contactForm.querySelector('button[type="submit"]');
            if (submitButton) submitButton.disabled = true;
            setTimeout(() => { // Simulation
                const simulatedSuccess = Math.random() > 0.1;
                if (simulatedSuccess) { formStatus.textContent = 'Merci ! Votre message a bien été envoyé.'; formStatus.className = 'form-status success'; contactForm.reset(); requiredFields.forEach(field => { field.setAttribute('aria-invalid', 'false'); field.style.borderColor = ''; }); }
                else { formStatus.textContent = 'Erreur lors de l\'envoi. Veuillez réessayer.'; formStatus.className = 'form-status error'; }
                if (submitButton) submitButton.disabled = false;
            }, 1500);
        });
        contactForm.querySelectorAll('input[required], textarea[required]').forEach(field => {
            field.addEventListener('input', () => { if (field.getAttribute('aria-invalid') === 'true') { field.setAttribute('aria-invalid', 'false'); field.style.borderColor = ''; } });
        });
    }

    // --- Ajout des Écouteurs d'Événements Globaux ---
    const debouncedScrollHandler = debounce(() => { handleHeaderScroll(); handleBackToTop(); }, 15);
    window.addEventListener('scroll', debouncedScrollHandler);

    // --- Exécution Initiale au Chargement ---
    handleHeaderScroll(); handleBackToTop();

    console.log("Boucherie Dubois (Style 3 v2) - Site Initialisé !");

}); // Fin de DOMContentLoaded
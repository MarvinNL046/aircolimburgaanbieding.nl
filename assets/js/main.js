// Airco Limburg Aanbieding - Main JavaScript

// ===== CONFIGURATION =====
const CONFIG = {
  emailjs: {
    serviceId: 'service_1rruujp',
    templateId: 'template_rkcpzhg',
    publicKey: 'sjJ8kK6U9wFjY0zX9'
  },
  typewriter: {
    texts: [
      'Airco Specialist Limburg',
      'Klimaatbeheersing Maastricht', 
      'Airconditioning Sittard',
      'Airco Service Heerlen'
    ],
    speed: 100,
    deleteSpeed: 50,
    pauseTime: 2000
  }
};

// ===== UTILITY FUNCTIONS =====
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
};

// ===== NAVIGATION =====
class Navigation {
  constructor() {
    this.navbar = $('#navbar');
    this.navToggle = $('#nav-toggle');
    this.navMenu = $('#nav-menu');
    this.navLinks = $$('.nav-link');
    
    this.init();
  }
  
  init() {
    this.setupScrollEffect();
    this.setupMobileMenu();
    this.setupSmoothScroll();
  }
  
  setupScrollEffect() {
    // Check if we should always show the navbar (for pages without hero section)
    if (document.body.classList.contains('navbar-always-visible')) {
      this.navbar.classList.remove('transparent');
      return; // Don't set up scroll effect
    }
    
    const handleScroll = throttle(() => {
      if (window.scrollY > 100) {
        this.navbar.classList.remove('transparent');
      } else {
        this.navbar.classList.add('transparent');
      }
    }, 100);
    
    // Set initial state based on scroll position
    if (window.scrollY <= 100) {
      this.navbar.classList.add('transparent');
    }
    
    window.addEventListener('scroll', handleScroll);
  }
  
  setupMobileMenu() {
    if (!this.navToggle || !this.navMenu) return;
    
    this.navToggle.addEventListener('click', () => {
      this.navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking on links
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.navMenu.classList.remove('active');
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.navbar.contains(e.target)) {
        this.navMenu.classList.remove('active');
      }
    });
  }
  
  setupSmoothScroll() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Check if it's an anchor link (starts with #)
        if (href.startsWith('#')) {
          e.preventDefault();
          const targetElement = $(href);
          
          if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });
          }
        }
        // For external links (like /producten.html), let the browser handle it normally
      });
    });
    
    // Handle scroll indicator
    const scrollIndicator = $('.scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.addEventListener('click', (e) => {
        e.preventDefault();
        const targetElement = $('#diensten');
        if (targetElement) {
          const offsetTop = targetElement.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    }
  }
}

// ===== TYPEWRITER EFFECT =====
class TypewriterEffect {
  constructor(element, texts, options = {}) {
    this.element = element;
    // Check if texts is an array or parse from data attribute
    if (typeof texts === 'string') {
      try {
        this.texts = JSON.parse(texts);
      } catch (e) {
        this.texts = [texts];
      }
    } else {
      this.texts = texts;
    }
    this.speed = options.speed || 100;
    this.deleteSpeed = options.deleteSpeed || 50;
    this.pauseTime = options.pauseTime || 2000;
    this.currentTextIndex = 0;
    this.currentCharIndex = 0;
    this.isDeleting = false;
    
    this.init();
  }
  
  init() {
    if (!this.element || !this.texts.length) return;
    this.type();
  }
  
  type() {
    const currentText = this.texts[this.currentTextIndex];
    
    if (this.isDeleting) {
      this.element.textContent = currentText.substring(0, this.currentCharIndex - 1);
      this.currentCharIndex--;
    } else {
      this.element.textContent = currentText.substring(0, this.currentCharIndex + 1);
      this.currentCharIndex++;
    }
    
    let typeSpeed = this.isDeleting ? this.deleteSpeed : this.speed;
    
    if (!this.isDeleting && this.currentCharIndex === currentText.length) {
      typeSpeed = this.pauseTime;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentCharIndex === 0) {
      this.isDeleting = false;
      this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
    }
    
    setTimeout(() => this.type(), typeSpeed);
  }
}

// ===== FORM HANDLER =====
class FormHandler {
  constructor() {
    this.forms = $$('.contact-form');
    this.init();
  }
  
  init() {
    // Wait for EmailJS to load
    if (typeof emailjs === 'undefined') {
      // Retry after a short delay if EmailJS not loaded yet
      setTimeout(() => this.init(), 100);
      return;
    }
    
    // Initialize EmailJS
    emailjs.init(CONFIG.emailjs.publicKey);
    
    this.forms.forEach(form => {
      form.addEventListener('submit', (e) => this.handleSubmit(e));
    });
  }
  
  async handleSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    
    // Prepare data for EmailJS
    const templateParams = {
      voornaam: formData.get('voornaam'),
      achternaam: formData.get('achternaam'),
      email: formData.get('email'),
      telefoon: formData.get('telefoon'),
      stad: formData.get('stad'),
      service: formData.get('service') || 'Niet gespecificeerd',
      bericht: formData.get('bericht') || 'Geen aanvullende informatie',
      datum: new Date().toLocaleDateString('nl-NL'),
      tijd: new Date().toLocaleTimeString('nl-NL')
    };
    
    console.log('Submitting form with data:', templateParams);
    
    // Validation
    if (!this.validateForm(templateParams)) {
      this.showMessage('Vul alle verplichte velden in.', 'error');
      return;
    }
    
    // Update button state
    this.setButtonLoading(submitButton, true);
    
    try {
      // Check if EmailJS is available
      if (typeof emailjs === 'undefined') {
        throw new Error('EmailJS is not loaded');
      }
      
      console.log('Sending email with EmailJS...');
      
      // Send email via EmailJS
      const response = await emailjs.send(
        CONFIG.emailjs.serviceId,
        CONFIG.emailjs.templateId,
        templateParams
      );
      
      console.log('EmailJS response:', response);
      
      this.showMessage('Bedankt! Uw aanvraag is verstuurd. Wij nemen binnen 24 uur contact met u op.', 'success');
      form.reset();
      
      // Track conversion (if analytics is available)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {
          send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL'
        });
      }
      
    } catch (error) {
      console.error('EmailJS Error:', error);
      console.error('Error details:', error.text || error.message);
      this.showMessage('Er is een fout opgetreden. Probeer het opnieuw of bel ons direct: 046-202-1430', 'error');
    } finally {
      this.setButtonLoading(submitButton, false);
    }
  }
  
  validateForm(data) {
    const required = ['voornaam', 'achternaam', 'email', 'telefoon', 'stad'];
    return required.every(field => data[field] && data[field].trim() !== '');
  }
  
  setButtonLoading(button, isLoading) {
    if (isLoading) {
      button.disabled = true;
      button.innerHTML = `
        <svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 12a9 9 0 11-6.219-8.56"/>
        </svg>
        <span>Versturen...</span>
      `;
    } else {
      button.disabled = false;
      button.innerHTML = `
        <span>Verstuur Aanvraag</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12,5 19,12 12,19"></polyline>
        </svg>
      `;
    }
  }
  
  showMessage(message, type) {
    // Remove existing messages
    const existingMessage = $('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    // Create new message
    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-message--${type}`;
    messageEl.innerHTML = `
      <div style="
        padding: 1rem;
        border-radius: 8px;
        margin-top: 1rem;
        font-weight: 500;
        background-color: ${type === 'success' ? '#DEF7EC' : '#FEE2E2'};
        color: ${type === 'success' ? '#047857' : '#DC2626'};
        border: 1px solid ${type === 'success' ? '#A7F3D0' : '#FECACA'};
      ">
        ${message}
      </div>
    `;
    
    // Add to DOM
    const forms = $$('.contact-form');
    forms.forEach(form => {
      form.appendChild(messageEl.cloneNode(true));
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      $$('.form-message').forEach(msg => msg.remove());
    }, 5000);
  }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    this.init();
  }
  
  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => this.handleIntersection(entries),
        this.observerOptions
      );
      
      this.observeElements();
    }
  }
  
  observeElements() {
    const elements = $$('.service-card, .feature-card, .brand-item');
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

// ===== PERFORMANCE OPTIMIZATIONS =====
class PerformanceOptimizer {
  constructor() {
    this.init();
  }
  
  init() {
    this.setupLazyLoading();
    this.preloadCriticalResources();
  }
  
  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const images = $$('img[loading="lazy"]');
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            imageObserver.unobserve(img);
          }
        });
      });
      
      images.forEach(img => imageObserver.observe(img));
    }
  }
  
  preloadCriticalResources() {
    // Preload critical CSS if needed
    const criticalCSS = [
      '/assets/css/main.css'
    ];
    
    criticalCSS.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = href;
      document.head.appendChild(link);
    });
  }
}

// ===== ANALYTICS & TRACKING =====
class Analytics {
  constructor() {
    this.init();
  }
  
  init() {
    this.setupEventTracking();
  }
  
  setupEventTracking() {
    // Track phone clicks
    $$('a[href^="tel:"]').forEach(link => {
      link.addEventListener('click', () => {
        this.trackEvent('phone_call', {
          number: link.href.replace('tel:', '')
        });
      });
    });
    
    // Track WhatsApp clicks
    $$('a[href*="wa.me"]').forEach(link => {
      link.addEventListener('click', () => {
        this.trackEvent('whatsapp_click', {
          number: link.href
        });
      });
    });
    
    // Track form interactions
    $$('.contact-form').forEach(form => {
      const inputs = form.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        input.addEventListener('focus', () => {
          this.trackEvent('form_interaction', {
            field: input.name,
            form_id: form.id || 'contact_form'
          });
        }, { once: true });
      });
    });
  }
  
  trackEvent(eventName, parameters = {}) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, parameters);
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
      fbq('track', 'CustomEvent', {
        event_name: eventName,
        ...parameters
      });
    }
    
    console.log('Event tracked:', eventName, parameters);
  }
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
class AccessibilityEnhancer {
  constructor() {
    this.init();
  }
  
  init() {
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupARIALabels();
  }
  
  setupKeyboardNavigation() {
    // Escape key to close mobile menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const navMenu = $('#nav-menu');
        if (navMenu && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          $('#nav-toggle').focus();
        }
      }
    });
  }
  
  setupFocusManagement() {
    // Focus trap for mobile menu
    const navMenu = $('#nav-menu');
    const navToggle = $('#nav-toggle');
    
    if (navMenu && navToggle) {
      navToggle.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
          // Focus first link in menu
          const firstLink = navMenu.querySelector('a');
          if (firstLink) {
            setTimeout(() => firstLink.focus(), 100);
          }
        }
      });
    }
  }
  
  setupARIALabels() {
    // Add aria-expanded to mobile menu toggle
    const navToggle = $('#nav-toggle');
    const navMenu = $('#nav-menu');
    
    if (navToggle && navMenu) {
      const updateARIA = () => {
        const isExpanded = navMenu.classList.contains('active');
        navToggle.setAttribute('aria-expanded', isExpanded);
      };
      
      navToggle.addEventListener('click', () => {
        setTimeout(updateARIA, 0);
      });
      
      updateARIA(); // Initial state
    }
  }
}

// ===== ERROR HANDLING =====
class ErrorHandler {
  constructor() {
    this.init();
  }
  
  init() {
    window.addEventListener('error', (e) => {
      console.error('JavaScript Error:', e.error);
      this.logError('javascript_error', e.error);
    });
    
    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled Promise Rejection:', e.reason);
      this.logError('promise_rejection', e.reason);
    });
  }
  
  logError(type, error) {
    // Log to analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        description: `${type}: ${error.message || error}`,
        fatal: false
      });
    }
  }
}

// ===== INITIALIZATION =====
class App {
  constructor() {
    this.init();
  }
  
  init() {
    this.waitForDOM(() => {
      this.initializeComponents();
    });
  }
  
  waitForDOM(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }
  
  initializeComponents() {
    try {
      // Core components
      new Navigation();
      
      // Typewriter effect
      const typewriterElement = $('.typewriter');
      if (typewriterElement) {
        // Check if element has data-texts attribute
        const dataTexts = typewriterElement.getAttribute('data-texts');
        const texts = dataTexts ? dataTexts : JSON.stringify(CONFIG.typewriter.texts);
        
        new TypewriterEffect(
          typewriterElement,
          texts,
          CONFIG.typewriter
        );
      }
      
      // Enhancement components
      new ScrollAnimations();
      new PerformanceOptimizer();
      new Analytics();
      new AccessibilityEnhancer();
      new ErrorHandler();
      
      // Initialize FormHandler after EmailJS loads
      const initFormHandler = () => {
        if (typeof emailjs !== 'undefined') {
          new FormHandler();
          console.log('FormHandler initialized with EmailJS');
        } else {
          // Retry after 100ms
          setTimeout(initFormHandler, 100);
        }
      };
      
      // Start trying to initialize FormHandler
      initFormHandler();
      
      console.log('Airco Limburg Aanbieding - App initialized successfully');
      
    } catch (error) {
      console.error('App initialization error:', error);
    }
  }
}

// Start the application
new App();
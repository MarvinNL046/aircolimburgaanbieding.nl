// Enhanced EmailJS handler with GoHighLevel webhook integration
// This file can be included separately or replace the FormHandler in main.js

// Import email utility functions
import { sendEmail } from './utils/email.js';

// Configuration (matching main.js)
const CONFIG = {
  emailjs: {
    serviceId: 'service_1rruujp',
    templateId: 'template_rkcpzhg',
    publicKey: 'sjJ8kK6U9wFjY0zX9'
  }
};

class EnhancedFormHandler {
  constructor() {
    this.forms = document.querySelectorAll('.contact-form');
    this.init();
  }
  
  init() {
    // Wait for EmailJS to load
    if (typeof emailjs === 'undefined') {
      setTimeout(() => this.init(), 100);
      return;
    }
    
    // Initialize EmailJS
    try {
      emailjs.init(CONFIG.emailjs.publicKey);
      console.log('EmailJS initialized successfully');
    } catch (error) {
      console.error('EmailJS init error:', error);
    }
    
    // Attach event listeners
    this.forms.forEach(form => {
      form.addEventListener('submit', (e) => this.handleSubmit(e));
    });
  }
  
  async handleSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    
    // Prepare data
    const data = {
      voornaam: formData.get('voornaam') || '',
      achternaam: formData.get('achternaam') || '',
      email: formData.get('email') || '',
      telefoon: formData.get('telefoon') || '',
      stad: formData.get('stad') || '',
      service: formData.get('service') || 'Niet gespecificeerd',
      bericht: formData.get('bericht') || 'Geen aanvullende informatie'
    };
    
    // Validation
    if (!this.validateForm(data)) {
      this.showMessage('Vul alle verplichte velden in.', 'error');
      return;
    }
    
    // Update button state
    this.setButtonLoading(submitButton, true);
    
    try {
      // Send using dual submission system
      const result = await sendEmail(data);
      
      console.log('Form submission result:', result);
      
      // Show success message
      this.showMessage('Bedankt! Uw aanvraag is verstuurd. Wij nemen binnen 24 uur contact met u op.', 'success');
      form.reset();
      
      // Track conversions
      this.trackConversion();
      
      // Optional: Redirect to thank you page
      setTimeout(() => {
        if (window.location.pathname !== '/tot-snel.html') {
          window.location.href = '/tot-snel.html';
        }
      }, 2000);
      
    } catch (error) {
      console.error('Form submission error:', error);
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
    const existingMessage = document.querySelector('.form-message');
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
    this.forms.forEach(form => {
      form.appendChild(messageEl.cloneNode(true));
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      document.querySelectorAll('.form-message').forEach(msg => msg.remove());
    }, 5000);
  }
  
  trackConversion() {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', 'conversion', {
        send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL',
        event_category: 'engagement',
        event_label: 'contact_form'
      });
      
      gtag('event', 'form_submit', {
        form_type: 'contact',
        form_location: window.location.pathname
      });
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
      fbq('track', 'Lead', {
        content_name: 'Contact Form',
        content_category: 'Lead Generation'
      });
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new EnhancedFormHandler();
  });
} else {
  new EnhancedFormHandler();
}

// Export for use in other modules
export default EnhancedFormHandler;
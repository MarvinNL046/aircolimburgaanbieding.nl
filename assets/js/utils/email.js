// Email utility with dual submission (EmailJS + LeadFlow)

// Configuration
const DEBUG_MODE = false; // Enable for troubleshooting

// LeadFlow CRM configuration
const LEADFLOW_URL = "https://wetryleadflow.com/api/webhooks/leads";
const LEADFLOW_API_KEY = "lf_lRyHo1ENukt9VsG9gYT8EKeDA_nKuoQ1";

// EmailJS configuration (same as main.js)
const EMAILJS_CONFIG = {
  serviceId: 'service_1rruujp',
  templateId: 'template_rkcpzhg',
  publicKey: 'sjJ8kK6U9wFjY0zX9'
};

// Send via EmailJS (existing method)
const sendViaEmailJS = async (data) => {
  try {
    // Check if EmailJS is available
    if (typeof emailjs === 'undefined') {
      console.error('EmailJS is not loaded');
      return false;
    }

    // Prepare template parameters (same as in main.js)
    const templateParams = {
      voornaam: data.voornaam,
      achternaam: data.achternaam,
      email: data.email,
      telefoon: data.telefoon,
      stad: data.stad,
      service: data.service || 'Niet gespecificeerd',
      bericht: data.bericht || 'Geen aanvullende informatie',
      datum: new Date().toLocaleDateString('nl-NL'),
      tijd: new Date().toLocaleTimeString('nl-NL'),
      // Add commonly used EmailJS variable names
      from_name: `${data.voornaam} ${data.achternaam}`.trim(),
      from_email: data.email,
      message: data.bericht,
      phone: data.telefoon,
      city: data.stad,
      // Add a full message summary
      full_message: `
Nieuwe aanvraag via AircoLimburgAanbieding.nl

Naam: ${data.voornaam} ${data.achternaam}
Email: ${data.email}
Telefoon: ${data.telefoon}
Stad: ${data.stad}
Service: ${data.service || 'Niet gespecificeerd'}
Bericht: ${data.bericht || 'Geen aanvullende informatie'}

Datum: ${new Date().toLocaleDateString('nl-NL')}
Tijd: ${new Date().toLocaleTimeString('nl-NL')}
      `.trim()
    };

    if (DEBUG_MODE) {
      console.log('Sending via EmailJS:', templateParams);
    }

    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams
    );
    
    if (DEBUG_MODE) {
      console.log('EmailJS response:', response);
    }
    
    return true;
  } catch (error) {
    console.error('EmailJS error:', error);
    return false;
  }
};

// Send data to LeadFlow CRM
const sendToLeadflow = async (data) => {
  try {
    const name = `${data.voornaam} ${data.achternaam}`.trim();
    const nameParts = name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const leadflowData = {
      firstName,
      lastName,
      email: data.email,
      phone: data.telefoon,
      message: data.bericht || '',
      source: 'website-contact',
      customFields: {
        city: data.stad || '',
        woonplaats: data.stad || ''
      }
    };

    if (DEBUG_MODE) {
      console.log('Sending data to Leadflow CRM:', leadflowData);
    }

    const response = await fetch(LEADFLOW_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": LEADFLOW_API_KEY
      },
      body: JSON.stringify(leadflowData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Leadflow error (' + response.status + '):', errorText);
      return false;
    }

    if (DEBUG_MODE) {
      console.log('Leadflow submission successful');
    }
    return true;
  } catch (error) {
    console.error('Leadflow submission failed:', error);
    return false;
  }
};

// Analytics tracking helpers
const trackFormSubmission = (formType, success, method) => {
  // Google Analytics 4
  if (typeof gtag !== 'undefined') {
    gtag('event', 'form_submission', {
      form_type: formType || 'contact_form',
      success: success,
      submission_method: method,
      send_to: 'G-XXXXXXXXXX' // Replace with actual GA4 ID
    });
  }
  
  // Facebook Pixel
  if (typeof fbq !== 'undefined') {
    fbq('track', 'Lead', {
      content_name: formType || 'contact_form',
      status: success ? 'completed' : 'failed',
      submission_method: method
    });
  }
  
  if (DEBUG_MODE) {
    console.log('Analytics tracked:', { formType, success, method });
  }
};

// Main function with dual submission
export const sendEmail = async (data, formType = 'contact_form') => {
  // Start all requests in parallel for better performance
  const [emailJSSuccess, leadflowSuccess] = await Promise.all([
    sendViaEmailJS(data),
    sendToLeadflow(data)
  ]);

  if (DEBUG_MODE) {
    console.log('Submission results:', {
      emailJS: emailJSSuccess,
      leadflow: leadflowSuccess
    });
  }

  // Track submission results
  const methods = [];
  if (emailJSSuccess) {
    methods.push('emailjs');
    trackFormSubmission(formType, true, 'emailjs');
  }
  if (leadflowSuccess) {
    methods.push('leadflow');
    trackFormSubmission(formType, true, 'leadflow');
  }

  // Track overall success
  const overallSuccess = emailJSSuccess || leadflowSuccess;
  if (overallSuccess) {
    trackFormSubmission(formType, true, methods.join('+'));
  } else {
    trackFormSubmission(formType, false, 'all_failed');
  }

  // Only throw error if ALL methods fail
  if (!overallSuccess) {
    throw new Error('Failed to send contact form data');
  }

  // Return success status for tracking
  return {
    emailJS: emailJSSuccess,
    leadflow: leadflowSuccess,
    success: overallSuccess,
    methods: methods
  };
};

// Export configuration and utilities for external use
export const config = {
  EMAILJS_CONFIG,
  DEBUG_MODE
};

export { trackFormSubmission };
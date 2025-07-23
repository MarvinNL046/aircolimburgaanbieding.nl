// Email utility with dual submission (EmailJS + GoHighLevel webhook)

// Configuration
const WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/k90zUH3RgEQLfj7Yc55b/webhook-trigger/54670718-ea44-43a1-a81a-680ab3d5f67f";
const DEBUG_MODE = false; // Enable for troubleshooting

// EmailJS configuration (same as main.js)
const EMAILJS_CONFIG = {
  serviceId: 'service_1rruujp',
  templateId: 'template_rkcpzhg',
  publicKey: 'sjJ8kK6U9wFjY0zX9'
};

// Send data to GoHighLevel webhook
const sendToWebhook = async (data) => {
  try {
    const webhookData = {
      data: {
        name: `${data.voornaam} ${data.achternaam}`.trim(),
        email: data.email,
        phone: data.telefoon,
        city: data.stad,
        message: data.bericht || 'Geen aanvullende informatie'
      }
    };

    if (DEBUG_MODE) {
      console.log('Sending to webhook:', webhookData);
    }

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(webhookData)
    });

    if (!response.ok) {
      console.error('Webhook response not OK:', response.status);
      return false;
    }
    
    if (DEBUG_MODE) {
      console.log('Webhook sent successfully');
    }
    
    return true;
  } catch (error) {
    console.error('Webhook error:', error);
    return false;
  }
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
  // Start both requests in parallel for better performance
  const [emailJSSuccess, webhookSuccess] = await Promise.all([
    sendViaEmailJS(data),
    sendToWebhook(data)
  ]);
  
  if (DEBUG_MODE) {
    console.log('Submission results:', {
      emailJS: emailJSSuccess,
      webhook: webhookSuccess
    });
  }
  
  // Track submission results
  const methods = [];
  if (webhookSuccess) {
    methods.push('webhook');
    trackFormSubmission(formType, true, 'webhook');
  }
  if (emailJSSuccess) {
    methods.push('emailjs');
    trackFormSubmission(formType, true, 'emailjs');
  }
  
  // Track overall success
  const overallSuccess = emailJSSuccess || webhookSuccess;
  if (overallSuccess) {
    trackFormSubmission(formType, true, methods.join('+'));
  } else {
    trackFormSubmission(formType, false, 'both_failed');
  }
  
  // Only throw error if BOTH methods fail
  if (!overallSuccess) {
    throw new Error('Failed to send contact form data');
  }
  
  // Return success status for tracking
  return {
    emailJS: emailJSSuccess,
    webhook: webhookSuccess,
    success: overallSuccess,
    methods: methods
  };
};

// Function to send only to webhook (for testing)
export const sendWebhookOnly = async (data) => {
  return await sendToWebhook(data);
};

// Export configuration and utilities for external use
export const config = {
  WEBHOOK_URL,
  EMAILJS_CONFIG,
  DEBUG_MODE
};

export { trackFormSubmission };
// Simple EmailJS handler without modules
(function() {
    'use strict';
    
    // Wait for DOM and EmailJS to load
    function initEmailJS() {
        if (typeof emailjs === 'undefined') {
            setTimeout(initEmailJS, 100);
            return;
        }
        
        // Initialize EmailJS
        emailjs.init('sjJ8kK6U9wFjY0zX9');
        console.log('EmailJS initialized in simple handler');
        
        // Find all forms
        const forms = document.querySelectorAll('.contact-form');
        
        forms.forEach(form => {
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const formData = new FormData(this);
                const submitButton = this.querySelector('button[type="submit"]');
                
                // Get form values
                const data = {
                    voornaam: formData.get('voornaam') || '',
                    achternaam: formData.get('achternaam') || '',
                    email: formData.get('email') || '',
                    telefoon: formData.get('telefoon') || '',
                    stad: formData.get('stad') || '',
                    service: formData.get('service') || 'Niet gespecificeerd',
                    bericht: formData.get('bericht') || 'Geen aanvullende informatie',
                    datum: new Date().toLocaleDateString('nl-NL'),
                    tijd: new Date().toLocaleTimeString('nl-NL'),
                    from_name: `${formData.get('voornaam') || ''} ${formData.get('achternaam') || ''}`.trim(),
                    from_email: formData.get('email') || '',
                    message: formData.get('bericht') || 'Geen aanvullende informatie',
                    full_message: `Nieuwe aanvraag via AircoLimburgAanbieding.nl\n\nNaam: ${formData.get('voornaam')} ${formData.get('achternaam')}\nEmail: ${formData.get('email')}\nTelefoon: ${formData.get('telefoon')}\nStad: ${formData.get('stad')}\nService: ${formData.get('service') || 'Niet gespecificeerd'}\nBericht: ${formData.get('bericht') || 'Geen'}`
                };
                
                console.log('Sending form data:', data);
                
                // Disable button
                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.textContent = 'Versturen...';
                }
                
                try {
                    const response = await emailjs.send('service_1rruujp', 'template_rkcpzhg', data);
                    console.log('Email sent successfully:', response);
                    
                    // Show success message
                    alert('Bedankt! Uw aanvraag is verstuurd. Wij nemen binnen 24 uur contact met u op.');
                    form.reset();
                    
                } catch (error) {
                    console.error('EmailJS error:', error);
                    alert('Er is een fout opgetreden. Probeer het opnieuw of bel ons direct: 046-202-1430');
                }
                
                // Re-enable button
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = '<span>Verstuur Aanvraag</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12,5 19,12 12,19"></polyline></svg>';
                }
            });
        });
    }
    
    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEmailJS);
    } else {
        initEmailJS();
    }
})();
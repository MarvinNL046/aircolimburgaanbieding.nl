# GoHighLevel Webhook Implementation

## Overview
The AircoLimburgAanbieding.nl website now features a dual submission system where form data is sent to both EmailJS and a GoHighLevel webhook simultaneously. This ensures redundancy - if one service fails, the lead is still captured.

## Implementation Details

### 1. Modified Files

- **`/assets/js/main.js`** - Enhanced FormHandler class with webhook integration
- **`/assets/js/utils/email.js`** - Utility module for dual submission (can be used separately)
- **`/assets/js/emailjs-handler.js`** - Alternative enhanced handler using the email utility
- **`/contact-webhook-test.html`** - Test page for webhook verification

### 2. Webhook Configuration

```javascript
Webhook URL: https://services.leadconnectorhq.com/hooks/k90zUH3RgEQLfj7Yc55b/webhook-trigger/54670718-ea44-43a1-a81a-680ab3d5f67f
```

### 3. How It Works

1. User fills out any contact form on the website
2. On submit, the FormHandler:
   - Prepares data for both EmailJS and webhook
   - Sends to both services simultaneously using Promise.all()
   - Only shows error if BOTH services fail
   - Shows success if at least one service succeeds

### 4. Data Format

The webhook receives data in this format:
```json
{
  "data": {
    "name": "Full Name",
    "email": "email@example.com",
    "phone": "0612345678",
    "city": "Maastricht",
    "message": "Message content"
  }
}
```

### 5. Testing

1. **Live site testing**: Fill out any contact form on the website
2. **Webhook-only testing**: Visit `/contact-webhook-test.html`
3. **Check console**: Open browser console to see submission results

### 6. Benefits

- **Redundancy**: If EmailJS fails, webhook still captures the lead
- **No code changes needed**: Works with all existing forms
- **Analytics preserved**: Still tracks conversions in GA and FB Pixel
- **User experience**: Same success/error messages as before

### 7. Monitoring

Check browser console for submission results:
```javascript
Submission results: {
  emailJS: true,    // EmailJS success/failure
  webhook: true     // Webhook success/failure
}
```

## Troubleshooting

1. **"No scenario listening" error**: The webhook is not active in GoHighLevel
2. **CORS errors**: The webhook should accept requests from your domain
3. **Both services fail**: Check internet connection and service status
4. **No emails but webhook works**: Check EmailJS configuration

## Future Improvements

- Add retry logic for failed submissions
- Store failed submissions locally and retry later
- Add admin dashboard to monitor submission status
- Implement webhook signature verification for security
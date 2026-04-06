# reCAPTCHA v3 Backend Validation

## Overview
This document explains how to implement reCAPTCHA v3 score validation on your backend server to verify the tokens sent from the contact form.

## Keys
- **Site Key (Frontend)**: `6Lc13cMrAAAAANoY7v1-XZivX8BmlppVXnWJDDyt`
- **Secret Key (Backend)**: `6Lc13cMrAAAAAAiA7_0ka-oi_PHUkL9jTwV-fLP1`

## Implementation

### 1. Verify Token on Backend

When you receive the `recaptcha_token` from EmailJS, verify it with Google's API:

```javascript
// Node.js/Express example
const verifyRecaptcha = async (token) => {
    const secretKey = '6Lc13cMrAAAAAAiA7_0ka-oi_PHUkL9jTwV-fLP1';
    
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${secretKey}&response=${token}`
    });
    
    const data = await response.json();
    return data;
};
```

### 2. Response Format

The verification response includes:

```json
{
    "success": true,
    "score": 0.9,
    "action": "contact_form_submit",
    "challenge_ts": "2024-01-01T12:00:00Z",
    "hostname": "rubrion.ai",
    "error-codes": []
}
```

### 3. Score Interpretation

According to [Google's documentation](https://developers.google.com/recaptcha/docs/v3):

| Score Range | Interpretation | Recommended Action |
|-------------|----------------|-------------------|
| 1.0 - 0.9   | Very likely legitimate | Allow |
| 0.9 - 0.7   | Likely legitimate | Allow |
| 0.7 - 0.5   | Neutral | Allow with monitoring |
| 0.5 - 0.3   | Suspicious | Require additional verification |
| 0.3 - 0.0   | Very likely bot | Block or challenge |

### 4. Implementation Example

```javascript
// EmailJS webhook handler example
app.post('/webhook/emailjs', async (req, res) => {
    const { recaptcha_token, from_name, from_email, message } = req.body;
    
    // Skip verification in development
    if (process.env.NODE_ENV === 'development') {
        // Process email normally
        return res.json({ success: true });
    }
    
    try {
        // Verify reCAPTCHA token
        const recaptchaResult = await verifyRecaptcha(recaptcha_token);
        
        if (!recaptchaResult.success) {
            console.error('reCAPTCHA verification failed:', recaptchaResult['error-codes']);
            return res.status(400).json({ error: 'reCAPTCHA verification failed' });
        }
        
        // Check action name
        if (recaptchaResult.action !== 'contact_form_submit') {
            console.error('Invalid reCAPTCHA action:', recaptchaResult.action);
            return res.status(400).json({ error: 'Invalid reCAPTCHA action' });
        }
        
        // Check score (adjust threshold as needed)
        const minScore = 0.5;
        if (recaptchaResult.score < minScore) {
            console.warn(`Low reCAPTCHA score: ${recaptchaResult.score} for ${from_email}`);
            
            // You can either:
            // 1. Block the request
            // return res.status(400).json({ error: 'Security check failed' });
            
            // 2. Flag for manual review
            // flagForReview(req.body, recaptchaResult.score);
            
            // 3. Require additional verification
            // requireAdditionalVerification(from_email);
        }
        
        // Process the email if all checks pass
        console.log(`reCAPTCHA verified. Score: ${recaptchaResult.score}, Email: ${from_email}`);
        
        // Your email processing logic here
        // ...
        
        res.json({ success: true, score: recaptchaResult.score });
        
    } catch (error) {
        console.error('Error verifying reCAPTCHA:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
```

### 5. Security Best Practices

1. **Always verify on backend**: Never trust frontend-only validation
2. **Check action name**: Ensure the action matches what you expect
3. **Monitor scores**: Log scores to understand your traffic patterns
4. **Adjust thresholds**: Start with 0.5 and adjust based on your data
5. **Handle errors gracefully**: Don't block legitimate users due to API issues
6. **Rate limiting**: Implement additional rate limiting for low-score requests

### 6. Testing

- **Development**: reCAPTCHA is disabled (`recaptcha_token: 'dev-mode'`)
- **Staging**: Use test keys if available
- **Production**: Monitor scores and adjust thresholds

### 7. Monitoring

Track these metrics:
- Average scores by time period
- Distribution of scores
- Blocked requests by score
- False positives/negatives

## References

- [reCAPTCHA v3 Documentation](https://developers.google.com/recaptcha/docs/v3)
- [Server-side Verification](https://developers.google.com/recaptcha/docs/verify)
- [Score Interpretation Guide](https://developers.google.com/recaptcha/docs/v3#interpreting_the_score)

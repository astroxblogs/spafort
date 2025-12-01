import axios from 'axios';

class BrevoEmailService {
  constructor() {
    this.baseURL = 'https://api.brevo.com/v3/smtp/email';
  }

  generateBookingEmailHTML(bookingData, serviceDetails) {
    const bookingDate = new Date(bookingData.bookingDate).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your SpaFort Booking Confirmation</title>
        <style>
          body {
            font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            background-color: #f8fafc;
          }
          .container {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 20px;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            text-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 16px;
          }
          .content {
            background: white;
            padding: 40px 30px;
          }
          .booking-card {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            border-radius: 15px;
            padding: 25px;
            margin: 20px 0;
            color: white;
            box-shadow: 0 10px 30px rgba(240, 147, 251, 0.3);
          }
          .booking-ref {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 15px;
            background: rgba(255,255,255,0.2);
            padding: 10px;
            border-radius: 10px;
          }
          .service-details {
            background: #f8fafc;
            border-radius: 15px;
            padding: 25px;
            margin: 20px 0;
            border-left: 5px solid #667eea;
          }
          .service-title {
            font-size: 22px;
            font-weight: 700;
            color: #1a202c;
            margin-bottom: 10px;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-label {
            font-weight: 600;
            color: #4a5568;
          }
          .detail-value {
            font-weight: 700;
            color: #2d3748;
          }
          .price-highlight {
            background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
            color: white;
            padding: 15px;
            border-radius: 10px;
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            margin: 20px 0;
          }
          .customer-info {
            background: #edf2f7;
            border-radius: 15px;
            padding: 25px;
            margin: 20px 0;
          }
          .info-section h3 {
            color: #2d3748;
            font-size: 18px;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
          }
          .info-section h3:before {
            content: "📋";
            margin-right: 10px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }
          .info-item {
            background: white;
            padding: 12px;
            border-radius: 8px;
            border-left: 3px solid #667eea;
          }
          .info-label {
            font-size: 12px;
            color: #718096;
            text-transform: uppercase;
            font-weight: 600;
            margin-bottom: 4px;
          }
          .info-value {
            font-weight: 600;
            color: #2d3748;
          }
          .notes-section {
            background: #fef5e7;
            border: 1px solid #f6ad55;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
          }
          .notes-section h4 {
            color: #c05621;
            margin: 0 0 10px 0;
            display: flex;
            align-items: center;
          }
          .notes-section h4:before {
            content: "💭";
            margin-right: 8px;
          }
          .benefits-section {
            background: linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%);
            border-radius: 15px;
            padding: 25px;
            margin: 20px 0;
            border-left: 5px solid #38b2ac;
          }
          .benefits-section h4 {
            color: #234e52;
            margin: 0 0 15px 0;
            display: flex;
            align-items: center;
          }
          .benefits-section h4:before {
            content: "✨";
            margin-right: 8px;
          }
          .benefits-list {
            list-style: none;
            padding: 0;
          }
          .benefits-list li {
            padding: 5px 0;
            color: #2d3748;
            display: flex;
            align-items: center;
          }
          .benefits-list li:before {
            content: "✓";
            color: #38b2ac;
            font-weight: bold;
            margin-right: 10px;
          }
          .next-steps {
            background: linear-gradient(135deg, #ebf8ff 0%, #bee3f8 100%);
            border-radius: 15px;
            padding: 25px;
            margin: 20px 0;
            border-left: 5px solid #3182ce;
          }
          .next-steps h4 {
            color: #2c5282;
            margin: 0 0 15px 0;
            display: flex;
            align-items: center;
          }
          .next-steps h4:before {
            content: "🚀";
            margin-right: 8px;
          }
          .steps-list {
            list-style: none;
            padding: 0;
          }
          .steps-list li {
            padding: 8px 0;
            color: #2d3748;
            display: flex;
            align-items: flex-start;
          }
          .steps-list li:before {
            content: counter(step-counter);
            counter-increment: step-counter;
            background: #3182ce;
            color: white;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            margin-right: 12px;
            flex-shrink: 0;
            margin-top: 2px;
          }
          .footer {
            background: #2d3748;
            color: white;
            padding: 30px;
            text-align: center;
          }
          .footer h3 {
            margin: 0 0 15px 0;
            font-size: 20px;
          }
          .contact-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 20px 0;
          }
          .contact-item {
            background: rgba(255,255,255,0.1);
            padding: 15px;
            border-radius: 10px;
          }
          .contact-item h4 {
            margin: 0 0 5px 0;
            font-size: 14px;
            opacity: 0.9;
          }
          .contact-item p {
            margin: 0;
            font-weight: 600;
          }
          .social-links {
            margin: 20px 0 0 0;
          }
          .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: white;
            text-decoration: none;
            font-size: 24px;
          }
          @media (max-width: 600px) {
            .container {
              margin: 10px;
            }
            .info-grid {
              grid-template-columns: 1fr;
            }
            .contact-info {
              grid-template-columns: 1fr;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Booking Confirmed!</h1>
            <p>Your wellness journey begins here</p>
          </div>

          <div class="content">
            <div class="booking-card">
              <div class="booking-ref">
                Booking Reference: ${bookingData.bookingReference}
              </div>
              <p style="text-align: center; margin: 0; font-size: 16px;">
                Thank you, ${bookingData.name}! Your appointment has been successfully booked.
              </p>
            </div>

            <div class="service-details">
              <h2 class="service-title">🧘‍♀️ ${serviceDetails.title}</h2>
              <div class="detail-row">
                <span class="detail-label">Category:</span>
                <span class="detail-value">${serviceDetails.category}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Duration:</span>
                <span class="detail-value">${serviceDetails.duration}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date & Time:</span>
                <span class="detail-value">${bookingDate} at ${bookingData.bookingTime}</span>
              </div>
            </div>

            <div class="price-highlight">
              💰 Total Investment: ₹${serviceDetails.price}
            </div>

            <div class="customer-info">
              <div class="info-section">
                <h3>Your Information</h3>
                <div class="info-grid">
                  <div class="info-item">
                    <div class="info-label">Name</div>
                    <div class="info-value">${bookingData.name}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Email</div>
                    <div class="info-value">${bookingData.email}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Mobile</div>
                    <div class="info-value">${bookingData.mobile}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Address</div>
                    <div class="info-value">${bookingData.address}</div>
                  </div>
                </div>
              </div>
            </div>

            ${bookingData.notes ? `
            <div class="notes-section">
              <h4>Special Requests</h4>
              <p style="margin: 0; color: #2d3748;">${bookingData.notes}</p>
            </div>
            ` : ''}

            ${serviceDetails.benefits && serviceDetails.benefits.length > 0 ? `
            <div class="benefits-section">
              <h4>What to Expect</h4>
              <ul class="benefits-list">
                ${serviceDetails.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
              </ul>
            </div>
            ` : ''}

            <div class="next-steps">
              <h4>What's Next?</h4>
              <ol class="steps-list" style="counter-reset: step-counter;">
                <li>Our wellness consultant will contact you within 24 hours</li>
                <li>You'll receive a confirmation call to finalize details</li>
                <li>Pre-session consultation to understand your needs</li>
                <li>Special preparation instructions will be shared</li>
                <li>Enjoy your transformative wellness experience!</li>
              </ol>
            </div>

            <div style="text-align: center; margin: 30px 0; padding: 20px; background: #f8fafc; border-radius: 10px;">
              <p style="margin: 0; color: #4a5568; font-style: italic;">
                "Wellness is not a luxury, it's a necessity. Thank you for choosing SpaFort for your journey to tranquility."
              </p>
            </div>
          </div>

          <div class="footer">
            <h3>🧘‍♀️ SpaFort - Your Wellness Sanctuary</h3>
            <p style="margin: 15px 0; opacity: 0.9;">
              Experience authentic Thai massage and premium wellness services in a serene environment.
            </p>

            <div class="contact-info">
              <div class="contact-item">
                <h4>📞 Phone</h4>
                <p>+91 XXXXX XXXXX</p>
              </div>
              <div class="contact-item">
                <h4>📧 Email</h4>
                <p>hello@spafort.com</p>
              </div>
            </div>

            <div class="social-links">
              <a href="#" title="Facebook">📘</a>
              <a href="#" title="Instagram">📷</a>
              <a href="#" title="Twitter">🐦</a>
              <a href="#" title="WhatsApp">💬</a>
            </div>

            <p style="margin: 20px 0 0 0; font-size: 12px; opacity: 0.7;">
              © 2024 SpaFort. All rights reserved. | This is an automated confirmation email.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async sendBookingConfirmationEmail(bookingData, serviceDetails) {
    try {
      // Get environment variables at runtime
      const apiKey = process.env.BREVO_API_KEY;
      const senderEmail = process.env.BREVO_SENDER_EMAIL;
      const senderName = process.env.BREVO_SENDER_NAME;

      if (!apiKey || !senderEmail) {
        console.error('Brevo API key or sender email not configured');
        return false;
      }

      const emailHTML = this.generateBookingEmailHTML(bookingData, serviceDetails);

      const emailData = {
        sender: {
          name: senderName,
          email: senderEmail,
        },
        to: [{
          email: bookingData.email,
          name: bookingData.name,
        }],
        subject: `🎉 Your SpaFort Booking is Confirmed! - ${bookingData.bookingReference}`,
        htmlContent: emailHTML,
        tags: ['booking-confirmation', 'spafort'],
      };

      const response = await axios.post(this.baseURL, emailData, {
        headers: {
          'accept': 'application/json',
          'api-key': apiKey,
          'content-type': 'application/json',
        },
      });

      if (response.status === 201) {
        console.log('✅ Booking confirmation email sent successfully to:', bookingData.email);
        console.log('📧 Email details - Subject:', `🎉 Your SpaFort Booking is Confirmed! - ${bookingData.bookingReference}`);
        return true;
      } else {
        console.error('❌ Failed to send email - Status:', response.status);
        console.error('❌ Error response:', response.data);
        return false;
      }
    } catch (error) {
      console.error('Error sending booking confirmation email:', error.response?.data || error.message);
      return false;
    }
  }
}

export default new BrevoEmailService();
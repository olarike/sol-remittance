import sgMail from '@sendgrid/mail';
import twilio from 'twilio';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export class NotificationService {
  async sendEmail(to: string, subject: string, text: string, html?: string): Promise<void> {
    const msg = {
      to,
      from: 'your_email@example.com',
      subject,
      text,
      html,
    };
    await sgMail.send(msg);
  }

  async sendSMS(to: string, body: string): Promise<void> {
    await twilioClient.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
  }
}

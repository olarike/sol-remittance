import sgMail from '@sendgrid/mail';
import twilio from 'twilio';

const sendGridApiKey = process.env.SENDGRID_API_KEY;
if (!sendGridApiKey) {
  throw new Error('SENDGRID_API_KEY is not defined');
}
sgMail.setApiKey(sendGridApiKey);

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
  throw new Error('Twilio environment variables are not defined');
}

const twilioClient = twilio(twilioAccountSid, twilioAuthToken);

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
      from: twilioPhoneNumber,
      to,
    });
  }
}

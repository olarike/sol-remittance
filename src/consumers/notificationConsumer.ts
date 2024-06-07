import amqp from 'amqplib';
import { NotificationService } from '../services/notificationService';

const notificationService = new NotificationService();

const initNotificationConsumer = async () => {
  const rabbitmqUrl = process.env.RABBITMQ_URL;
  
  if (!rabbitmqUrl) {
    throw new Error('RABBITMQ_URL environment variable is not defined');
  }

  const connection = await amqp.connect(rabbitmqUrl);
  const channel = await connection.createChannel();
  await channel.assertQueue('notifications');

  channel.consume('notifications', async (msg) => {
    if (msg !== null) {
      const { to, subject, text, html } = JSON.parse(msg.content.toString());
      await notificationService.sendEmail(to, subject, text, html);
      channel.ack(msg);
    }
  });
};

initNotificationConsumer().catch(console.error);

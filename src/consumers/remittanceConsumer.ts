import amqp from 'amqplib';
import { RemittanceService } from '../services/remittanceService';

const remittanceService = new RemittanceService();

const initRemittanceConsumer = async () => {
  const rabbitmqUrl = process.env.RABBITMQ_URL;

  if (!rabbitmqUrl) {
    throw new Error('RABBITMQ_URL environment variable is not defined');
  }

  const connection = await amqp.connect(rabbitmqUrl);
  const channel = await connection.createChannel();
  await channel.assertQueue('remittances');

  channel.consume('remittances', async (msg) => {
    if (msg !== null) {
      try {
        const { accountDetails, amountUSD, user, idempotencyKey } = JSON.parse(msg.content.toString());
        await remittanceService.sendUSDToBank(accountDetails, amountUSD, user, idempotencyKey);
        channel.ack(msg);
      } catch (error) {
        console.error('Failed to process message', error);
        // Optionally, you can nack the message and requeue it
        channel.nack(msg, false, true);
      }
    }
  });
};

initRemittanceConsumer().catch(console.error);

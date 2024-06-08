import amqp from 'amqplib';

let channel: amqp.Channel;

const rabbitMqUrl = process.env.RABBITMQ_URL;
if (!rabbitMqUrl) {
  throw new Error('RABBITMQ_URL is not defined');
}

export const initRabbitMQ = async () => {
  const connection = await amqp.connect(rabbitMqUrl);
  channel = await connection.createChannel();
  await channel.assertQueue('notifications');
  await channel.assertQueue('remittances');
};

export const publishToQueue = async (queue: string, message: string) => {
  if (!channel) {
    await initRabbitMQ();
  }
  channel.sendToQueue(queue, Buffer.from(message));
};

export const closeConnection = async () => {
  await channel.close();
};

import amqp from 'amqplib';

let channel: amqp.Channel;

export const initRabbitMQ = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
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

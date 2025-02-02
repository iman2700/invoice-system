import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { connect, Channel, Connection } from 'amqplib';
import { EmailService } from './email/email.service';
 

@Injectable()
export class RabbitMQConsumerService implements OnModuleInit {
  private logger = new Logger(RabbitMQConsumerService.name);
  private connection: Connection;
  private channel: Channel;

  constructor(private readonly emailService: EmailService) {}

  async onModuleInit() {
    await this.connectAndConsume();
  }

  async connectAndConsume() {
    try {
      this.connection = await connect(process.env.RABBITMQ_URI);
      this.channel = await this.connection.createChannel();
      const queue = 'queue_Rabbit_MQ';
      await this.channel.assertQueue(queue, { durable: true });
      this.logger.log(`Connected to RabbitMQ. Waiting for messages in ${queue}.`);

      this.channel.consume(
        queue,
        async (msg) => {
          if (msg) {
            const content = msg.content.toString();
            this.logger.log(`Received message: ${content}`);
            const report = JSON.parse(content);

            
            await this.emailService.sendDailySalesReport(report);

           
            this.channel.ack(msg);
          }
        },
        { noAck: false },
      );
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ or consume messages', error);
    }
  }
}

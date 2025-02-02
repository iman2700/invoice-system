import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import {Cron, CronExpression} from '@nestjs/schedule';
import * as amqp from 'amqplib';
import { InvoicesService } from './invoices/invoices.service';
@Injectable()
export class RabbitMQService implements OnModuleInit {
    private logger = new Logger(RabbitMQService.name);
    private connection:amqp.Connection;
    
    private channel:amqp.Channel;

    constructor(private readonly invoicesService: InvoicesService) {}

    async onModuleInit() {
        await this.connectRabbitMQ();
    }

    async connectRabbitMQ() {
        
        try {
            this.connection = await amqp.connect(process.env.RABBITMQ_URI);
            this.channel = await this.connection.createChannel();
            this.logger.log('Successfully connected to RabbitMQ');
        } catch (error) {
            this.logger.error('Failed to connect to RabbitMQ', error);
        }
    }

     @Cron(CronExpression.EVERY_DAY_AT_NOON)  
    //@Cron('*/1 * * * *') // runs every 1 minute 
    async publishDailySalesReport() {
        try {
            if (!this.channel) {
                await this.connectRabbitMQ();
            }
            const { totalSales, itemsSummary } = await this.invoicesService.getTodaySales();
            const message = {
                date: new Date().toDateString(),
                totalSales,
                itemsSummary,
            };

            const queueName = 'queue_Rabbit_MQ';
            await this.channel.assertQueue(queueName, { durable: true });
            this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
                persistent: true,
            });
            this.logger.log(`Published daily sales report: ${JSON.stringify(message)}`);
        } catch (error) {
            this.logger.error('Error publishing daily sales report', error);
        }
    }
}
 z
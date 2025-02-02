import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQConsumerService } from './rabbitmq-consumer.service';
import {EmailService} from "./email/email.service";
 
@Module({
  imports: [ConfigModule.forRoot()],
  providers: [RabbitMQConsumerService, EmailService],
})
export class AppModule {}

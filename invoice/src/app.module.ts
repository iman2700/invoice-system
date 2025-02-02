import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { MongooseModule } from '@nestjs/mongoose';
import { InvoicesModule } from './invoices/invoices.module';
 
import {ConfigModule, ConfigService} from '@nestjs/config';
 
import {RabbitMQService} from "./rabbitmq.service";

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    InvoicesModule,
  ],
  providers: [RabbitMQService],
})
export class AppModule {}

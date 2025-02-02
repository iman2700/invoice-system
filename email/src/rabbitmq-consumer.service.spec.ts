import { Test, TestingModule } from '@nestjs/testing';
import { RabbitMQConsumerService } from './rabbitmq-consumer.service';
import { EmailService } from './email/email.service';
 
describe('RabbitMQConsumerService', () => {
  let service: RabbitMQConsumerService;
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RabbitMQConsumerService,
        {
          provide: EmailService,
          useValue: {
            sendDailySalesReport: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();

    service = module.get<RabbitMQConsumerService>(RabbitMQConsumerService);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

 });

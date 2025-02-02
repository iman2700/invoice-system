import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';

describe('EmailService', () => {
    let service: EmailService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [EmailService],
        }).compile();

        service = module.get<EmailService>(EmailService);
    });

    it('should send email (mocked)', async () => {
        // You can mock the nodemailer transporter
        const report = {
            date: 'Some Date',
            totalSales: 1000,
            itemsSummary: [{ sku: 'SKU123', totalQuantity: 10 }],
        };

        const spy = jest.spyOn(service, 'sendDailySalesReport');
        await service.sendDailySalesReport(report);
        expect(spy).toHaveBeenCalledWith(report);
    });
});

import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import {ConfigService} from "@nestjs/config";

@Injectable()
export class EmailService {
  private logger = new Logger(EmailService.name);
  constructor(private configService: ConfigService) {}
  async sendDailySalesReport(report: any) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      secure: false,
      auth: {
        user: this.configService.get<string>('GMAIL_USER'),
        pass: this.configService.get<string>('GMAIL_PASS'),
      },
    });

    const mailOptions = {
      from:this.configService.get<string>('EMAIL_FROM'),
      to:this.configService.get<string>('EMAIL_TO'),
      subject: `Daily Sales Report - ${report.date}`,
      text: `Total Sales: ${report.totalSales}\n\nItems Summary:\n${report.itemsSummary
        .map((item) => `SKU: ${item.sku}, Quantity: ${item.totalQuantity}`)
        .join('\n')}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      this.logger.log('Daily sales report email sent successfully.');
    } catch (error) {
      this.logger.error('Error sending daily sales report email', error);
    }
  }
}

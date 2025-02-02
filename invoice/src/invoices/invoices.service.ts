import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice, InvoiceDocument } from './invoice.schema';
@Injectable()
export class InvoicesService {
    constructor(
        @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
    ) {}

    async createInvoice(data: Partial<Invoice>): Promise<Invoice> {
        try {
            const invoice = await this.invoiceModel.create(data);
            return invoice;    
        }
        catch (e)
        {
            throw new NotFoundException(e.message);
        }
        
    }
    async getInvoiceById(id: string): Promise<Invoice> {
        const invoice = await this.invoiceModel.findById(id).exec();
        if (!invoice) {
            throw new NotFoundException(`Invoice with ID ${id} not found`);
        }
        return invoice;
    }

    async getAllInvoices(startDate?: string, endDate?: string): Promise<Invoice[]> {
        const filter: any = {};
        if (startDate && endDate) {
            filter.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }
        return this.invoiceModel.find(filter).exec();
    }

    async getTodaySales(): Promise<{
        totalSales: number;
        itemsSummary: { sku: string; totalQuantity: number }[];
    }> {
        
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const invoices = await this.invoiceModel.find({
            date: { $gte: startOfDay, $lte: endOfDay },
        });

        let totalSales = 0;
        const itemsMap: Record<string, number> = {};

        for (const invoice of invoices) {
            totalSales += (await invoice).amount;
            for (const item of (await invoice).items) {
                itemsMap[item.sku] = (itemsMap[item.sku] || 0) + item.qt;
            }
        }

        const itemsSummary = Object.entries(itemsMap).map(([sku, totalQuantity]) => ({
            sku,
            totalQuantity,
        }));

        return { totalSales, itemsSummary };
    }
}

// invoices.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvoicesService } from './invoices.service';
import { Invoice, InvoiceDocument } from './invoice.schema';
import { NotFoundException } from '@nestjs/common';

describe('InvoicesService', () => {
    let service: InvoicesService;
    let model: Model<InvoiceDocument>;

    const mockInvoice = {
        _id: 'mock_id',
        customer: 'Test Customer',
        amount: 100,
        reference: 'INV-001',
        items: [
            { sku: 'SKU1', qt: 2, price: 50 }
        ],
        date: new Date()
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                InvoicesService,
                {
                    provide: getModelToken(Invoice.name),
                    useValue: {
                        create: jest.fn().mockResolvedValue(mockInvoice),
                        findById: jest.fn(),
                        find: jest.fn(),
                        exec: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<InvoicesService>(InvoicesService);
        model = module.get<Model<InvoiceDocument>>(getModelToken(Invoice.name));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createInvoice', () => {
        it('should create and return an invoice', async () => {
            const createInvoiceDto = {
                customer: 'Test Customer',
                
                reference: "CRON-9921",
                amount: 100,
                items: [{ sku: 'SKU1', qt: 2, price: 50 }]
            };

            const result = await service.createInvoice(createInvoiceDto);
            expect(result).toEqual(mockInvoice);
            expect(model.create).toHaveBeenCalledWith(createInvoiceDto);
        });
    });

    describe('getInvoiceById', () => {
        it('should return an invoice when found', async () => {
            jest.spyOn(model, 'findById').mockReturnValue({
                exec: jest.fn().mockResolvedValueOnce(mockInvoice),
            } as any);

            const result = await service.getInvoiceById('mock_id');
            expect(result).toEqual(mockInvoice);
        });

        it('should throw NotFoundException when invoice not found', async () => {
            jest.spyOn(model, 'findById').mockReturnValue({
                exec: jest.fn().mockResolvedValueOnce(null),
            } as any);

            await expect(service.getInvoiceById('nonexistent_id'))
                .rejects
                .toThrow(NotFoundException);
        });
    });

    describe('getAllInvoices', () => {
        it('should return all invoices when no dates provided', async () => {
            const mockInvoices = [mockInvoice];
            jest.spyOn(model, 'find').mockReturnValue({
                exec: jest.fn().mockResolvedValueOnce(mockInvoices),
            } as any);

            const result = await service.getAllInvoices();
            expect(result).toEqual(mockInvoices);
            expect(model.find).toHaveBeenCalledWith({});
        });

        it('should filter by date range when dates provided', async () => {
            const startDate = '2023-01-01';
            const endDate = '2023-01-31';
            const mockInvoices = [mockInvoice];

            jest.spyOn(model, 'find').mockReturnValue({
                exec: jest.fn().mockResolvedValueOnce(mockInvoices),
            } as any);

            const result = await service.getAllInvoices(startDate, endDate);
            expect(result).toEqual(mockInvoices);
            expect(model.find).toHaveBeenCalledWith({
                date: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                },
            });
        });
    });

    describe('getTodaySales', () => {
        it('should return today\'s sales summary', async () => {
            const mockInvoices = [mockInvoice];
            jest.spyOn(model, 'find').mockResolvedValueOnce(mockInvoices);

            const result = await service.getTodaySales();
            expect(result).toEqual({
                totalSales: 100,
                itemsSummary: [
                    { sku: 'SKU1', totalQuantity: 2 }
                ]
            });
        });
    });
});
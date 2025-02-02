import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import {Test} from "@nestjs/testing";
import {AppModule} from "../src/app.module";
 

describe('InvoicesController (Integration Tests)', () => {
    let app: INestApplication;
    let server;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        server = app.getHttpAdapter().getInstance();
    });

 

    it('should create a new invoice', async () => {
         
        const randomNumber = Math.floor(Math.random() * 1000);

         
        const newInvoice = {
           
            customer: 'Test Customer',
            reference: randomNumber,
            items: [{ sku: 'item1', qt: 2, price: 10 }],
            amount: 20,
            date: new Date(),
        };
        const res = await request(server).post('/invoices').send(newInvoice);
        expect(res.status).toBe(201);  
        
        expect(res.body.customer).toBe(newInvoice.customer);
        expect(res.body.amount).toBe(newInvoice.amount);

    });


    it('should get an invoice by ID', async () => {
        const randomNumber = Math.floor(Math.random() * 1000);
       
        const newInvoice = 
            { customer: 'Test Customer 2',
                items: [{ sku: 'item2', qt: 1, price: 5 }],
                amount: 5,
                reference: randomNumber,
                date: new Date() };
        const createRes = await request(server).post('/invoices').send(newInvoice);
        const invoiceId = createRes.body._id;  

        const res = await request(server).get(`/invoices/${invoiceId}`);
        expect(res.status).toBe(200);
        expect(res.body._id).toBe(invoiceId);  
    });


    it('should get all invoices', async () => {
        const res = await request(server).get('/invoices');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });


    it('should get all invoices with date filters', async () => {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 1);  
        const endDate = new Date();
        const randomNumber = Math.floor(Math.random() * 1000);
         
        const invoiceWithinRange = 
            { customer: 'sange',
                reference: randomNumber,
                items: [{ sku: 'item3', qt: 3, price: 2 }],
                amount: 6, date: new Date() };
        await request(server).post('/invoices').send(invoiceWithinRange);

        const res = await request(server)
            .get('/invoices')
            .query({ startDate: startDate.toISOString().slice(0, 10), endDate: endDate.toISOString().slice(0, 10) });

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
     });
    it('should return 404 if invoice is not found', async () => {
        const nonExistentId = '507f1f77bcf86cd799439011';  

        await request(app.getHttpServer())
            .get(`/invoices/${nonExistentId}`)
            .expect(404);
    });
   
 
 });

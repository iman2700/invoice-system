import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { InvoicesService } from './invoices.service';
 
import {CreateInvoiceDto, InvoicesDto} from "./Invoices.dto";
import {Invoice} from "./invoice.schema";
 

@ApiTags('Invoices')  
@Controller('invoices')
export class InvoicesController {
    constructor(private readonly invoicesService: InvoicesService) {}

    @ApiOperation({ summary: 'Create a new invoice' })
    @ApiBody({
        description: 'Invoice creation payload',
        type: CreateInvoiceDto,  
    })
    @Post()
    async createInvoice(@Body() body: Partial<Invoice>): Promise<Invoice> {
        return await this.invoicesService.createInvoice(body);
    }

    @ApiOperation({ summary: 'Get an invoice by ID' })
    @ApiParam({ name: 'id', description: 'The ID of the invoice to retrieve' })
    @Get(':id')
    async getInvoiceById(@Param('id') id: string): Promise<Invoice> {
        return await this.invoicesService.getInvoiceById(id);
    }

    @ApiOperation({ summary: 'Get all invoices with optional date filters' })
    @ApiQuery({ name: 'startDate', required: false, description: 'Start date (YYYY-MM-DD)' })
    @ApiQuery({ name: 'endDate', required: false, description: 'End date (YYYY-MM-DD)' })
    @Get()
    async getAllInvoices(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ): Promise<Invoice[]> {
        return await this.invoicesService.getAllInvoices(startDate, endDate);
    }
}

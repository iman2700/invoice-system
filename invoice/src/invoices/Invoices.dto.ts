import { ApiProperty } from '@nestjs/swagger';

export class InvoicesDto {
    @ApiProperty({ example: 'SKU123', description: 'Stock Keeping Unit' })
    sku: string;

    @ApiProperty({ example: 2, description: 'Quantity of the item' })
    qt: number;
}

export class CreateInvoiceDto {
    @ApiProperty({ example: 'Test User', description: 'Customer name' })
    customer: string;

    @ApiProperty({ example: 100, description: 'Total amount of the invoice' })
    amount: number;

    @ApiProperty({ example: 'INV-101', description: 'Invoice reference code' })
    reference: string;

    @ApiProperty({ example: '2025-01-26T10:00:00.000Z', description: 'Invoice date' })
    date: Date;

    @ApiProperty({ type: [InvoicesDto], description: 'List of items in the invoice' })
    items: InvoicesDto[];
}
import { format } from 'date-fns';

export type TypeFilename = 'transactions' | 'orders' | 'customers' | 'products' | 'merchants';

const headers = {
  transactions: [
    'Sr No.',
    'Txn date',
    'Txn ID',
    'Order ID',
    'Customer ID',
    'Customer Name',
    'Product ID',
    'Product Name',
    'Status',
  ],
  orders: [
    'Sr No.',
    'Order ID',
    'Order Date',
    'Product',
    'Quantity',
    'Customer Name',
    'Total Amount',
    'Installments',
    'Payment Link',
    'Status',
  ],
  customers: ['Sr No.', 'Customer ID', 'Date Added', 'Customer Name', 'Email', 'Phone', 'Address'],
  products: ['Sr No.', 'Product ID', 'Date Added', 'Product Name', 'Price', 'Category', 'Description'],
  merchants: ['Sr No.', 'Merchant ID', 'Date Added', 'Merchant Name', 'Email', 'Phone', 'Address', 'Status'],
};

function convertToCSV(data: any, type: TypeFilename): string {
  let rows: string[];

  switch (type) {
    case 'transactions':
      rows = data.map((row: any, index: number) => [
        index + 1,
        format(new Date(row.created_at), 'Pp'),
        row.stripe_id,
        row.order_id,
        row.customer_id,
        row.customer_name,
        row.product_id,
        row.product_name,
        row.status,
      ]);
      break;

    case 'orders':
      rows = data.map((row: any, index: number) => [
        index + 1,
        row.id,
        format(new Date(row.created_at), 'Pp'),
        row.products.product_name,
        row.quantity,
        row.customers.customer_name,
        `${row.currency} ${Number(row.price) * row.quantity}`,
        row.period ?? '-',
        `${process.env.NEXT_PUBLIC_APP_URL}/payment/${row.id}`,
        row.status,
      ]);
      break;

    case 'customers':
      rows = data.map((row: any, index: number) => [
        index + 1,
        row.customer_id,
        format(new Date(row.created_at), 'MMM dd, yyyy'),
        row.customers.customer_name,
        row.customers.email || '-',
        row.customers.phone || '-',
        row.customers.address,
      ]);
      break;

    case 'products':
      rows = data.map((row: any, index: number) => [
        index + 1,
        row.id,
        format(new Date(row.created_at), 'MMM dd, yyyy'),
        row.product_name,
        `${row.currency} ${row.price}`,
        row.category,
        row.remarks,
      ]);
      break;

    case 'merchants':
      rows = data.map((row: any, index: number) => [
        index + 1,
        row.merchant_id,
        format(new Date(row.onboarded_at), 'MMM dd, yyyy'),
        row.merchant_name,
        row.email || '-',
        row.phone || '-',
        row.address || '-',
        row.status,
      ]);
      break;

    default:
      throw new Error(`Unsupported table type: ${type}`);
  }

  const csvRows = [
    headers[type].join(','),
    ...rows.map((row) => (row as any).map((value: any) => JSON.stringify(value)).join(',')),
  ];

  return csvRows.join('\n');
}

export const downloadCSV = (data: any, fileName: TypeFilename) => {
  try {
    const csvData = convertToCSV(data, fileName);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${fileName}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error downloading CSV', error);
  }
};

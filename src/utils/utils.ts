import { toast } from '@/components/ui/use-toast';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// This utility function combines and deduplicates class names using clsx and twMerge.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This utility function combines and deduplicates class names using clsx and twMerge.
export const errorToast = (description: string, title?: string) =>
  toast({ title, description, variant: 'destructive' });

export const handleCopyPaymentLink = (paymentLink: string) => {
  navigator.clipboard
    .writeText(paymentLink)
    .then(() => {
      toast({ description: 'Payment Link copied to clipboard!' });
    })
    .catch((err) => {
      console.error(err);
      errorToast('Could not copy the payment link', `${err}`);
    });
};

export const extractFileNameFromUrl = (url: string, userId: string) => {
  const decodedUrl = decodeURIComponent(url);
  const parts = decodedUrl.split('/');
  const fileNameWithUserId = parts[parts.length - 1];
  const fileName = fileNameWithUserId.replace(`${userId}-`, '');
  return fileName;
};

const flattenObject = (obj: Record<string, any>, prefix = ''): Record<string, any> => {
  return Object.keys(obj).reduce<Record<string, any>>((acc, k) => {
    const pre = prefix.length ? prefix + '.' : '';
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      Object.assign(acc, flattenObject(obj[k], pre + k));
    } else {
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {});
};

const getDefaultHeaderMapping = (): { [key: string]: string } => ({
  created_at: 'Created At',
  customer_id: 'Customer ID',
  'customers.phone': 'Phone',
  'customers.email': 'Email',
  'customers.customer_name': 'Customer Name',
  'customers.address': 'Address',
  price: 'Price',
  quantity: 'Quantity',
  currency: 'Currency',
  tsx_id: 'Txn ID',
  customer_name: 'Customer Name',
  category: 'Category',
  remarks: 'Description',
  period: 'Installments',
});

const getFileSpecificHeaderMapping = (fileName: string): { [key: string]: string } => {
  switch (fileName) {
    case 'products':
      return {
        id: 'Product ID',
        product_name: 'Product Name',
      };
    case 'orders':
      return {
        id: 'Order ID',
        status: 'Status',
        'products.product_name': 'Product',
      };
    case 'customers':
      return {};
    case 'transactions':
      return {
        'product.product_name': 'Product',
      };
    default:
      return {};
  }
};

const filterHeaders = (header: string, fileName: string): boolean => {
  let excludedFields: string[] = [];

  switch (fileName) {
    case 'products':
      excludedFields = ['status', 'product_id'];
      break;
    case 'orders':
      excludedFields = ['product_id'];
      break;
    case 'customers':
      excludedFields = ['id'];
      break;
    case 'transactions':
      excludedFields = ['stripe_id', 'merchant_id'];
      break;
    default:
      excludedFields = [];
  }

  const commonExclusions = [
    'user_id',
    'stripe_id',
    'merchant_id',
    'customers.id',
    'customers.user_id',
    'customers.stripe_id',
    'next_instalment_date',
    'end_instalment_date',
    'paid_amount',
    'installments_options',
    'stripe_cus_id',
  ];

  excludedFields = [...commonExclusions, ...excludedFields];

  return !excludedFields.some((field) => header === field || header.endsWith(`.${field}`));
};

const convertToCSV = (data: Record<string, any>[], fileName: string) => {
  const defaultHeaderMapping = getDefaultHeaderMapping();
  const fileSpecificHeaderMapping = getFileSpecificHeaderMapping(fileName);
  const headerMapping = { ...defaultHeaderMapping, ...fileSpecificHeaderMapping };

  // Flatten all objects in the data array
  const flattenedData = data.map((item) => flattenObject(item));

  // Determine headers based on headerMapping
  const headers = [
    'Sr No.',
    ...Array.from(
      new Set(
        flattenedData.flatMap((item) => Object.keys(item).filter((header) => filterHeaders(header, fileName)))
      )
    ).map((header) => headerMapping[header] || header),
  ];

  // Map rows and include 'SR No.' as the first column
  const csvRows = flattenedData.map((row, index) =>
    [
      index + 1,
      ...headers.slice(1).map((header) => {
        // Find the original key corresponding to the header
        const originalKey = Object.keys(headerMapping).find((key) => headerMapping[key] === header) || header;
        return JSON.stringify(row[originalKey] ?? '');
      }),
    ].join(',')
  );

  return [headers.join(','), ...csvRows].join('\r\n');
};

export const downloadCSV = (data: Record<string, any>[], fileName: string) => {
  try {
    const csvData = convertToCSV(data, fileName);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', fileName ?? 'download.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.log('Error downloading CSV', error);
  }
};

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
}

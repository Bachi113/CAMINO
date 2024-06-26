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

export const extractFileNameFromUrl = (url: string, userId: string) => {
  const decodedUrl = decodeURIComponent(url);
  const parts = decodedUrl.split('/');
  const fileNameWithUserId = parts[parts.length - 1];
  const fileName = fileNameWithUserId.replace(`${userId}-`, '');
  return fileName;
};

const headerMapping: { [key: string]: string } = {
  created_at: 'Created At',
  customer_id: 'Customer ID',
  order_id: 'Order ID',
  'customers.email': 'Email',
  'customers.customer_name': 'Name',
  'customers.phone': 'Number',
  'customers.address': 'Address',
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

const convertToCSV = (data: Record<string, any>[]) => {
  // Flatten all objects in the data array
  const flattenedData = data.map((item) => flattenObject(item));

  // Function to filter out unwanted headers
  const filterHeaders = (header: string) => {
    const excludedFields = [
      'id',
      'user_id',
      'stripe_id',
      'merchant_id',
      'customer.id',
      'customer.stripe_id',
      'customers.user_id',
      'customers.stripe_id',
      'customers.email',
      'customers.customer_name',
      'customers.created_at',
    ];

    return !excludedFields.some((field) => header === field || header.endsWith(`.${field}`));
  };

  // Determine headers based on headerMapping
  const headers = [
    'SR No.',
    ...Array.from(new Set(flattenedData.flatMap((item) => Object.keys(item).filter(filterHeaders)))).map(
      (header) => headerMapping[header] || header
    ),
  ];

  // Map rows and include 'SR No.' as the first column
  const csvRows = flattenedData.map((row, index) =>
    [
      index + 1,
      ...headers.slice(1).map((header) => {
        // Find the original key corresponding to the header
        const originalKey = Object.keys(headerMapping).find((key) => headerMapping[key] === header) || header;
        return JSON.stringify(row[originalKey] ?? '', replacer);
      }),
    ].join(',')
  );

  return [headers.join(','), ...csvRows].join('\r\n');
};

const replacer = (_key: string, value: any) => {
  if (typeof value === 'string') {
    return value.replace(/"/g, '""');
  }
  return value;
};

export const downloadCSV = (data: Record<string, any>[], fileName: string) => {
  try {
    const csvData = convertToCSV(data);
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

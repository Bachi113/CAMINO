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

const replacer = (key: string, value: any) => {
  if (value === null) {
    return '';
  }
  return value;
};

const headerMapping: { [key: string]: string } = {
  created_at: 'Created At',
  customer_d: 'Customer ID',
  order_id: 'Order ID',
  email: 'Email',
  phone: 'Phone',
  customer_name: 'Customer name',
  address: 'Address',
};

const convertToCSV = (data: Record<string, any>[]) => {
  // Determine headers based on headerMapping and include 'SR No.' as the first header
  const headers = [
    'SR No.',
    ...Object.keys(data[0])
      .filter((header) => header !== 'id' && header !== 'user_id' && header !== 'stripe_id')
      .map((header) => headerMapping[header] || header),
  ];

  // Map rows and include 'SR No.' as the first column
  const csvRows = data.map((row, index) =>
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

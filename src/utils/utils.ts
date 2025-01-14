import { toast } from '@/components/ui/use-toast';
import { TypeInterval } from '@/types/types';
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

export const getInstallmentDates = (startDate: Date, installments: number, interval: TypeInterval) => {
  const dates = [];
  const currentDate = new Date(startDate);

  for (let i = 0; i < installments; i++) {
    if (i === 0) {
      dates.push(currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
    } else {
      switch (interval) {
        case 'day':
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case 'week':
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case 'month':
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        case 'year':
          currentDate.setFullYear(currentDate.getFullYear() + 1);
          break;
      }
      dates.push(currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
    }
  }

  return dates;
};

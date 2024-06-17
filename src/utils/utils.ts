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

export const extractFileNameFromUrl = (url: string) => {
  const decodedUrl = decodeURIComponent(url);
  const parts = decodedUrl.split('/');
  const fileNameWithTimestamp = parts[parts.length - 1];
  const fileNameParts = fileNameWithTimestamp.split('-');
  const fileName = fileNameParts.slice(1).join('-');
  return fileName;
};

'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { DownloadIcon } from '@radix-ui/react-icons';
import { downloadCSV, errorToast } from '@/utils/utils';

interface DownloadButtonProps {
  data?: Record<string, any>[];
  fileName: string;
}

const DownloadButton = ({ data, fileName }: DownloadButtonProps) => {
  const handleDownload = () => {
    if (!data || data.length === 0) {
      return errorToast('No data to download');
    }
    downloadCSV(data, fileName);
  };

  return (
    <Button className='flex gap-2' onClick={handleDownload}>
      Download Csv <DownloadIcon />
    </Button>
  );
};

export default DownloadButton;

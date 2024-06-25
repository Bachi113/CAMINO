'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { downloadCSV, errorToast } from '@/utils/utils';
import DownloadIcon from '@/assets/icons/DownloadIcon';

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
    <Button className='flex gap-2 h-10 rounded-sm' onClick={handleDownload}>
      <DownloadIcon /> Download Csv
    </Button>
  );
};

export default DownloadButton;

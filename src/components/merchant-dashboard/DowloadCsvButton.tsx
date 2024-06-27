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
    <Button className='flex gap-2 px-2.5 leading-[15px] rounded-md' size='lg' onClick={handleDownload}>
      <DownloadIcon /> Download as CSV
    </Button>
  );
};

export default DownloadButton;

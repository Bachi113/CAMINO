import { FC } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LuCalendarDays } from 'react-icons/lu';
import { getInstallmentDates } from '@/utils/utils';
import { TypeInterval } from '@/types/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

interface ModalAllPaymentDatesProps {
  period: number;
  interval: TypeInterval;
  amount: string;
}

const ModalAllPaymentDates: FC<ModalAllPaymentDatesProps> = ({ period, interval, amount }) => {
  const installmentDates = getInstallmentDates(new Date(), period, interval);

  return (
    <Dialog>
      <DialogTrigger className='max-w-max text-xs font-medium text-black/40 m-1 underline'>
        View More
      </DialogTrigger>

      <DialogContent className='w-11/12 md:w-1/4'>
        <DialogHeader className='mb-4'>
          <DialogTitle>Installment Terms</DialogTitle>
        </DialogHeader>

        <div className='p-4 space-y-6 bg-gray-100 rounded-md'>
          <div className='space-y-1'>
            <p className='text-sm font-semibold'>Installment Amount</p>
            <p>{amount}</p>
          </div>

          <div>
            <p className='text-sm font-semibold mb-2'>Payment Dates</p>

            <div className='max-h-96 overflow-auto space-y-2'>
              {installmentDates.map((date, index) => (
                <Card key={index} className='grow shadow-none'>
                  <CardContent className='flex items-center gap-2 px-4 py-2'>
                    <LuCalendarDays className='text-primary' />
                    <p className='text-sm'>{date}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAllPaymentDates;

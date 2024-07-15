import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { TypeMerchantDetails } from '@/types/types';
import InputWrapper from '@/components/InputWrapper';
import { Input } from '@/components/ui/input';
import { formatAddress, formatName } from './Columns';
import { format } from 'date-fns';

interface MerchantDetailsProps {
  data: TypeMerchantDetails;
  handleSheetOpen: () => void;
}

const MerchantDetails = ({ data, handleSheetOpen }: MerchantDetailsProps) => {
  const dataToDisplay = data && [
    {
      label: 'Merchant Onboarded On',
      value: format(new Date(data.onboarded_at!), 'Pp'),
    },
    {
      label: 'Merchant Name',
      value: formatName(data.personal_informations),
    },
    {
      label: 'Location',
      value: data.business_addresses?.city,
    },
    {
      label: 'Address',
      value: formatAddress(data.business_addresses),
    },
    {
      label: 'Bank Account Number',
      value: data.bank_details?.account_number,
    },
    {
      label: 'Swift Code',
      value: data.bank_details?.swift_code,
    },
    {
      label: 'IBAN Code',
      value: data.bank_details?.iban_code,
    },
  ];

  return (
    <Sheet open={!!data} onOpenChange={handleSheetOpen}>
      <SheetContent className='flex flex-col justify-between'>
        <div>
          <SheetHeader className='text-sm font-medium mb-6'>
            <div className='space-y-1'>
              <SheetTitle className='text-secondary'>Merchant Details</SheetTitle>
              <p className='font-normal text-base'>
                Merchant ID: <span className='font-bold'>{data.personal_informations?.id}</span>
              </p>
            </div>
          </SheetHeader>

          <div className='space-y-4'>
            <div className='space-y-4'>
              {dataToDisplay.map((item, index) => (
                <InputWrapper key={index} label={item.label}>
                  <Input disabled={true} value={item.value || '-'} className='h-11' />
                </InputWrapper>
              ))}
            </div>
          </div>
        </div>

        {/* <SheetFooter>
          <Button className='w-full h-11'>Contact Merchant</Button>
        </SheetFooter> */}
      </SheetContent>
    </Sheet>
  );
};

export default MerchantDetails;

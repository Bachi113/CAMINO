import { useEffect, useState, useRef, FC } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { cn, errorToast } from '@/utils/utils';
import ModalSubmitConfirmation from './ModalSubmitConfirmation';
import InputWrapper from '@/components/InputWrapper';
import { Input } from '@/components/ui/input';
import { getUser } from '@/utils/get-user';
import { supabaseBrowserClient } from '@/utils/supabase/client';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';

type ModalOnboardingSummaryProps = {
  isSubmitSuccessful: boolean;
};

const sidebarItems = [
  { id: 'personal-information', label: 'Personal Information' },
  { id: 'basic-business-details', label: 'Basic Business Details' },
  { id: 'business-address', label: 'Business Address' },
  { id: 'business-information', label: 'Business Information' },
  { id: 'bank-account-details', label: 'Bank Account Details' },
  { id: 'document-verification', label: 'Document Verification' },
];

const ModalOnboardingSummary: FC<ModalOnboardingSummaryProps> = ({ isSubmitSuccessful }) => {
  const supabase = supabaseBrowserClient();

  const [selectedItem, setSelectedItem] = useState(sidebarItems[0].label);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(isSubmitSuccessful);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const fetchPersonalInformation = async () => {
      setLoading(true);
      const user = await getUser();
      try {
        const { data, error } = await supabase
          .from('onboarding')
          .select(
            `*,
              personal_informations (*),
              business_details (*),
              business_addresses (*),
              business_informations (*),
              bank_details (*),
              documents (*)
            `
          )
          .eq('user_id', user?.id!)
          .single();

        setData(data);

        if (error) {
          errorToast('Error fetching information');
          console.error('Error fetching information:', error);
        }
      } catch (error) {
        errorToast('Error fetching information');
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalInformation();
  }, [supabase]);

  return (
    <Dialog open={isOpen}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Review Your Information</DialogTitle>
          <DialogDescription>Please check the details below before submitting the form</DialogDescription>
        </DialogHeader>
        <div className='flex gap-8'>
          <div className='w-5/12 sticky top-0 h-[calc(100vh-200px)]'>
            {sidebarItems.map((item) => (
              <div
                key={item.id}
                className={cn(
                  'flex items-center text-sm gap-4 px-4 py-2 text-default font-semibold leading-6 cursor-pointer rounded-lg',
                  { 'bg-primary/10 text-primary': selectedItem === item.label }
                )}
                onClick={() => {
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                  setSelectedItem(item.label);
                }}>
                <p>{item.label}</p>
              </div>
            ))}
          </div>
          <div className='p-4 w-7/12 max-h-[calc(100vh-200px)] overflow-y-auto content-div'>
            {loading ? (
              <div className='flex flex-col items-center justify-center gap-3 h-60'>
                <AiOutlineLoading3Quarters className='size-6 animate-spin' />
              </div>
            ) : (
              <div className='space-y-6'>
                <div
                  id='personal-information'
                  ref={(el) => {
                    sectionRefs.current[0] = el;
                  }}
                  className='space-y-4'>
                  <InputWrapper label='First name' required>
                    <Input
                      type='text'
                      placeholder='First name'
                      id='firstName'
                      value={data?.personal_informations.first_name}
                    />
                  </InputWrapper>
                  <InputWrapper label='Last name' required>
                    <Input
                      type='text'
                      placeholder='Last name'
                      id='lastName'
                      value={data?.personal_informations.last_name}
                    />
                  </InputWrapper>
                  <InputWrapper label='Email address' required>
                    <Input
                      type='email'
                      placeholder='Email address'
                      id='email'
                      value={data?.personal_informations.email}
                    />
                  </InputWrapper>
                  <InputWrapper label='Phone Number' required>
                    <Input
                      type='text'
                      placeholder='Phone Number'
                      id='phone'
                      value={data?.personal_informations.phone}
                    />
                  </InputWrapper>
                </div>
                <Separator />

                <div
                  id='basic-business-details'
                  ref={(el) => {
                    sectionRefs.current[1] = el;
                  }}
                  className='space-y-4'>
                  <InputWrapper label='Business Name' required>
                    <Input
                      type='text'
                      placeholder='Name of your business'
                      id='businessName'
                      value={data?.business_details.business_name}
                    />
                  </InputWrapper>
                  <InputWrapper label='Business type' required>
                    <Input
                      type='text'
                      placeholder='Select Company type'
                      id='businessType'
                      value={data?.business_details.business_type}
                    />
                  </InputWrapper>
                  <InputWrapper label='Registration type' required>
                    <Input
                      type='text'
                      placeholder='Select Registration type'
                      id='registrationType'
                      value={data?.business_details.registration_type}
                    />
                  </InputWrapper>
                  <InputWrapper label='VAT Registration number' required>
                    <Input
                      type='text'
                      placeholder='Enter Registration eg: GB123456789'
                      id='vatRegistrationNumber'
                      value={data?.business_details.vat_registration_number}
                    />
                  </InputWrapper>
                </div>

                <Separator />

                <div
                  id='business-address'
                  ref={(el) => {
                    sectionRefs.current[2] = el;
                  }}
                  className='space-y-4'>
                  <InputWrapper label='Street Address' required>
                    <Input
                      type='text'
                      placeholder='Street Address'
                      id='streetAddress'
                      value={data?.business_addresses.street_address}
                    />
                  </InputWrapper>
                  <InputWrapper label='City' required>
                    <Input type='text' placeholder='City' id='city' value={data?.business_addresses.city} />
                  </InputWrapper>
                  <InputWrapper label='Postal Code' required>
                    <Input
                      type='text'
                      placeholder='Postal Code'
                      id='postalCode'
                      value={data?.business_addresses.postal_code}
                    />
                  </InputWrapper>
                  <InputWrapper label='Country' required>
                    <Input
                      type='text'
                      placeholder='Country'
                      id='country'
                      value={data?.business_addresses.country}
                    />
                  </InputWrapper>
                  <InputWrapper label='Business Phone Number' required>
                    <Input
                      type='text'
                      placeholder='Business Phone Number'
                      id='phoneNumber'
                      value={data?.business_addresses.phone_number}
                    />
                  </InputWrapper>
                </div>

                <Separator />

                <div
                  id='business-information'
                  ref={(el) => {
                    sectionRefs.current[3] = el;
                  }}
                  className='space-y-4'>
                  <InputWrapper label='Where are your target customers' required>
                    <div className='space-y-2 mt-2'>
                      <div className='flex items-center gap-2.5'>
                        <Checkbox
                          id='insideUk'
                          value='Inside UK'
                          checked={data?.business_informations.inside_uk}
                        />
                        <label htmlFor='insideUk' className='text-sm text-muted-foreground'>
                          Inside UK
                        </label>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Checkbox id='outsideUk' checked={data?.business_informations.outside_uk} />
                        <label htmlFor='outsideUk' className='text-sm text-muted-foreground'>
                          Outside UK
                        </label>
                      </div>
                    </div>
                  </InputWrapper>
                  <InputWrapper label='How do you deliver your goods/services?' required>
                    <div className='space-y-2 mt-2'>
                      <div className='flex items-center gap-2.5'>
                        <Checkbox id='courierCompany' checked={data?.business_informations.courier_company} />
                        <label htmlFor='courierCompany' className='text-sm text-muted-foreground'>
                          Courier company (e.g. TCS, Leopard)
                        </label>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Checkbox id='selfDelivery' checked={data?.business_informations.self_delivery} />
                        <label htmlFor='selfDelivery' className='text-sm text-muted-foreground'>
                          Self Delivery (e.g. Glovo)
                        </label>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Checkbox id='onlineService' checked={data?.business_informations.online_service} />
                        <label htmlFor='onlineService' className='text-sm text-muted-foreground'>
                          Online Services - no delivery required
                        </label>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Checkbox
                          id='other'
                          value='Other'
                          checked={data?.business_informations.other?.length > 1 ? true : false}
                        />
                        <label htmlFor='other' className='text-sm text-muted-foreground'>
                          Other
                        </label>
                      </div>

                      {data?.business_informations.other && (
                        <Input
                          value={data.business_informations.other}
                          placeholder='Other...'
                          className='mt-3'
                        />
                      )}
                    </div>
                  </InputWrapper>
                </div>

                <Separator />

                <div
                  id='bank-account-details'
                  ref={(el) => {
                    sectionRefs.current[4] = el;
                  }}
                  className='space-y-4'>
                  <InputWrapper label='Bank Name' required>
                    <Input
                      type='text'
                      placeholder='Find and select the bank'
                      value={data?.bank_details.bank_name}
                    />
                  </InputWrapper>
                  <InputWrapper label='Bank Account Number' required>
                    <Input
                      type='text'
                      placeholder='Account number'
                      value={data?.bank_details.account_number}
                    />
                  </InputWrapper>
                  <InputWrapper label='Sort Code' required>
                    <Input
                      type='text'
                      placeholder='Sort Code'
                      id='sortCode'
                      value={data?.bank_details.sort_code}
                    />
                  </InputWrapper>
                  <InputWrapper label='IBAN Code'>
                    <Input
                      type='text'
                      placeholder='IBAN Code'
                      id='ibanNumber'
                      value={data?.bank_details?.iban_code}
                    />
                  </InputWrapper>
                  <InputWrapper label='Swift Code'>
                    <Input
                      type='text'
                      placeholder='Swift Code'
                      id='swiftCode'
                      value={data?.bank_details?.swift_code}
                    />
                  </InputWrapper>
                  <InputWrapper label='Purchasing Currency' required>
                    <Input
                      type='text'
                      placeholder='GBP'
                      id='purchasingCurrency'
                      value={data?.bank_details.purchasing_currency}
                    />
                  </InputWrapper>
                </div>

                <Separator />

                <div
                  id='document-verification'
                  ref={(el) => {
                    sectionRefs.current[5] = el;
                  }}
                  className='space-y-4'>
                  <InputWrapper label='VAT Number' required>
                    <Input
                      type='text'
                      placeholder='VAT Number'
                      id='vatNumber'
                      value={data?.documents.vat_number}
                    />
                  </InputWrapper>
                  <InputWrapper label='How long have you been involved in business' required>
                    <Input
                      type='text'
                      placeholder='2 to 5 years'
                      id='howLongYouInvolved'
                      value={data?.documents.experience}
                    />
                  </InputWrapper>
                  <div>
                    <label className='text-sm leading-none mb-2'>Upload the business documents</label>

                    <div className='flex items-center justify-between text-base'>
                      <p>Document type</p>
                      {data?.documents.document_urls[0].name}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <div className='flex gap-4 w-full'>
            <DialogClose asChild>
              <Button variant='outline' className='w-full' onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
            </DialogClose>
            <ModalSubmitConfirmation />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalOnboardingSummary;

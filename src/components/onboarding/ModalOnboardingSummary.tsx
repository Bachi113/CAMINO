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
import { Button } from '@/components/ui/button';
import { cn, errorToast, extractFileNameFromUrl } from '@/utils/utils';
import ModalSubmitConfirmation from './ModalSubmitConfirmation';
import InputWrapper from '@/components/InputWrapper';
import { Input } from '@/components/ui/input';
import { getUser } from '@/utils/get-user';
import { supabaseBrowserClient } from '@/utils/supabase/client';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { Separator } from '@/components/ui/separator';
import { type } from 'os';

type ModalOnboardingSummaryProps = {
  isSubmitSuccessful: boolean;
  setShowModal: (value: boolean) => void;
};

const sidebarItems = [
  { id: 'personal-information', label: 'Personal Information' },
  { id: 'basic-business-details', label: 'Basic Business Details' },
  { id: 'business-address', label: 'Business Address' },
  { id: 'business-information', label: 'Business Information' },
  { id: 'bank-account-details', label: 'Bank Account Details' },
  { id: 'document-verification', label: 'Document Verification' },
];

const ModalOnboardingSummary: FC<ModalOnboardingSummaryProps> = ({ isSubmitSuccessful, setShowModal }) => {
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
        const userId = user?.id;
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
          .eq('user_id', userId!)
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

  const renderInputs = (
    inputs: { label: string; id: string; type: string; value: string; required?: boolean }[]
  ) => {
    return inputs.map(({ label, id, type, value, required }) => (
      <InputWrapper label={label} required={required} key={id}>
        <Input type={type} placeholder={label} id={id} value={value} />
      </InputWrapper>
    ));
  };

  const sections = [
    {
      id: 'personal-information',
      title: 'Personal Information',
      inputs: [
        {
          label: 'First name',
          id: 'firstName',
          type: 'text',
          value: data?.personal_informations.first_name,
          required: true,
        },
        {
          label: 'Last name',
          id: 'lastName',
          type: 'text',
          value: data?.personal_informations.last_name,
          required: true,
        },
        {
          label: 'Email address',
          id: 'email',
          type: 'email',
          value: data?.personal_informations.email,
          required: true,
        },
        {
          label: 'Phone Number',
          id: 'phone',
          type: 'text',
          value: data?.personal_informations.phone,
          required: true,
        },
      ],
    },
    {
      id: 'basic-business-details',
      title: 'Basic Business Details',
      inputs: [
        {
          label: 'Business Name',
          id: 'businessName',
          type: 'text',
          value: data?.business_details.business_name,
          required: true,
        },
        {
          label: 'Business type',
          id: 'businessType',
          type: 'text',
          value: data?.business_details.business_type,
          required: true,
        },
        {
          label: 'Registration type',
          id: 'registrationType',
          type: 'text',
          value: data?.business_details.registration_type,
          required: true,
        },
        {
          label: 'VAT Registration number',
          id: 'vatRegistrationNumber',
          type: 'text',
          value: data?.business_details.vat_registration_number,
          required: true,
        },
      ],
    },
    {
      id: 'business-address',
      title: 'Business Address',
      inputs: [
        {
          label: 'Street Address',
          id: 'streetAddress',
          type: 'text',
          value: data?.business_addresses.street_address,
          required: true,
        },
        { label: 'City', id: 'city', type: 'text', value: data?.business_addresses.city, required: true },
        {
          label: 'Postal Code',
          id: 'postalCode',
          type: 'text',
          value: data?.business_addresses.postal_code,
          required: true,
        },
        {
          label: 'Country',
          id: 'country',
          type: 'text',
          value: data?.business_addresses.country,
          required: true,
        },
        {
          label: 'Business Phone Number',
          id: 'phoneNumber',
          type: 'text',
          value: data?.business_addresses.phone_number,
          required: true,
        },
      ],
    },
    {
      id: 'business-information',
      title: 'Business Information',
      inputs: [
        {
          label: 'Where are your target customers',
          id: 'targetCustomers',
          type: 'text',
          value: data?.business_informations.inside_uk ? 'Inside UK' : 'Outside UK',
        },
        {
          label: 'How do you deliver your goods/services?',
          id: 'deliveryMethod',
          type: 'text',
          value: data?.business_informations.courier_company
            ? 'Courier company (e.g. TCS, Leopard)'
            : 'Self Delivery (e.g. Glovo)',
        },
        {
          label: 'Online Services',
          id: 'onlineServices',
          type: 'text',
          value: data?.business_informations.online_service
            ? 'Online Services - no delivery required'
            : 'Other',
        },
      ],
    },
    {
      id: 'bank-account-details',
      title: 'Bank Account Details',
      inputs: [
        {
          label: 'Bank Name',
          id: 'bankName',
          type: 'text',
          value: data?.bank_details.bank_name,
          required: true,
        },
        {
          label: 'Bank Account Number',
          id: 'accountNumber',
          type: 'text',
          value: data?.bank_details.account_number,
          required: true,
        },
        {
          label: 'Sort Code',
          id: 'sortCode',
          type: 'text',
          value: data?.bank_details.sort_code,
          required: true,
        },
        { label: 'IBAN Code', id: 'ibanCode', type: 'text', value: data?.bank_details.iban_code },
        { label: 'Swift Code', id: 'swiftCode', type: 'text', value: data?.bank_details.swift_code },
        {
          label: 'Purchasing Currency',
          id: 'purchasingCurrency',
          type: 'text',
          value: data?.bank_details.purchasing_currency,
          required: true,
        },
      ],
    },
    {
      id: 'document-verification',
      title: 'Document Verification',
      inputs: [
        {
          label: 'VAT Number',
          id: 'vatNumber',
          type: 'text',
          value: data?.documents.vat_number,
          required: true,
        },
        {
          label: 'How long have you been involved in business',
          id: 'experience',
          type: 'text',
          value: data?.documents.experience,
          required: true,
        },
        {
          label: 'Document type',
          id: 'documentType',
          type: 'text',
          value: extractFileNameFromUrl(data?.documents.document_urls[0]),
          required: true,
        },
        {
          label: 'Document type',
          id: 'documentType',
          type: 'text',
          value: extractFileNameFromUrl(data?.documents.document_urls[1]),
          required: true,
        },
        {
          label: 'Document type',
          id: 'documentType',
          type: 'text',
          value: extractFileNameFromUrl(data?.documents.document_urls[2]),
          required: true,
        },
        {
          label: 'Document type',
          id: 'documentType',
          type: 'text',
          value: extractFileNameFromUrl(data?.documents.document_urls[3]),
          required: true,
        },
      ],
    },
  ];

  return (
    <Dialog open={isOpen}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='text-slate-800'>Review Your Information</DialogTitle>
          <DialogDescription>Please check the details below before submitting the form</DialogDescription>
        </DialogHeader>
        <div className='flex gap-12 mt-6'>
          <div className='w-5/12 sticky top-0 h-[calc(100vh-200px)]'>
            {sidebarItems.map((item) => (
              <div
                key={item.id}
                className={cn(
                  'flex items-center text-sm gap-4 px-4 py-2 text-default font-medium leading-6 cursor-pointer rounded-lg',
                  { 'bg-primary/10 text-primary font-semibold': selectedItem === item.label }
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
                {sections.map(({ id, title, inputs }) => (
                  <div
                    id={id}
                    ref={(el) => {
                      sectionRefs.current[id] = el;
                    }}
                    onMouseEnter={() => setSelectedItem(title)}
                    className='space-y-4'
                    key={id}>
                    {renderInputs(inputs)}
                    <Separator />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <div className='flex gap-4 w-full'>
            <DialogClose asChild>
              <Button
                variant='outline'
                className='w-full'
                onClick={() => {
                  setIsOpen(false);
                  setShowModal(false);
                }}>
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

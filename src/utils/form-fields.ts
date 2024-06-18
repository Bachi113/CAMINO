import {
  CheckboxField,
  IBankDetailField,
  IBusinessAddressField,
  IBusinessDetailField,
  IPersonalInfoField,
} from '@/types/validations';
import { extractFileNameFromUrl } from './utils';

export const personalInfoFields: IPersonalInfoField[] = [
  { label: 'First Name', id: 'firstName', placeholder: 'First name', type: 'text', required: true },
  { label: 'Last Name', id: 'lastName', placeholder: 'Last name', type: 'text', required: true },
  { label: 'Email Address', id: 'email', placeholder: 'Email address', type: 'email', required: true },
  { label: 'Phone Number', id: 'phone', placeholder: 'Phone number', type: 'text', required: true },
];

export const businessDetailsFields: IBusinessDetailField[] = [
  { label: 'Business Name', id: 'businessName', placeholder: 'Name of your business', required: true },
  { label: 'Business Type', id: 'businessType', placeholder: 'Company type', required: true },
  {
    label: 'Registration Type',
    id: 'registrationType',
    placeholder: 'Registration type',
    required: true,
  },
  {
    label: 'VAT Registration Number',
    id: 'vatRegistrationNumber',
    placeholder: 'Enter Registration eg: GB123456789',
    required: true,
  },
];

export const businessAddressFields: IBusinessAddressField[] = [
  { label: 'Street Address', id: 'streetAddress', placeholder: 'Street Address', required: true },
  { label: 'City', id: 'city', placeholder: 'City', required: true },
  { label: 'Postal Code', id: 'postalCode', placeholder: 'Postal Code', required: true },
  { label: 'Country', id: 'country', placeholder: 'Country', required: true },
  { label: 'Business Phone Number', id: 'phoneNumber', placeholder: 'Business Phone Number', required: true },
];

export const checkboxFields: CheckboxField[] = [
  { id: 'insideUk', label: 'Inside UK', value: 'Inside UK' },
  { id: 'outsideUk', label: 'Outside UK', value: 'Outside UK' },
];

export const deliveryMethodFields: CheckboxField[] = [
  {
    id: 'courierCompany',
    label: 'Courier company (e.g. TCS, Leopard)',
    value: 'Courier company (e.g. TCS, Leopard)',
  },
  { id: 'selfDelivery', label: 'Self Delivery (e.g. Glovo)', value: 'Self Delivery (e.g. Glovo)' },
  {
    id: 'onlineService',
    label: 'Online Services - no delivery required',
    value: 'Online Services - no delivery required',
  },
  { id: 'other', label: 'Other', value: 'Other' },
];

export const bankFields: IBankDetailField[] = [
  {
    label: 'Bank Account Number',
    id: 'bankAccountNumber',
    placeholder: 'Account number',
    type: 'text',
    required: true,
  },
  { label: 'Sort Code', id: 'sortCode', placeholder: 'Sort Code', type: 'text', required: true },
  { label: 'IBAN Code', id: 'ibanNumber', placeholder: 'IBAN Code', type: 'text', required: false },
  { label: 'Swift Code', id: 'swiftCode', placeholder: 'Swift Code', type: 'text', required: false },
];

// summary fileds
export const summaryFileds = (data: any) => {
  if (!data) return [];

  return [
    {
      id: 'personal-information',
      title: 'Personal Information',
      inputs: [
        { label: 'First name', id: 'firstName', value: data.personal_informations?.first_name },
        { label: 'Last name', id: 'lastName', value: data.personal_informations?.last_name },
        {
          label: 'Email address',
          id: 'email',
          type: 'email',
          value: data.personal_informations?.email,
        },
        { label: 'Phone Number', id: 'phone', value: data.personal_informations?.phone },
      ],
    },
    {
      id: 'basic-business-details',
      title: 'Basic Business Details',
      inputs: [
        { label: 'Business Name', id: 'businessName', value: data.business_details?.business_name },
        { label: 'Business type', id: 'businessType', value: data.business_details?.business_type },
        {
          label: 'Registration type',
          id: 'registrationType',
          value: data.business_details?.registration_type,
        },
        {
          label: 'VAT Registration number',
          id: 'vatRegistrationNumber',
          value: data.business_details?.vat_registration_number,
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
          value: data.business_addresses?.street_address,
        },
        { label: 'City', id: 'city', value: data.business_addresses?.city },
        { label: 'Postal Code', id: 'postalCode', value: data.business_addresses?.postal_code },
        { label: 'Country', id: 'country', value: data.business_addresses?.country },
        {
          label: 'Business Phone Number',
          id: 'phoneNumber',
          value: data.business_addresses?.phone_number,
        },
      ],
    },
    {
      id: 'bank-account-details',
      title: 'Bank Account Details',
      inputs: [
        { label: 'Bank Name', id: 'bankName', value: data.bank_details?.bank_name },
        { label: 'Bank Account Number', id: 'accountNumber', value: data.bank_details?.account_number },
        { label: 'Sort Code', id: 'sortCode', value: data.bank_details?.sort_code },
        { label: 'IBAN Code', id: 'ibanCode', value: data.bank_details?.iban_code },
        { label: 'Swift Code', id: 'swiftCode', value: data.bank_details?.swift_code },
        {
          label: 'Purchasing Currency',
          id: 'purchasingCurrency',
          value: data.bank_details?.purchasing_currency,
        },
      ],
    },
    {
      id: 'document-verification',
      title: 'Document Verification',
      inputs: [
        { label: 'VAT Number', id: 'vatNumber', value: data.documents?.vat_number },
        {
          label: 'How long have you been involved in business',
          id: 'experience',
          value: data.documents?.experience,
        },
        {
          label: 'Document type 1',
          id: 'documentType1',
          value: extractFileNameFromUrl(data.documents?.document_urls?.[0]),
        },
        {
          label: 'Document type 2',
          id: 'documentType2',
          value: extractFileNameFromUrl(data.documents?.document_urls?.[1]),
        },
        {
          label: 'Document type 3',
          id: 'documentType3',
          value: extractFileNameFromUrl(data.documents?.document_urls?.[2]),
        },
        {
          label: 'Document type 4',
          id: 'documentType4',
          value: extractFileNameFromUrl(data.documents?.document_urls?.[3]),
        },
      ],
    },
  ];
};

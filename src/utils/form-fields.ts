import {
  CheckboxField,
  IBankDetailField,
  IBusinessAddressField,
  IBusinessDetailField,
  IPersonalInfoField,
} from '@/types/validations';

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

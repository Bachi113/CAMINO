import * as yup from 'yup';

// Personal Information Validations
export const personalInformationSchema = yup.object().shape({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  phone: yup.number().typeError('Enter a valid phone number').required('Phone Number is required'),
  terms: yup
    .boolean()
    .oneOf([true], 'You must accept the terms and conditions')
    .required('You must accept the terms and conditions'),
});

export type IPersonalInformation = {
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  terms: boolean;
};

export interface IPersonalInfoField {
  label: string;
  id: keyof IPersonalInformation;
  placeholder: string;
  type: 'text' | 'email';
  required: boolean;
}

// Business Detail Validations
export const businessDetailSchema = yup.object().shape({
  businessName: yup.string().required('Business Name is required'),
  businessType: yup.string().required('Business Type is required'),
  registrationType: yup.string().required('Registration Type is required'),
  vatRegistrationNumber: yup
    .string()
    .required('VAT Registration Number is required')
    .max(10, 'VAT Registration Number must be at most 10 characters'),
});

export type IBusinessDetail = {
  businessName: string;
  businessType: string;
  registrationType: string;
  vatRegistrationNumber: string;
};

export interface IBusinessDetailField {
  label: string;
  id: keyof IBusinessDetail;
  placeholder: string;
  required: boolean;
}

// Business Address Validations
export type IBusinessAddress = {
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
  phoneNumber: number;
};

export const businessAddressSchema = yup.object().shape({
  streetAddress: yup.string().required('Street Address is required'),
  city: yup.string().required('City is required'),
  postalCode: yup.string().required('Postal Code is required'),
  country: yup.string().required('Country is required'),
  phoneNumber: yup.number().typeError('Enter a valid phone number').required('Phone Number is required'),
});

export interface IBusinessAddressField {
  label: string;
  id: keyof IBusinessAddress;
  placeholder: string;
  required: boolean;
}

export interface CheckboxField {
  id: string;
  label: string;
  value: string;
}

export type IBankDetails = {
  bankName: string;
  bankAccountNumber: number;
  sortCode?: string;
  ibanNumber: string;
  swiftCode?: string;
  purchasingCurrency: string;
};

export const BankDetailsSchema = yup.object().shape({
  bankName: yup.string().required('Bank Name is required'),
  bankAccountNumber: yup
    .number()
    .typeError('Account Number must be a number')
    .required('Account Number is required')
    .test(
      'len',
      'Account Number must be maximum 10 characters',
      (val) => val != null && val.toString().length <= 10
    ),
  sortCode: yup.string().optional().max(6, 'Sort Code must be at most 6 characters'),
  ibanNumber: yup
    .string()
    .required('IBAN Number is required')
    .max(34, 'IBAN Number must be at most 34 characters'),
  swiftCode: yup.string().optional().max(15, 'Swift Code must be at most 15 characters'),
  purchasingCurrency: yup.string().required('Purchasing Currency is required'),
});

export interface IBankDetailField {
  label: string;
  id: keyof IBankDetails;
  placeholder: string;
  type: 'text';
  required: boolean;
}

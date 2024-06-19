import * as yup from 'yup';

// Personal Information Validations
export const personalInformationSchema = yup.object().shape({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  phone: yup.string().required('Phone Number is required'),
  terms: yup
    .boolean()
    .oneOf([true], 'You must accept the terms and conditions')
    .required('You must accept the terms and conditions'),
});

export type IPersonalInformation = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
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
  vatRegistrationNumber: yup.string().required('VAT Registration Number is required'),
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
  postalCode: number;
  country: string;
  phoneNumber: number;
};

export const businessAddressSchema = yup.object().shape({
  streetAddress: yup.string().required('Street Address is required'),
  city: yup.string().required('City is required'),
  postalCode: yup.number().required('Postal Code is required'),
  country: yup.string().required('Country is required'),
  phoneNumber: yup.number().required('Phone Number is required'),
});

export interface IBusinessAddressField {
  label: string;
  id: keyof IBusinessAddress;
  placeholder: string;
  required: boolean;
}

// Business Information Validations
export type IBusinessInformation = {
  insideUk?: boolean;
  outsideUk?: boolean;
  courierCompany?: boolean;
  selfDelivery?: boolean;
  onlineService?: boolean;
  other?: string;
};

export const businessInformationSchema = yup
  .object()
  .shape({
    insideUk: yup.boolean(),
    outsideUk: yup.boolean(),
    courierCompany: yup.boolean(),
    selfDelivery: yup.boolean(),
    onlineService: yup.boolean(),
    other: yup.string().optional(),
  })
  .test(
    'atLeastOneTargetCustomer',
    'At least one target customer location must be selected',
    function (values) {
      return values.insideUk || values.outsideUk;
    }
  )
  .test('atLeastOneDeliveryMethod', 'At least one delivery method must be selected', function (values) {
    return values.courierCompany || values.selfDelivery || values.onlineService || !!values.other;
  });

export interface CheckboxField {
  id: string;
  label: string;
  value: string;
}

//
export type IBankDetails = {
  bankName: string;
  bankAccountNumber: number;
  sortCode: string;
  ibanNumber?: string;
  swiftCode?: string;
  purchasingCurrency: string;
};

export const BankDetailsSchema = yup.object().shape({
  bankName: yup.string().required('Bank Name is required'),
  bankAccountNumber: yup.number().required('Account Number is required'),
  sortCode: yup.string().required('Sort Code is required'),
  ibanNumber: yup.string().optional(),
  swiftCode: yup.string().optional(),
  purchasingCurrency: yup.string().required('Purchasing Currency is required'),
});

export interface IBankDetailField {
  label: string;
  id: keyof IBankDetails;
  placeholder: string;
  type: 'text';
  required: boolean;
}

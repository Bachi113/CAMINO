import { Database } from './supabase';

export type TypeOnboarding = Database['public']['Tables']['onboarding']['Row'];

export type TypeOrder = Database['public']['Tables']['orders']['Row'];

// Create Product
export type TypeCreateProduct = {
  category: string;
  currency: string;
  price: string;
  product_name: string;
  remarks?: string;
};

// Create Customer
export type TypeCreateCustomer = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

// Create Payment Link
export type TypeCreatePaymentLink = {
  stripe_cus_id: string;
  product_id: string;
  currency: string;
  price: string;
  quantity: number;
  installments_options: number[];
};

// Create Subscription
export type TypeCreateSubscription = {
  id: string;
  customer_id: string;
  payment_method_id?: string;
  product_id: string;
  currency: string;
  price: string;
  quantity: number;
  installments: number;
};

// Create Payment Method CS
export type TypeCreatePaymentMethodCS = {
  currency: string;
  customer_id: string;
  paymentId: string;
};

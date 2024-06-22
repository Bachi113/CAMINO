import { Database } from './supabase';

export type TypePaymentLink = Database['public']['Tables']['payment_links']['Row'];

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
  customer_id: string;
  payment_method_id?: string;
  product_id: string;
  currency: string;
  price: string;
  quantity: number;
  installments: number;
};

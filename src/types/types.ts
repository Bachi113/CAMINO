// Custom Types

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

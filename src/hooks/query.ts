import {
  getAllCustomers,
  getAllMerchants,
  getOrders,
  getTransactions,
  getTransactionsByOrderId,
} from '@/app/actions/supabase.actions';
import { supabaseBrowserClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';

const useGetPersonalInfo = () => {
  const supabase = supabaseBrowserClient();
  return useQuery({
    queryKey: ['getPersonalInfo'],
    queryFn: async () => {
      const { data, error } = await supabase.from('personal_informations').select('*').single();
      if (error) {
        throw error;
      }
      return data;
    },
  });
};

const useGetBuinessDetail = () => {
  const supabase = supabaseBrowserClient();
  return useQuery({
    queryKey: ['getBusinessDetail'],
    queryFn: async () => {
      const { data, error } = await supabase.from('business_details').select('*').single();

      if (error) {
        throw error;
      }
      return data;
    },
  });
};

const useGetBusinessAddress = () => {
  const supabase = supabaseBrowserClient();
  return useQuery({
    queryKey: ['getBusinessAddress'],
    queryFn: async () => {
      const { data, error } = await supabase.from('business_addresses').select('*').single();

      if (error) {
        throw error;
      }
      return data;
    },
  });
};

const useGetBankDetails = () => {
  const supabase = supabaseBrowserClient();
  return useQuery({
    queryKey: ['getBankDetails'],
    queryFn: async () => {
      const { data, error } = await supabase.from('bank_details').select('*').single();

      if (error) {
        throw error;
      }
      return data;
    },
  });
};

const useGetVerificationDocuments = () => {
  const supabase = supabaseBrowserClient();
  return useQuery({
    queryKey: ['getDocumentes'],
    queryFn: async () => {
      const { data, error } = await supabase.from('documents').select('*').single();

      if (error) {
        throw error;
      }
      return data;
    },
  });
};

const useGetOnboardingData = () => {
  const supabase = supabaseBrowserClient();
  return useQuery({
    queryKey: ['getOnboardingData'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('onboarding')
        .select(
          `id,
          personal_informations (*),
          business_details (*),
          business_addresses (*),
          bank_details (*),
          documents (*)
        `
        )
        .single();

      if (error) {
        throw error;
      }
      return data;
    },
  });
};

const useGetCustomerData = () => {
  const supabase = supabaseBrowserClient();
  return useQuery({
    queryKey: ['getCustomer'],
    queryFn: async () => {
      const { data, error } = await supabase.from('customers').select('*').single();

      if (error) {
        throw error;
      }
      return data;
    },
  });
};

const useGetAdminData = () => {
  const supabase = supabaseBrowserClient();
  return useQuery({
    queryKey: ['getAdmin'],
    queryFn: async () => {
      const { data, error } = await supabase.from('admins').select('*').single();

      if (error) {
        throw error;
      }
      return data;
    },
  });
};

const useGetOrders = () => {
  return useQuery({
    queryKey: ['getOrders'],
    queryFn: async () => {
      const response = await getOrders();
      if (response.error) {
        throw response.error;
      }
      return response.data;
    },
  });
};

const useGetTransactions = () => {
  return useQuery({
    queryKey: ['getTransactions'],
    queryFn: async () => {
      const response = await getTransactions();
      if (response.error) {
        throw response.error;
      }
      return response.data;
    },
  });
};

const useGetTransactionsByOrderId = (orderId: string) => {
  return useQuery({
    queryKey: ['getTransactionsByOrderId'],
    queryFn: async () => {
      const response = await getTransactionsByOrderId(orderId);
      if (response.error) {
        throw response.error;
      }
      return response.data;
    },
  });
};

const useGetMerchnats = () => {
  return useQuery({
    queryKey: ['getAllMerchants'],
    queryFn: async () => {
      const response = await getAllMerchants();
      if (response.error) {
        throw response.error;
      }
      return response.data;
    },
  });
};

const useGetCustomers = () => {
  const supabase = supabaseBrowserClient();
  return useQuery({
    queryKey: ['getCustomers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('merchants_customers')
        .select('*, customers (stripe_id, customer_name, email, phone)')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      return data;
    },
  });
};

const useGetProducts = () => {
  const supabase = supabaseBrowserClient();
  return useQuery({
    queryKey: ['getProducts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select()
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      return data;
    },
  });
};

const useGetMerchantCustomers = (isMerchant: boolean) => {
  const supabase = supabaseBrowserClient();

  return useQuery({
    queryKey: ['getMerchantCustomers'],
    queryFn: async () => {
      if (isMerchant) {
        const { data, error } = await supabase
          .from('merchants_customers')
          .select('*, customers (customer_name, email, phone, address)');

        if (error) {
          throw new Error(error.message);
        }
        return data;
      } else {
        return getAllCustomers();
      }
    },
  });
};

const useGetMerchantCustomerIdAndNames = () => {
  const supabase = supabaseBrowserClient();
  return useQuery({
    queryKey: ['getMerchantCustomerIdAndNames'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('merchants_customers')
        .select('customer_id, customers (customer_name)');

      if (error) {
        throw error;
      }
      return data;
    },
  });
};

const useGetMerchantProducts = () => {
  const supabase = supabaseBrowserClient();

  return useQuery({
    queryKey: ['getMerchantProducts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*');

      if (error) {
        console.error('Error fetching products:', error);
        throw new Error(`Error fetching products: ${error.message}`);
      }
      return data;
    },
  });
};

const useGetProductCategories = () => {
  const supabase = supabaseBrowserClient();
  return useQuery({
    queryKey: ['getProductCategories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('product_categories').select();

      if (error) {
        throw error;
      }
      return data;
    },
  });
};

export {
  useGetPersonalInfo,
  useGetBuinessDetail,
  useGetBusinessAddress,
  useGetBankDetails,
  useGetVerificationDocuments,
  useGetOnboardingData,
  useGetCustomerData,
  useGetAdminData,
  useGetOrders,
  useGetTransactions,
  useGetTransactionsByOrderId,
  useGetMerchnats,
  useGetMerchantCustomers,
  useGetProducts,
  useGetCustomers,
  useGetMerchantCustomerIdAndNames,
  useGetMerchantProducts,
  useGetProductCategories,
};

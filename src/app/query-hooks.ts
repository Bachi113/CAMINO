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

interface UseGetMerchantProductsParams {
  page: number;
  pageSize: number;
  categoryFilter?: string;
  searchQuery?: string;
}

const useGetMerchantProducts = ({
  page,
  pageSize,
  categoryFilter,
  searchQuery,
}: UseGetMerchantProductsParams) => {
  const supabase = supabaseBrowserClient();

  return useQuery({
    queryKey: ['getMerchantProducts', page, pageSize, categoryFilter],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (categoryFilter) {
        query = query.eq('category', categoryFilter);
      }
      if (searchQuery) {
        query = query.ilike('product_name', `%${searchQuery}%`);
      }
      console.log(searchQuery);

      const { data, error } = await query;

      if (error) {
        throw new Error(`Error fetching products: ${error.message}`);
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
  useGetMerchantProducts,
};

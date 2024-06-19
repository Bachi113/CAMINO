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
    staleTime: 1000 * 60,
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
    staleTime: 1000 * 60,
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
    staleTime: 1000 * 60,
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
    staleTime: 1000 * 60,
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
    staleTime: 1000 * 60,
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
    staleTime: 1000 * 60,
  });
};

export {
  useGetPersonalInfo,
  useGetBuinessDetail,
  useGetBusinessAddress,
  useGetBankDetails,
  useGetVerificationDocuments,
  useGetOnboardingData,
};

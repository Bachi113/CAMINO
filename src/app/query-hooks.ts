import { getUser } from '@/utils/get-user';
import { supabaseBrowserClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';

const useGetPersonalInfo = () => {
  const supabase = supabaseBrowserClient();

  return useQuery({
    queryKey: ['getPersonalInfo'],
    queryFn: async () => {
      const user = await getUser();
      if (!user) {
        throw new Error('You need to be logged in.');
      }
      const { data, error } = await supabase
        .from('personal_informations')
        .select('*')
        .eq('user_id', user?.id)
        .single();
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
      const user = await getUser();
      if (!user) {
        throw new Error('You need to be logged in.');
      }
      const { data, error } = await supabase
        .from('business_details')
        .select('*')
        .eq('user_id', user?.id)
        .single();

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
      const user = await getUser();
      if (!user) {
        throw new Error('You need to be logged in.');
      }
      const { data, error } = await supabase
        .from('business_addresses')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        throw error;
      }
      return data;
    },
    staleTime: 1000 * 60,
  });
};

const useGetBusinessInformation = () => {
  const supabase = supabaseBrowserClient();

  return useQuery({
    queryKey: ['getBusinessInformation'],
    queryFn: async () => {
      const user = await getUser();
      if (!user) {
        throw new Error('You need to be logged in.');
      }
      const { data, error } = await supabase
        .from('business_informations')
        .select('*')
        .eq('user_id', user?.id)
        .single();

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
      const user = await getUser();
      if (!user) {
        throw new Error('You need to be logged in.');
      }
      const { data, error } = await supabase
        .from('bank_details')
        .select('*')
        .eq('user_id', user?.id)
        .single();

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
      const user = await getUser();
      if (!user) {
        throw new Error('You need to be logged in.');
      }
      const { data, error } = await supabase.from('documents').select('*').eq('user_id', user?.id).single();

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
      const user = await getUser();
      if (!user) {
        throw new Error('You need to be logged in.');
      }
      const { data, error } = await supabase
        .from('onboarding')
        .select(
          `*,
          personal_informations (*),
          business_details (*),
          business_addresses (*),
          bank_details (*),
          documents (*)
        `
        )
        .eq('user_id', user.id)
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
  useGetBusinessInformation,
  useGetBankDetails,
  useGetVerificationDocuments,
  useGetOnboardingData,
};

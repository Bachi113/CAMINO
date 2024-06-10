import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import StoreIcon from '@/assets/icons/StoreIcon';
import InputWrapper from '../InputWrapper';
import { Input } from '../ui/input';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Checkbox } from '../ui/checkbox';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { getUser } from '@/utils/get-user';
import { supabaseBrowserClient } from '@/utils/supabase/client';
import { errorToast } from '@/utils/utils';

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

const BusinessInformation = () => {
  const router = useRouter();
  const supabase = supabaseBrowserClient();
  const [loading, setLoading] = useState(false);
  const [businessInformationId, setBusinessInformationId] = useState<string | null>(null);
  const [showOtherInput, setShowOtherInput] = useState(false);

  // TODO show error message if user not select any checkbox
  const { register, handleSubmit, setValue, watch } = useForm<IBusinessInformation>({
    resolver: yupResolver(businessInformationSchema),
  });

  useEffect(() => {
    const fetchBusinessInformation = async () => {
      setLoading(true);
      const user = await getUser();
      const userId = user?.id;

      const { data, error } = await supabase
        .from('business_informations')
        .select('*')
        .eq('user_id', userId!)
        .single();

      if (data) {
        setValue('insideUk', data.inside_uk);
        setValue('outsideUk', data.outside_uk);
        setValue('courierCompany', data.courier_company);
        setValue('selfDelivery', data.self_delivery);
        setValue('onlineService', data.online_service);
        setValue('other', data.other || undefined);
        setBusinessInformationId(data.id);

        if (data.other) {
          setShowOtherInput(true);
        }
      }

      if (error && error.code !== 'PGRST116') {
        errorToast(error.message);
        console.error('Error fetching business information:', error);
      }

      setLoading(false);
    };

    fetchBusinessInformation();
  }, [supabase, setValue]);

  const onHandleFormSubmit = async (data: IBusinessInformation) => {
    setLoading(true);
    const user = await getUser();
    const userId = user?.id;

    if (businessInformationId) {
      const { error } = await supabase
        .from('business_informations')
        .update({
          inside_uk: data.insideUk ?? false,
          outside_uk: data.outsideUk ?? false,
          courier_company: data.courierCompany ?? false,
          self_delivery: data.selfDelivery ?? false,
          online_service: data.onlineService ?? false,
          other: data.other,
        })
        .eq('user_id', userId!);

      if (error) {
        errorToast(error.message);
        console.error('Error updating business information:', error);
        setLoading(false);
        return;
      }
    } else {
      const { data: insert_data, error } = await supabase
        .from('business_informations')
        .insert({
          inside_uk: data.insideUk ?? false,
          outside_uk: data.outsideUk ?? false,
          courier_company: data.courierCompany ?? false,
          self_delivery: data.selfDelivery ?? false,
          online_service: data.onlineService ?? false,
          other: data.other,
          user_id: userId!,
        })
        .select('id')
        .single();

      if (error) {
        errorToast(error.message);
        console.error('Error inserting business information:', error);
        setLoading(false);
        return;
      }

      const { error: insert_onboarding_error } = await supabase
        .from('onboarding')
        .update({
          user_id: userId!,
          business_informations: insert_data.id,
        })
        .eq('user_id', userId!);

      if (insert_onboarding_error) {
        errorToast(insert_onboarding_error.message);
        console.error('Error updating onboarding:', insert_onboarding_error);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    router.push('/onboarding/bank_details');
  };

  return (
    <>
      <Button
        size='default'
        className='gap-2 text-default'
        variant='outline'
        onClick={() => router.push('/onboarding/business_address')}
        disabled={loading}>
        <MdOutlineKeyboardBackspace className='size-5' /> Back
      </Button>
      <div className='flex flex-col items-center justify-center mt-6'>
        <div className='max-w-[350px] w-full space-y-10'>
          <div className='space-y-6 flex flex-col items-center'>
            <div className='border rounded-lg p-3'>
              <StoreIcon />
            </div>
            <div className='space-y-2 text-center'>
              <p className='text-default text-2xl font-semibold leading-7'>Business Information</p>
              <p className='text-subtle text-sm text-normal leading-5'>
                Please provide other info about your business
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit(onHandleFormSubmit)} className='space-y-6'>
            <div className='space-y-4'>
              <InputWrapper label='Where are your target customers' required>
                <div className='space-y-2 mt-2'>
                  <div className='flex items-center gap-2.5'>
                    <Checkbox
                      id='insideUk'
                      value='Inside UK'
                      onCheckedChange={(checked) => {
                        setValue('insideUk', checked as boolean);
                      }}
                      checked={watch('insideUk') || false}
                      disabled={loading}
                    />
                    <label htmlFor='insideUk' className='text-sm text-muted-foreground'>
                      Inside UK
                    </label>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Checkbox
                      id='outsideUk'
                      onCheckedChange={(checked) => {
                        setValue('outsideUk', checked as boolean);
                      }}
                      value='Outside UK'
                      checked={watch('outsideUk') || false}
                      disabled={loading}
                    />
                    <label htmlFor='outsideUk' className='text-sm text-muted-foreground'>
                      Outside UK
                    </label>
                  </div>
                </div>
              </InputWrapper>
              <InputWrapper label='How do you deliver your goods/services?' required>
                <div className='space-y-2 mt-2'>
                  <div className='flex items-center gap-2.5'>
                    <Checkbox
                      id='courierCompany'
                      onCheckedChange={(checked) => {
                        setValue('courierCompany', checked as boolean);
                      }}
                      value='Courier company (e.g. TCS, Leopard)'
                      checked={watch('courierCompany') || false}
                      disabled={loading}
                    />
                    <label htmlFor='courierCompany' className='text-sm text-muted-foreground'>
                      Courier company (e.g. TCS, Leopard)
                    </label>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Checkbox
                      id='selfDelivery'
                      onCheckedChange={(checked) => {
                        setValue('selfDelivery', checked as boolean);
                      }}
                      value='Self Delivery (e.g. Glovo)'
                      checked={watch('selfDelivery') || false}
                      disabled={loading}
                    />
                    <label htmlFor='selfDelivery' className='text-sm text-muted-foreground'>
                      Self Delivery (e.g. Glovo)
                    </label>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Checkbox
                      id='onlineService'
                      onCheckedChange={(checked) => {
                        setValue('onlineService', checked as boolean);
                      }}
                      value='Online Services - no delivery required'
                      checked={watch('onlineService') || false}
                      disabled={loading}
                    />
                    <label htmlFor='onlineService' className='text-sm text-muted-foreground'>
                      Online Services - no delivery required
                    </label>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Checkbox
                      id='other'
                      value='Other'
                      onClick={() => setShowOtherInput(!showOtherInput)}
                      checked={watch('other')?.length! > 1 || showOtherInput || false}
                      disabled={loading}
                      onCheckedChange={() => {
                        businessInformationId && setValue('other', '');
                      }}
                    />
                    <label htmlFor='other' className='text-sm text-muted-foreground'>
                      Other
                    </label>
                  </div>
                  {showOtherInput && (
                    <Input
                      {...register('other')}
                      placeholder='Other...'
                      className='mt-3'
                      disabled={loading}
                    />
                  )}
                </div>
              </InputWrapper>
            </div>
            <div>
              <Button className='w-full' size='lg' type='submit' disabled={loading}>
                {loading ? 'Loading...' : businessInformationId ? 'Update' : 'Continue'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default BusinessInformation;

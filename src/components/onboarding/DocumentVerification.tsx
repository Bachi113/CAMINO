import { useEffect, useState } from 'react';
import { Button, buttonVariants } from '../ui/button';
import DocumentVerificationIcon from '@/assets/icons/DocumentVerificationIcon';
import InputWrapper from '../InputWrapper';
import { Input } from '../ui/input';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { getUser } from '@/utils/get-user';
import { cn, errorToast } from '@/utils/utils';
import { supabaseBrowserClient } from '@/utils/supabase/client';
import { uploadDocument } from '@/app/onboarding/action';
import { FaRegTrashAlt } from 'react-icons/fa';
import { LuUploadCloud } from 'react-icons/lu';
import ModalOnboardingSummary from './ModalOnboardingSummary';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';

export const documentVerificationSchema = yup.object().shape({
  vatNumber: yup.string().required('VAT Number is required'),
  howLongYouInvolved: yup.string().required('Please specify how long you have been involved in business'),
  document1: yup.mixed().required('Document is required'),
});

const DocumentVerification = () => {
  const supabase = supabaseBrowserClient();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [isDocumentVerification, setIsDocumentVerification] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(documentVerificationSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const user = await getUser();
      const userId = user?.id;

      const { data, error } = await supabase.from('documents').select('*').eq('user_id', userId!).single();

      if (data) {
        setIsDocumentVerification(true);
        setValue('vatNumber', data.vat_number);
        setValue('howLongYouInvolved', data.experience);
        setValue('document1', data.document_urls.length ? (data.document_urls[0] as any) : null);
      }

      if (error) {
        console.error('Error fetching document verification data:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [setValue, supabase]);

  const document1 = watch('document1') as any;

  const onHandleFormSubmit = async (data: any) => {
    setLoading(true);
    const user = await getUser();
    const userId = user?.id;

    try {
      const fileUrl = await uploadDocument(document1!);
      // If there's existing data, update it, otherwise, insert new data
      if (isDocumentVerification) {
        const { error } = await supabase
          .from('documents')
          .update({
            vat_number: data.vatNumber,
            experience: data.howLongYouInvolved,
            document_urls: [
              {
                name: document1?.name || document1?.[0]?.name,
                url: fileUrl,
                type: document1?.type || document1?.[0]?.type,
              },
            ],
          })
          .eq('user_id', userId!);

        if (error) {
          errorToast(error.message);
          console.error('Error updating documents', error);
          setLoading(false);
          return;
        }
      } else {
        const { data: insert_data, error } = await supabase
          .from('documents')
          .insert({
            vat_number: data.vatNumber,
            experience: data.howLongYouInvolved,
            document_urls: [
              {
                name: data.document1.name,
                url: fileUrl as string,
                type: data.document1.type,
              },
            ],
            user_id: userId!,
          })
          .select('id')
          .single();

        if (error) {
          errorToast(error.message);
          console.error('Error inserting personal information:', error);
          setLoading(false);
          return null;
        }

        const { error: insert_onboarding_error } = await supabase
          .from('onboarding')
          .update({
            user_id: userId!,
            documents: insert_data.id,
          })
          .eq('user_id', userId!);

        if (insert_onboarding_error) {
          errorToast(insert_onboarding_error.message);
          console.error('Error inserting onboarding:', insert_onboarding_error);
          setLoading(false);
          return;
        }
      }
      setShowModal(true);
    } catch (error) {
      errorToast('Something went wrong. Please try again.');
      console.error('Error submitting document verification:', error);
    }

    setLoading(false);
  };

  const removeFile = (fieldName: any) => {
    setValue(fieldName, null);
  };

  return (
    <>
      <Button
        size='default'
        className='gap-2 text-default'
        variant='outline'
        onClick={() => router.push('/onboarding/bank_details')}
        disabled={loading}>
        <MdOutlineKeyboardBackspace className='size-5' /> Back
      </Button>
      <div className='flex flex-col items-center justify-center mt-14'>
        <div className='max-w-[350px] w-full space-y-10 mt-1'>
          <div className='space-y-6 flex flex-col items-center'>
            <div className='border rounded-lg p-3'>
              <DocumentVerificationIcon />
            </div>
            <div className='space-y-2 text-center'>
              <p className='text-default text-2xl font-semibold leading-7'>Document Verification</p>
              <p className='text-subtle text-sm text-normal leading-5'>
                Please provide your business documents to verify
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onHandleFormSubmit)}>
            <div className='space-y-6'>
              <div className='space-y-4'>
                <InputWrapper label='VAT Number' required error={errors.vatNumber?.message}>
                  <Input
                    type='text'
                    placeholder='VAT Number'
                    id='vatNumber'
                    {...register('vatNumber')}
                    disabled={loading}
                  />
                </InputWrapper>
                <InputWrapper
                  label='How long have you been involved in business'
                  required
                  error={errors.howLongYouInvolved?.message}>
                  <Input
                    type='text'
                    placeholder='2 to 5 years'
                    id='howLongYouInvolved'
                    {...register('howLongYouInvolved')}
                    disabled={loading}
                  />
                </InputWrapper>
                <div>
                  <label className='text-sm leading-none mb-2'>Upload the business documents</label>
                  <InputWrapper
                    label='Document Verification'
                    className='flex justify-between items-center'
                    required>
                    <Input type='file' id='document1' {...register('document1')} className='hidden' />
                    <div className='flex items-center'>
                      {(document1?.name || document1?.[0]?.name) && (
                        <div className='mr-2'>{document1.name || document1?.[0]?.name}</div>
                      )}
                      {(!document1 || !document1?.[0]?.name) && (
                        <label
                          htmlFor='document1'
                          className={cn(buttonVariants({ variant: 'outline' }), 'gap-1 cursor-pointer')}>
                          <LuUploadCloud /> Upload
                        </label>
                      )}
                      {(document1?.name || document1?.[0]?.name) && (
                        <Button
                          size='icon'
                          variant='outline'
                          className='text-destructive'
                          onClick={() => removeFile('document1')}>
                          <FaRegTrashAlt />
                        </Button>
                      )}
                    </div>
                  </InputWrapper>
                  {<p className='text-xs mt-1 text-red-500 font-medium'>{errors.document1?.message}</p>}
                </div>
              </div>
              <div>
                <Button className='w-full' size='lg' type='submit' disabled={loading}>
                  {loading ? 'Loading...' : isDocumentVerification ? 'Update' : 'Continue'}
                </Button>
              </div>
            </div>
          </form>
        </div>
        {showModal && <ModalOnboardingSummary isSubmitSuccessful={showModal} />}
      </div>
    </>
  );
};

export default DocumentVerification;

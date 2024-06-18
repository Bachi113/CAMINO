'use client';

import { useEffect, useState } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import DocumentVerificationIcon from '@/assets/icons/DocumentVerificationIcon';
import InputWrapper from '@/components/InputWrapper';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { cn, errorToast, extractFileNameFromUrl } from '@/utils/utils';
import { saveData, updateData, uploadDocument } from '@/app/onboarding/actions';
import { FaRegTrashAlt } from 'react-icons/fa';
import { LuUploadCloud } from 'react-icons/lu';
import ModalOnboardingSummary from './ModalOnboardingSummary';
import { useGetVerificationDocuments } from '@/app/query-hooks';
import NavigationButton from './NavigationButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { queryClient } from '@/app/providers';
import Heading from './Heading';

interface IDocumentVerification {
  vatNumber: string;
  howLongYouInvolved: string;
  document1?: any;
  document2?: any;
  document3?: any;
  document4?: any;
}

export const documentVerificationSchema = yup.object().shape({
  vatNumber: yup.string().required('VAT Number is required'),
  howLongYouInvolved: yup.string().required('Please specify how long you have been involved in business'),
  document1: yup.mixed(),
  document2: yup.mixed(),
  document3: yup.mixed(),
  document4: yup.mixed(),
});

const yearsInvolved = [
  { value: '<2 years', id: '1' },
  { value: '2-5 Years', id: '2' },
  { value: '5+ Years', id: '3' },
];

const DocumentVerification = () => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<IDocumentVerification>({
    resolver: yupResolver(documentVerificationSchema),
  });

  const { data } = useGetVerificationDocuments();

  useEffect(() => {
    ['document1', 'document2', 'document3', 'document4'].forEach((doc) =>
      setValue(doc as keyof IDocumentVerification, null)
    );
    if (data) {
      const documentsLength = (data?.document_urls as []).length || 0;

      setValue('vatNumber', data.vat_number);
      setValue('howLongYouInvolved', data.experience);
      if (documentsLength && Array.isArray(data.document_urls)) {
        data.document_urls.forEach((fileUrl, index) => {
          if (index < documentsLength) {
            const fileName = extractFileNameFromUrl(fileUrl as string);
            if (!fileName) {
              return errorToast(`Please upload a valid file for document ${index + 1}`);
            }

            setValue(`document${index + 1}` as keyof IDocumentVerification, { url: fileUrl, name: fileName });
          }
        });
      }
    }
  }, [setValue, data]);

  const document1 = watch('document1') as any;
  const document2 = watch('document2') as any;
  const document3 = watch('document3') as any;
  const document4 = watch('document4') as any;

  const handleFormSubmit = async (formData: IDocumentVerification) => {
    setLoading(true);

    try {
      const documentsToUpload = [
        { field: 'document1', value: document1 },
        { field: 'document2', value: document2 },
        { field: 'document3', value: document3 },
        { field: 'document4', value: document4 },
      ];

      const fileUrls = await Promise.all(
        documentsToUpload.map(async ({ field, value }) => {
          if (value && value.url) {
            return value.url;
          } else if (value && value[0]) {
            const files = new FormData();
            files.append(field, value[0]);
            const fileUrl = await uploadDocument(files);
            if (!fileUrl) throw new Error(`Error uploading ${field}`);
            return fileUrl;
          } else {
            throw `${field} is required`;
          }
        })
      );

      const dataToUpdate = {
        vat_number: formData.vatNumber,
        experience: formData.howLongYouInvolved || data?.experience,
        document_urls: fileUrls,
      };

      if (data) {
        const res = await updateData(JSON.stringify(dataToUpdate), 'documents');
        if (res?.error) throw res.error;

        queryClient.invalidateQueries({ queryKey: ['getDocuments'] });
      } else {
        const res = await saveData(JSON.stringify(dataToUpdate), 'documents');
        if (res?.error) throw res.error;

        queryClient.invalidateQueries({ queryKey: ['getDocuments'] });
      }
      setShowModal(true);
    } catch (error: any) {
      errorToast(error || 'An unknown error occurred.');
      console.error('Error submitting document verification:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFile = (fieldName: keyof IDocumentVerification) => {
    setValue(fieldName, null);
  };

  return (
    <>
      <NavigationButton showNext={!!data} />
      <div className='flex flex-col items-center justify-center mt-14 animate-fade-in-left'>
        <div className='max-w-[350px] mr-20 w-full space-y-10 mt-1'>
          <Heading
            title='Document Verification'
            description='Please provide your business documents to verify'
            icon={<DocumentVerificationIcon />}
          />

          <form onSubmit={handleSubmit(handleFormSubmit)}>
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
                  <Select
                    {...register('howLongYouInvolved')}
                    onValueChange={(val) => setValue('howLongYouInvolved', val)}
                    defaultValue={data?.experience}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select Duration' />
                    </SelectTrigger>
                    <SelectContent>
                      {yearsInvolved.map((option) => (
                        <SelectItem key={option.id} value={option.value}>
                          {option.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </InputWrapper>
                <div>
                  <label className='text-sm leading-none mb-2'>Upload the business documents</label>
                  {['document1', 'document2', 'document3', 'document4'].map((doc, index) => (
                    <InputWrapper
                      key={index}
                      label={`Document Verification ${index + 1}`}
                      className='flex justify-between items-center w-full'
                      required>
                      <Input
                        type='file'
                        id={doc}
                        {...register(doc as keyof IDocumentVerification)}
                        className='hidden'
                        required
                      />
                      <div className='flex items-center'>
                        {(watch(doc as keyof IDocumentVerification)?.name ||
                          watch(doc as keyof IDocumentVerification)?.[0]?.name) && (
                          <div className='mr-2 line-clamp-1 max-w-28'>
                            {watch(doc as keyof IDocumentVerification).name ||
                              watch(doc as keyof IDocumentVerification)?.[0]?.name}
                          </div>
                        )}
                        {!watch(doc as keyof IDocumentVerification)?.url &&
                          !watch(doc as keyof IDocumentVerification)?.[0]?.name && (
                            <label
                              htmlFor={doc}
                              className={cn(buttonVariants({ variant: 'outline' }), 'gap-1 cursor-pointer')}>
                              <LuUploadCloud /> Upload
                            </label>
                          )}
                        {(watch(doc as keyof IDocumentVerification)?.name ||
                          watch(doc as keyof IDocumentVerification)?.[0]?.name) && (
                          <Button
                            size='icon'
                            variant='outline'
                            className='text-destructive'
                            onClick={() => removeFile(doc as keyof IDocumentVerification)}>
                            <FaRegTrashAlt />
                          </Button>
                        )}
                      </div>
                    </InputWrapper>
                  ))}
                </div>
              </div>
              <div>
                <Button className='w-full' size={'xl'} type='submit' disabled={loading}>
                  {loading ? 'Loading...' : data ? 'Update' : 'Continue'}
                </Button>
              </div>
            </div>
          </form>
        </div>
        {showModal && (
          <ModalOnboardingSummary
            isSubmitSuccessful={showModal}
            setShowModal={(value) => setShowModal(value)}
          />
        )}
      </div>
    </>
  );
};

export default DocumentVerification;

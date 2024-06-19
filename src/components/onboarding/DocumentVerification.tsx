'use client';

import { useEffect, useMemo, useState } from 'react';
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
import NavigationButton from '@/components/onboarding/NavigationButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { queryClient } from '@/app/providers';
import Heading from '@/components/onboarding/Heading';
import { SubmitButton } from '@/components/SubmitButton';

interface IDocumentVerification {
  vatNumber: string;
  experience: string;
  document1: any;
  document2: any;
  document3: any;
  document4: any;
}

const documentVerificationSchema = yup.object().shape({
  vatNumber: yup.string().required('VAT Number is required'),
  experience: yup.string().required('Please specify how long you have been involved in business'),
  document1: yup.mixed().required('Document 1 is required'),
  document2: yup.mixed().required('Document 2 is required'),
  document3: yup.mixed().required('Document 3 is required'),
  document4: yup.mixed().required('Document 4 is required'),
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

  const document1 = watch('document1') as any;
  const document2 = watch('document2') as any;
  const document3 = watch('document3') as any;
  const document4 = watch('document4') as any;

  const documentsToUpload = useMemo(() => {
    return [
      { field: 'document1', value: document1 },
      { field: 'document2', value: document2 },
      { field: 'document3', value: document3 },
      { field: 'document4', value: document4 },
    ];
  }, [document1, document2, document3, document4]);

  useEffect(() => {
    if (data) {
      console.log(data);
      setValue('vatNumber', data.vat_number);
      setValue('experience', data.experience);
      const documentsArray = data.document_urls as string[];
      const documentsLength = documentsArray?.length || 0;

      documentsArray?.forEach((fileUrl, index) => {
        if (index < documentsLength) {
          const fileName = extractFileNameFromUrl(fileUrl, data.user_id);
          setValue(`document${index + 1}` as keyof IDocumentVerification, { url: fileUrl, name: fileName });
        }
      });
    }
  }, [setValue, data]);

  const removeFile = (fieldName: keyof IDocumentVerification) => {
    setValue(fieldName, {});
  };

  const openSummaryModal = () => {
    setShowModal(true);
  };

  const handleFormSubmit = async (formData: IDocumentVerification) => {
    setLoading(true);

    try {
      const fileUrls = await Promise.all(
        documentsToUpload.map(async ({ field, value }) => {
          if (value?.url) {
            return value.url;
          } else if (value?.[0]) {
            const files = new FormData();
            files.append(field, value[0]);
            const response = await uploadDocument(files);
            if (typeof response === 'string') {
              throw new Error(`Error uploading ${field}`);
            }
            return response.path;
          } else {
            throw new Error(`${field} is required`);
          }
        })
      );

      const dataToUpdate = {
        vat_number: formData.vatNumber,
        experience: formData.experience,
        document_urls: fileUrls,
      };

      const res = data
        ? await updateData(JSON.stringify(dataToUpdate), 'documents')
        : await saveData(JSON.stringify(dataToUpdate), 'documents');

      if (res?.error) {
        throw new Error(res.error);
      }

      queryClient.invalidateQueries({ queryKey: ['getDocuments'] });
      openSummaryModal();
    } catch (error: any) {
      errorToast(error.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
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
                error={errors.experience?.message}>
                <Select
                  {...register('experience')}
                  onValueChange={(val) => setValue('experience', val)}
                  value={watch('experience')}>
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
              <div className='space-y-2'>
                <label className='text-sm leading-none mb-2'>Upload the business documents</label>
                {documentsToUpload.map((doc, index) => {
                  const docField = doc.field as keyof IDocumentVerification;
                  const watchDocField = watch(docField);
                  const rawFileName = watchDocField?.[0]?.name;
                  const uploadedFileName = watchDocField?.name;

                  return (
                    <InputWrapper
                      key={doc.field}
                      label={`Document Verification ${index + 1}`}
                      className='flex justify-between items-center w-full'
                      required>
                      <Input type='file' id={doc.field} {...register(docField)} className='hidden' />
                      <div className='flex items-center'>
                        {!uploadedFileName && !rawFileName && (
                          <label
                            htmlFor={doc.field}
                            className={cn(buttonVariants({ variant: 'outline' }), 'gap-1 cursor-pointer')}>
                            <LuUploadCloud /> Upload
                          </label>
                        )}
                        {(uploadedFileName || rawFileName) && (
                          <>
                            <div className='truncate max-w-28 text-sm'>{uploadedFileName || rawFileName}</div>
                            <Button
                              size='icon'
                              variant='outline'
                              className='text-destructive'
                              onClick={() => removeFile(doc.field as keyof IDocumentVerification)}>
                              <FaRegTrashAlt />
                            </Button>
                          </>
                        )}
                      </div>
                    </InputWrapper>
                  );
                })}
              </div>
              <div className='flex gap-2'>
                <SubmitButton disabled={loading}>{data ? 'Update' : 'Continue'}</SubmitButton>
                {data && (
                  <Button size='xl' variant='outline' type='button' onClick={openSummaryModal}>
                    View Summary
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>

        <ModalOnboardingSummary isOpen={showModal} handleModalOpen={() => setShowModal(!showModal)} />
      </div>
    </>
  );
};

export default DocumentVerification;

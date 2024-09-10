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
import { saveData, updateData } from '@/app/actions/onboarding.actions';
import { FaRegTrashAlt } from 'react-icons/fa';
import { LuUploadCloud } from 'react-icons/lu';
import ModalOnboardingSummary from './ModalOnboardingSummary';
import { useGetVerificationDocuments } from '@/hooks/query';
import NavigationButton from '@/components/onboarding/NavigationButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { queryClient } from '@/app/providers';
import Heading from '@/components/onboarding/Heading';
import { SubmitButton } from '@/components/SubmitButton';
import { supabaseBrowserClient } from '@/utils/supabase/client';
import { getUser } from '@/app/actions/supabase.actions';

interface IDocumentVerification {
  experience: string;
  document1: any;
  document2?: any;
  document3?: any;
  document4?: any;
}

const documentVerificationSchema = yup.object().shape({
  experience: yup.string().required('Please specify how long you have been involved in business'),
  document1: yup.mixed().required('Document 1 is required'),
  // document2: yup.mixed().required('Document 2 is required'),
  // document3: yup.mixed().required('Document 3 is required'),
  // document4: yup.mixed().required('Document 4 is required'),
});

const yearsInvolved = [
  { value: '<2 years', id: '1' },
  { value: '2-5 Years', id: '2' },
  { value: '5+ Years', id: '3' },
];

async function uploadDocuments(files: FormData[]) {
  const supabase = await supabaseBrowserClient();

  try {
    const user = await getUser();
    if (!user) {
      throw 'Please login to get started.';
    }

    const uploadPromises = files.map((fileData, index) => {
      if (typeof fileData === 'string') {
        return fileData;
      }

      const file = fileData.get(`document${index + 1}`) as File;
      if (!file) {
        throw new Error(`Document ${index + 1} does not exist.`);
      }

      const key = `${user.id}-${file.name}`;
      const bucketName = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_NAME!;
      return supabase.storage.from(bucketName).upload(key, file, { upsert: true });
    });

    const results = await Promise.all(uploadPromises);
    const errors = results.filter((result) => result.error);
    const urls = results.filter((result) => result.data?.path).map((result) => result.data!.path!);

    if (errors.length > 0) {
      throw new Error(errors.map((error) => error.error?.message).join(', '));
    }

    return { urls };
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return { error: error.message ?? `${error}` };
  }
}

const DocumentVerification = () => {
  const [loading, setLoading] = useState(false);
  const [showSummaryModl, setShowSummaryModal] = useState(false);

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
      setValue('experience', data.experience);
      const documentsArray = data.document_urls as string[];
      documentsArray?.forEach((fileUrl, index) => {
        const fileName = extractFileNameFromUrl(fileUrl, data.user_id);
        setValue(`document${index + 1}` as keyof IDocumentVerification, { url: fileUrl, name: fileName });
      });
    }
  }, [setValue, data]);

  const removeFile = (fieldName: keyof IDocumentVerification) => {
    setValue(fieldName, {});
  };

  const handleFormSubmit = async (formData: IDocumentVerification) => {
    setLoading(true);

    try {
      const fileUploadPromises = documentsToUpload
        .map(({ field, value }) => {
          if (value?.url) {
            return value.url;
          } else if (value?.[0]) {
            const files = new FormData();
            files.append(field, value[0]);
            return files;
          } else if (field === 'document1') {
            // Only document 1 is required
            throw new Error(`${field} is required`);
          }
          return null;
        })
        .filter(Boolean);
      const fileData = await Promise.all(fileUploadPromises);
      const fileUrls = await uploadDocuments(fileData);

      if (fileUrls.error) {
        throw fileUrls.error;
      }

      const dataToUpdate = {
        experience: formData.experience,
        document_urls: fileUrls.urls,
      };

      const res = data
        ? await updateData({ ...dataToUpdate, id: data.id }, 'documents')
        : await saveData(JSON.stringify(dataToUpdate), 'documents');

      if (res?.error) {
        throw new Error(res.error);
      }

      queryClient.invalidateQueries({ queryKey: ['getDocuments'] });
      setShowSummaryModal(true);
    } catch (error: any) {
      errorToast(`${error}`);
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
              {((data && watch('experience')) || !data) && (
                <InputWrapper
                  label='How long have you been involved in business'
                  required
                  error={errors.experience?.message}>
                  <Select onValueChange={(val) => setValue('experience', val)} value={watch('experience')}>
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
              )}

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
                      labelClassName='mb-0'
                      required={index === 0}>
                      <Input type='file' id={doc.field} {...register(docField)} className='hidden' />
                      <div className='flex items-center gap-2'>
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
                <SubmitButton isLoading={loading}>{data ? 'Update' : 'Continue'}</SubmitButton>
                {data && <ModalOnboardingSummary showModal={showSummaryModl} />}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default DocumentVerification;

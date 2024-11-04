'use client';

import { FC, useEffect, useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import InputWrapper from '@/components/InputWrapper';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { errorToast } from '@/utils/utils';
import { BarLoader } from 'react-spinners';
import { supabaseBrowserClient } from '@/utils/supabase/client';
import { TypeCreateProduct } from '@/types/types';
import { queryClient } from '@/app/providers';
import getSymbolFromCurrency from 'currency-symbol-map';
import { HiPlus } from 'react-icons/hi';
import { getUser } from '@/app/actions/supabase.actions';
import { useGetProductCategories } from '@/hooks/query';
import { currencyOptions } from '@/utils/contsants/currencies';

interface ModalAddNewProductProps {
  openModal?: boolean;
  handleProductModal?: (value: boolean) => void;
  triggerButton?: boolean;
  buttonVariant?: 'outline' | 'default' | 'secondary' | 'destructive' | 'ghost' | 'link';
}

const initialData = {
  product_name: '',
  category: '',
  currency: currencyOptions[0].value,
  price: '',
};

const validations = yup.object().shape({
  category: yup.string().required('Category is required.'),
  currency: yup.string().required('Currency is required.'),
  price: yup.string().required('Price is required.'),
  product_name: yup.string().required('Product name is required.'),
  remarks: yup.string(),
});

const ModalAddNewProduct: FC<ModalAddNewProductProps> = ({
  openModal,
  handleProductModal,
  triggerButton,
  buttonVariant,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(openModal ?? false);
  const [isPending, setIsPending] = useState(false);

  const { data: categoryOptions } = useGetProductCategories();

  const {
    reset,
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<TypeCreateProduct>({
    resolver: yupResolver(validations),
    defaultValues: initialData,
  });

  const handleCreateProduct = async (formData: TypeCreateProduct) => {
    const supabase = supabaseBrowserClient();

    setIsOpen(true);
    setIsPending(true);
    try {
      const user = await getUser();
      if (!user) {
        throw 'User not found';
      }

      const { error } = await supabase.from('products').insert({
        ...formData,
        user_id: user.id,
      });

      if (error) {
        throw error.message;
      }

      queryClient.invalidateQueries({ queryKey: ['getMerchantProducts'] });
      queryClient.invalidateQueries({ queryKey: ['getProducts'] });
      setIsOpen(false);
      handleProductModal?.(false);
      reset();
    } catch (error: any) {
      errorToast(error);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    if (openModal) {
      setIsOpen(openModal);
    }
  }, [openModal]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(value) => {
        setIsOpen(value);
        handleProductModal?.(value);
      }}>
      {triggerButton && (
        <DialogTrigger asChild>
          <Button size='lg' variant={buttonVariant ?? 'default'} className='gap-2'>
            <HiPlus size={18} />
            Add Product
          </Button>
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader className='mb-4'>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription className='opacity-75'>
            Add details of the product you are adding
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleCreateProduct)} className='space-y-4'>
          <InputWrapper id='product_name' label='Product name' required error={errors.product_name?.message}>
            <Input
              id='product_name'
              placeholder='Type the name of the product'
              {...register('product_name')}
            />
          </InputWrapper>

          <InputWrapper id='category' label='Category' required error={errors.category?.message}>
            <Select {...register('category')} onValueChange={(val) => setValue('category', val)}>
              <SelectTrigger className='font-normal'>
                <SelectValue placeholder='Select category' />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions?.map(({ category }) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </InputWrapper>

          <div className='flex gap-4'>
            <InputWrapper id='currency' label='Currency' required error={errors.currency?.message}>
              <Select value={watch('currency')} onValueChange={(val) => setValue('currency', val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencyOptions.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label} ({getSymbolFromCurrency(item.value)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </InputWrapper>
            <InputWrapper id='price' label='Price' required error={errors.price?.message}>
              <Input id='price' placeholder='100.00' {...register('price')} />
            </InputWrapper>
          </div>

          <InputWrapper id='remarks' label='Product Remark'>
            <Textarea
              id='remarks'
              placeholder='Write details about the product added'
              rows={5}
              {...register('remarks')}
            />
          </InputWrapper>

          <DialogFooter className='sm:space-x-4 !mt-8'>
            <DialogClose asChild>
              <Button variant='outline' size='lg' className='w-full'>
                Cancel
              </Button>
            </DialogClose>
            <Button type='submit' size='lg' disabled={isPending} className='w-full'>
              {isPending ? <BarLoader height={1} /> : 'Add'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAddNewProduct;

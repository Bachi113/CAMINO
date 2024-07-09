'use client';

import { FC, useState } from 'react';
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

interface ModalAddNewProductProps {
  openModal?: boolean;
  triggerButton?: boolean;
  buttonVariant?: 'outline' | 'default' | 'secondary' | 'destructive' | 'ghost' | 'link';
}

export const categoryOptions = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'groceries', label: 'Groceries' },
  { value: 'home', label: 'Home' },
  { value: 'beauty', label: 'Beauty' },
  { value: 'sports', label: 'Sports' },
  { value: 'toys', label: 'Toys' },
  { value: 'other', label: 'Other' },
];

export const currencyOptions = ['GBP', 'USD', 'CAD', 'EUR'];

const initialData = {
  product_name: '',
  category: categoryOptions[0].value,
  currency: currencyOptions[0],
  price: '',
};

const validations = yup.object().shape({
  category: yup.string().required('Category is required.'),
  currency: yup.string().required('Currency is required.'),
  price: yup.string().required('Price is required.'),
  product_name: yup.string().required('Product name is required.'),
  remarks: yup.string(),
});

const ModalAddNewProduct: FC<ModalAddNewProductProps> = ({ openModal, triggerButton, buttonVariant }) => {
  const [isOpen, setIsOpen] = useState<boolean>(openModal ?? false);
  const [isPending, setIsPending] = useState(false);

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

      queryClient.invalidateQueries({ queryKey: ['getProducts'] });
      setIsOpen(false);
      reset();
    } catch (error: any) {
      errorToast(error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
            <Select
              {...register('category')}
              defaultValue={categoryOptions[0].value}
              onValueChange={(val) => setValue('category', val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
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
                  {currencyOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option} ({getSymbolFromCurrency(option)})
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

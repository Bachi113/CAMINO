import { FC } from 'react';
import InputWrapper from '@/components/InputWrapper';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { TypeProductDetails, TypeCreateProduct } from '@/types/types';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '@/components/ui/button';
import { supabaseBrowserClient } from '@/utils/supabase/client';
import { errorToast } from '@/utils/utils';
import { queryClient } from '@/app/providers';
import { toast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import getSymbolFromCurrency from 'currency-symbol-map';
import { useGetProductCategories } from '@/hooks/query';
import { currencyOptions } from '@/utils/contsants/currencies';

interface ProductDetailsProps {
  handleSheetOpen: () => void;
  data: TypeProductDetails;
}

const productValidations = yup.object().shape({
  product_name: yup.string().required('Product name is required'),
  category: yup.string().required('Category is required'),
  currency: yup.string().required('Currency is required'),
  price: yup.string().required('Price is required'),
  remarks: yup.string(),
});

const ProductDetails: FC<ProductDetailsProps> = ({ handleSheetOpen, data }) => {
  const { data: categoryOptions } = useGetProductCategories();

  const defaultValues = {
    product_name: data.product_name,
    category: data.category,
    currency: data.currency,
    price: data.price.toString(),
    remarks: data.remarks,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TypeCreateProduct>({
    resolver: yupResolver(productValidations),
    defaultValues,
  });

  const handleUpdateProduct = async (formData: TypeCreateProduct) => {
    const supabase = supabaseBrowserClient();

    const { error } = await supabase
      .from('products')
      .update({
        product_name: formData.product_name,
        category: formData.category,
        currency: formData.currency,
        price: formData.price,
        remarks: formData.remarks,
      })
      .eq('id', data.id);

    if (error) {
      errorToast(error.message);
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['getMerchantProducts'] });
    toast({ description: 'Product updated successfully' });
    handleSheetOpen();
  };

  return (
    <Sheet open={true} onOpenChange={handleSheetOpen}>
      <SheetContent className='overflow-y-auto'>
        <SheetHeader className='text-sm font-medium mb-10'>
          <div className='space-y-1'>
            <SheetTitle className='text-secondary'>Product Details</SheetTitle>
            <p className='font-normal text-base'>
              Product ID: <span className='font-bold'>{data.id}</span>
            </p>
          </div>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(handleUpdateProduct)}
          className='h-[calc(100%-96px)] flex flex-col justify-between'>
          <div className='space-y-4'>
            <InputWrapper label='Added on'>
              <Input
                disabled={true}
                value={format(new Date(data.created_at), 'MMM dd, yyyy')}
                className='h-11'
              />
            </InputWrapper>

            <InputWrapper
              id='product_name'
              label='Product name'
              required
              error={errors.product_name?.message}>
              <Input
                id='product_name'
                placeholder='Type the name of the product'
                {...register('product_name')}
                className='h-11'
              />
            </InputWrapper>

            <InputWrapper id='category' label='Category' required error={errors.category?.message}>
              <Select value={watch('category')!} onValueChange={(val) => setValue('category', val)}>
                <SelectTrigger className='h-11 font-normal'>
                  <SelectValue />
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
              <InputWrapper
                id='price'
                label='Price'
                required
                error={errors.price?.message || errors.currency?.message}>
                <div className='flex'>
                  <Select value={watch('currency')} onValueChange={(val) => setValue('currency', val)}>
                    <SelectTrigger className='w-40 h-11 rounded-r-none focus:ring-0'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencyOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label} ({getSymbolFromCurrency(option.value)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input id='price' {...register('price')} className='h-11 rounded-l-none border-l-0' />
                </div>
              </InputWrapper>
            </div>

            <InputWrapper id='remarks' label='Product Remark'>
              <Textarea
                id='remarks'
                placeholder='Write details about the product'
                rows={5}
                {...register('remarks')}
              />
            </InputWrapper>
          </div>

          <Button size='lg'>Update</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default ProductDetails;

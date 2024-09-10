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
import { errorToast, handleCopyPaymentLink } from '@/utils/utils';
import { BarLoader } from 'react-spinners';
import { supabaseBrowserClient } from '@/utils/supabase/client';
import { TypeCreatePaymentLink } from '@/types/types';
import { useGetCustomers, useGetProducts } from '@/hooks/query';
import ModalAddNewCustomer from './ModalAddNewCustomer';
import { FiPlus } from 'react-icons/fi';
import ModalAddNewProduct from './ModalAddNewProduct';
import { Checkbox } from '../ui/checkbox';
import { IoCopyOutline } from 'react-icons/io5';
import { HiPlus } from 'react-icons/hi';
import getSymbolFromCurrency from 'currency-symbol-map';
import { queryClient } from '@/app/providers';
import { getUser } from '@/app/actions/supabase.actions';
import { LuLoader } from 'react-icons/lu';
import { toast } from '../ui/use-toast';
import { sendPaymentLinkToCustomer } from '@/utils/send-payment-link';
import { currencyOptions } from '@/utils/contsants/currencies';

interface ModalCreatePaymentLinkProps {}

const initialData = {
  currency: currencyOptions[0].value,
  quantity: 1,
  installments_options: [],
};

const validations = yup.object().shape({
  stripe_cus_id: yup.string().required('Customer is required'),
  product_id: yup.string().required('Product is required'),
  currency: yup.string().required('Currency is required'),
  price: yup.string().required('Price is required'),
  quantity: yup.number().required('Quantity is required').positive().integer().min(1),
  installments_options: yup
    .array()
    .of(yup.number().required('Max installments is required'))
    .required('Max installments is required'),
});

const installmentOptions = ['3', '6', '12', '24'];

const ModalCreatePaymentLink: FC<ModalCreatePaymentLinkProps> = () => {
  const [openCustomerModal, setOpenCustomerModal] = useState(false);
  const [openProductModal, setOpenProductModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isSendingLink, setIsSendingLink] = useState(false);
  const [paymentLink, setPaymentLink] = useState('');

  const { data: merchantCustomers } = useGetCustomers();
  const { data: products } = useGetProducts();

  const {
    register,
    setValue,
    getValues,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<TypeCreatePaymentLink>({
    resolver: yupResolver(validations),
    defaultValues: initialData,
  });

  const selectedProduct = products?.find((product) => product.id === watch('product_id'));

  useEffect(() => {
    if (selectedProduct) {
      setValue('currency', selectedProduct.currency);
      setValue('price', selectedProduct.price);
    }
  }, [selectedProduct, setValue]);

  const handleCreatePaymentLink = async (formData: TypeCreatePaymentLink) => {
    const supabase = supabaseBrowserClient();

    setIsPending(true);
    try {
      if (Number(formData.price) < 0) {
        throw 'Price must be a positive number';
      }

      const user = await getUser();
      if (!user) {
        throw 'User not found';
      }

      const installmentOptions = formData.installments_options.sort((a, b) => a - b);
      const { data: paymentLink, error } = await supabase
        .from('orders')
        .insert({
          ...formData,
          installments_options: installmentOptions,
          user_id: user.id,
        })
        .select('id')
        .single();
      if (error) {
        throw error.message;
      }

      queryClient.invalidateQueries({ queryKey: ['getOrders'] });
      setPaymentLink(`${process.env.NEXT_PUBLIC_APP_URL}/payment/${paymentLink.id}`);
    } catch (error: any) {
      errorToast(error);
    } finally {
      setIsPending(false);
    }
  };

  const handleValueChange = (key: 'stripe_cus_id' | 'product_id', value: string) => {
    setValue(key, '');
    if (value === 'add-product') {
      setOpenProductModal(true);
    } else if (value === 'add-customer') {
      setOpenCustomerModal(true);
    } else {
      setValue(key, value);
    }
  };

  const handleInstallmentChange = (value: number, checked: boolean) => {
    const selectedInstallments = getValues('installments_options');
    if (checked) {
      selectedInstallments.push(value);
    } else {
      const index = selectedInstallments.indexOf(value);
      selectedInstallments.splice(index, 1);
    }
    setValue('installments_options', selectedInstallments);
  };

  // Send payment link to the customer
  const handleSendPaymentLink = async () => {
    const customer = merchantCustomers?.find((c) => c.customers?.stripe_id === getValues('stripe_cus_id'));
    const customerName = customer?.customers?.customer_name || '';
    const customerEmail = customer?.customers?.email || '';
    const customerPhone = customer?.customers?.phone || '';
    const product = products?.find((p) => p.id === getValues('product_id'));
    const productName = product?.product_name || '';

    try {
      setIsSendingLink(true);
      await sendPaymentLinkToCustomer({
        customerName,
        customerPhone,
        customerEmail,
        productName,
        currency: getValues('currency'),
        price: getValues('price'),
        paymentLink,
      });
      toast({ description: 'Payment link sent successfully' });
    } catch (error: any) {
      errorToast(error.response.data.message || `${error}`);
    } finally {
      setIsSendingLink(false);
    }
  };

  return (
    <>
      <ModalAddNewCustomer openModal={openCustomerModal} handleCustomerModal={setOpenCustomerModal} />
      <ModalAddNewProduct openModal={openProductModal} handleProductModal={setOpenProductModal} />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button size='lg' className='gap-2'>
            <HiPlus size={18} />
            Create payment link
          </Button>
        </DialogTrigger>

        <DialogContent className='max-w-xl'>
          <DialogHeader className='mb-4'>
            <DialogTitle>Create Payment link</DialogTitle>
            <DialogDescription className='opacity-75'>
              Accept payment from your customer using this link
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(handleCreatePaymentLink)} className='space-y-4'>
            <InputWrapper id='customer' label='Customer' required error={errors.stripe_cus_id?.message}>
              <Select
                value={watch('stripe_cus_id')}
                onValueChange={(value) => handleValueChange('stripe_cus_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder='Select or add a customer' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='add-customer' className='cursor-pointer'>
                    <div className='flex gap-1 items-center text-primary'>
                      <FiPlus /> Add new customer
                    </div>
                  </SelectItem>
                  {merchantCustomers?.map((data) => (
                    <SelectItem key={data.id} value={data.customers?.stripe_id as string}>
                      {data.customers?.customer_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </InputWrapper>

            <InputWrapper id='product' label='Product' required error={errors.product_id?.message}>
              <Select
                value={watch('product_id')}
                onValueChange={(value) => handleValueChange('product_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder='Select or add a product' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='add-product' className='cursor-pointer'>
                    <div className='flex gap-1 items-center text-primary'>
                      <FiPlus /> Add new product
                    </div>
                  </SelectItem>
                  {products?.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.product_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </InputWrapper>

            <div className='grid grid-cols-2 gap-4'>
              <InputWrapper id='quantity' label='Quantity' required error={errors.quantity?.message}>
                <Input id='quantity' type='number' {...register('quantity')} />
              </InputWrapper>

              <div className='flex'>
                <InputWrapper id='price' label='Price' required error={errors.price?.message}>
                  <div className='flex'>
                    <Select value={watch('currency')} onValueChange={(val) => setValue('currency', val)}>
                      <SelectTrigger className='w-36 rounded-r-none focus:ring-0'>
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

                    <Input
                      id='price'
                      placeholder='0.0'
                      {...register('price')}
                      className='rounded-l-none border-l-0'
                    />
                  </div>
                </InputWrapper>
              </div>
            </div>

            <InputWrapper
              id='installments_options'
              label='Installment Options'
              required
              error={errors.installments_options?.message}>
              <div className='grid grid-cols-2'>
                {installmentOptions.map((option) => (
                  <div key={option} className='flex items-center text-sm space-x-2 mb-2'>
                    <Checkbox
                      id={`intslmnt${option}`}
                      onCheckedChange={(checked) =>
                        handleInstallmentChange(Number(option), checked as boolean)
                      }
                    />
                    <label htmlFor={`intslmnt${option}`} className='cursor-pointer'>
                      {option} months
                    </label>
                  </div>
                ))}
              </div>
            </InputWrapper>

            {paymentLink && (
              <InputWrapper label='Payment Link'>
                <div className='flex gap-2'>
                  <Button
                    type='button'
                    onClick={() => handleCopyPaymentLink(paymentLink)}
                    className='w-full h-10 justify-between bg-secondary/5 text-secondary border'>
                    {paymentLink} <IoCopyOutline />
                  </Button>

                  <Button className='h-10' disabled={isSendingLink} onClick={handleSendPaymentLink}>
                    {isSendingLink ? (
                      <LuLoader className='animate-[spin_2s_linear_infinite]' size={16} />
                    ) : (
                      'Send Link'
                    )}
                  </Button>
                </div>
              </InputWrapper>
            )}

            <DialogFooter className='sm:space-x-4 !mt-8'>
              <DialogClose asChild>
                <Button variant='outline' size='lg' className='w-full'>
                  {paymentLink ? 'Close' : 'Cancel'}
                </Button>
              </DialogClose>
              <Button size='lg' disabled={isPending} className='w-full'>
                {isPending ? <BarLoader height={1} /> : `Create ${paymentLink && 'new'} link`}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModalCreatePaymentLink;

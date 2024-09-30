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
import { cn, errorToast, handleCopyPaymentLink } from '@/utils/utils';
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { BiChevronDown } from 'react-icons/bi';
import { CheckIcon } from '@radix-ui/react-icons';
import { installmentOptions, TypeInstallmentOption } from '@/utils/installment-options';

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
  installments_options: yup.array().required('Max installments is required'),
});

const ModalCreatePaymentLink: FC<ModalCreatePaymentLinkProps> = () => {
  const [openCustomerModal, setOpenCustomerModal] = useState(false);
  const [openCustomerSelect, setOpenCustomerSelect] = useState(false);
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
  const selectedCustomer = merchantCustomers?.find((c) => c.customers?.stripe_id === watch('stripe_cus_id'));
  const totalAmount = Number(watch('price')) * watch('quantity');

  useEffect(() => {
    if (selectedProduct) {
      setValue('currency', selectedProduct.currency);
      setValue('price', selectedProduct.price);
    }
  }, [selectedProduct, setValue]);

  useEffect(() => {
    if (!products) {
      return;
    }
    setValue('product_id', products[0].id);
  }, [products, setValue]);

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

      const installmentOptions = formData.installments_options;
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

  const handleInstallmentChange = (value: TypeInstallmentOption, checked: boolean) => {
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
    const customerName = selectedCustomer?.customers?.customer_name || '';
    const customerEmail = selectedCustomer?.customers?.email || '';
    const customerPhone = selectedCustomer?.customers?.phone || '';
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
              <Popover open={openCustomerSelect} onOpenChange={setOpenCustomerSelect}>
                <PopoverTrigger asChild>
                  <Button variant='outline' className='w-full justify-between shadow-none px-3'>
                    {selectedCustomer?.customers?.customer_name || (
                      <span className='text-muted-foreground/75'>Select or add a customer</span>
                    )}
                    <BiChevronDown className='size-5 text-gray-400 dark:text-default' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-[525px] p-0'>
                  <Command>
                    <CommandInput placeholder='Search customer...' />
                    <CommandList>
                      <CommandEmpty>No customer found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          onSelect={() => handleValueChange('stripe_cus_id', 'add-customer')}
                          className='cursor-pointer hover:bg-accent'>
                          <div className='flex gap-1 items-center text-primary'>
                            <FiPlus /> Add new customer
                          </div>
                        </CommandItem>
                        {merchantCustomers?.map((data, index) => (
                          <CommandItem
                            key={data.id}
                            // value={data.customers?.stripe_id as string}
                            value={`${data.customers?.customer_name}~${index}`}
                            onSelect={(value) => {
                              const indx = Number(value.split('~')[1]);
                              const customer = merchantCustomers[indx];
                              handleValueChange('stripe_cus_id', customer.customers?.stripe_id as string);
                              setOpenCustomerSelect(false);
                            }}
                            className={cn(
                              'justify-between cursor-pointer hover:bg-accent',
                              watch('stripe_cus_id') === data.customers?.stripe_id && 'bg-accent'
                            )}>
                            {data.customers?.customer_name}
                            {watch('stripe_cus_id') === data.customers?.stripe_id && (
                              <CheckIcon className={cn('mr-2 h-4 w-4')} />
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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

            <InputWrapper id='installments_options' label='Installment Options' required>
              <div className='max-h-60 overflow-auto space-y-2'>
                {installmentOptions.map((option) => (
                  <label
                    key={option.id}
                    htmlFor={`installment${option.id}`}
                    className='h-10 flex items-center text-sm space-x-2 border rounded-md cursor-pointer px-3'>
                    <Checkbox
                      id={`installment${option.id}`}
                      onCheckedChange={(checked) => handleInstallmentChange(option, checked as boolean)}
                    />
                    <div className='w-full flex items-center justify-between space-x-6'>
                      <div>{option.count} installments</div>
                      <div>
                        <span className='font-semibold'>
                          {getSymbolFromCurrency(watch('currency'))} {(totalAmount / option.count).toFixed(2)}{' '}
                          /
                        </span>{' '}
                        <span className='font-normal'>{option.interval}</span>
                      </div>
                    </div>
                  </label>
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

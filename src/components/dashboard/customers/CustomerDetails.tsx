import InputWrapper from '@/components/InputWrapper';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { TypeCreateCustomer, TypeCustomerDetails } from '@/types/types';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { customerValidations } from '../ModalAddNewCustomer';
import { Button } from '@/components/ui/button';
import { supabaseBrowserClient } from '@/utils/supabase/client';
import { errorToast } from '@/utils/utils';
import { queryClient } from '@/app/providers';
import { toast } from '@/components/ui/use-toast';

interface CustomerDetailsProps {
  handleSheetOpen: () => void;
  data: TypeCustomerDetails;
}

const dataToDisplay = [
  { id: 'date', label: 'Date Added', disabled: true },
  { id: 'email', label: 'Email', disabled: true },
  { id: 'name', label: 'Customer Name', disabled: false },
  { id: 'phone', label: 'Phone', disabled: false },
];

const CustomerDetails = ({ handleSheetOpen, data }: CustomerDetailsProps) => {
  const defaultValues = {
    date: format(new Date(data.created_at), 'MMM dd, yyyy'),
    name: data.customers?.customer_name ?? '',
    email: data.customers?.email ?? '',
    phone: data.customers?.phone ?? '',
    address: data.customers?.address ?? '',
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TypeCreateCustomer>({
    resolver: yupResolver(customerValidations),
    defaultValues,
  });

  const handleUpdateCustomer = async (formData: TypeCreateCustomer) => {
    const supabase = supabaseBrowserClient();

    const { error } = await supabase
      .from('customers')
      .update({
        customer_name: formData.name,
        phone: formData.phone,
        address: formData.address,
      })
      .eq('email', formData.email);

    if (error) {
      errorToast(error.message);
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['getMerchantCustomers'] });
    toast({ description: 'Customer updated successfully' });
  };

  return (
    <Sheet open={true} onOpenChange={handleSheetOpen}>
      <SheetContent className='space-y-10'>
        <SheetHeader className='text-sm font-medium'>
          <div className='space-y-1'>
            <SheetTitle className='text-secondary'>Customer Details</SheetTitle>
            <p className='font-normal text-base'>
              Customer ID: <span className='font-bold'>{data.customer_id}</span>
            </p>
          </div>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(handleUpdateCustomer)}
          className='h-[calc(100%-96px)] flex flex-col justify-between'>
          <div className='space-y-4'>
            {dataToDisplay.map((item, index) => (
              <InputWrapper
                key={index}
                label={item.label}
                error={errors[item.id as keyof TypeCreateCustomer]?.message}>
                <Input
                  disabled={item.disabled}
                  {...register(item.id as keyof TypeCreateCustomer)}
                  className='h-11'
                />
              </InputWrapper>
            ))}

            <InputWrapper label='Address' error={errors.address?.message}>
              <Textarea {...register('address')} rows={6} />
            </InputWrapper>
          </div>

          <Button size='xl'>Update</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default CustomerDetails;

import React, { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { cn } from '@/utils/utils';
import SortIcon from '@/assets/icons/SortIcon';
import { useGetMerchantCustomerIdAndNames } from '@/app/query-hooks';

interface Customer {
  value: string;
  label: string;
}

const SortBy: React.FC = () => {
  const [selectedName, setSelectedName] = useState<Customer | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<Customer | null>(null);

  const [uniqueCustomers, setUniqueCustomers] = useState<Customer[]>([]);
  const [customerIds, setCustomerIds] = useState<Customer[]>([]);

  const { data: customers } = useGetMerchantCustomerIdAndNames();

  useEffect(() => {
    if (customers) {
      // Process customer IDs
      const ids = customers.map((customer) => ({
        value: customer.customer_id,
        label: customer.customer_id.toUpperCase(),
      }));
      setCustomerIds(ids);

      // Process unique names
      const uniqueNames = new Set<string>();
      const uniqueCustomersArray: Customer[] = [];

      customers.forEach((customer) => {
        if (customer?.customers?.customer_name && !uniqueNames.has(customer.customers.customer_name)) {
          uniqueNames.add(customer.customers.customer_name);
          uniqueCustomersArray.push({
            value: customer.customers.customer_name,
            label: customer.customers.customer_name.toUpperCase(),
          });
        }
      });

      setUniqueCustomers(uniqueCustomersArray);
    }
  }, [customers]);

  const handleNameSelect = (customer: Customer) => {
    setSelectedName(selectedName?.value === customer.value ? null : customer);
  };

  const handleCustomerIdSelect = (customer: Customer) => {
    setSelectedCustomerId(selectedCustomerId?.value === customer.value ? null : customer);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='border h-10 px-2.5 text-slate-500 bg-white text-sm font-medium border-slate-400/20 flex rounded-md items-center gap-2'>
        <SortIcon /> Sort By
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-[194px] text-sm font-medium text-[#363A4E]'>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Name</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <Command className='w-[194px] text-sm font-medium text-[#363A4E]'>
                <CommandInput placeholder='Name' />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  {uniqueCustomers.map((customer) => (
                    <CommandItem
                      key={customer.value}
                      onSelect={() => handleNameSelect(customer)}
                      className={cn(
                        'hover:cursor-pointer',
                        selectedName?.value === customer.value &&
                          'data-[selected]:bg-purple-700 data-[selected]:text-white'
                      )}>
                      {customer.label}
                    </CommandItem>
                  ))}
                  <CommandSeparator />
                </CommandList>
              </Command>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Customer ID</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className='w-[194px] text-sm font-medium text-[#363A4E]'>
              <Command>
                <CommandInput placeholder='Customer ID' />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  {customerIds.map((customer) => (
                    <CommandItem
                      key={customer.value}
                      onSelect={() => handleCustomerIdSelect(customer)}
                      className={cn(
                        'hover:cursor-pointer',
                        selectedCustomerId?.value === customer.value &&
                          'data-[selected]:bg-purple-700 data-[selected]:text-white'
                      )}>
                      {customer.label}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortBy;

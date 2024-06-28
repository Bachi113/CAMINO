import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
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
import FilterIcon from '@/assets/icons/FilterIcon';
import { cn } from '@/utils/utils';

interface FilterProps {
  customerNames?: string[];
  customerIds?: string[];
  onNameFilterChange: (customerName: string | null) => void;
  onIdFilterChange: (customerId: string | null) => void;
}

const Filter: React.FC<FilterProps> = ({
  customerNames,
  customerIds,
  onNameFilterChange,
  onIdFilterChange,
}) => {
  const [selectedCustomerName, setSelectedCustomerName] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const handleNameFilterChange = (name: string | null) => {
    setSelectedCustomerName(name);
    onNameFilterChange(name);
  };

  const handleIdFilterChange = (id: string | null) => {
    setSelectedCustomerId(id);
    onIdFilterChange(id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='border h-10 px-2.5 text-slate-500 bg-white text-sm font-medium border-slate-400/20 flex rounded-md items-center gap-2'>
        <FilterIcon /> Filter By
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-[194px] text-sm font-medium text-secondary'>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Customer Name</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <Command className='w-[194px] text-sm font-medium text-secondary'>
                <CommandInput placeholder='Search customer' />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandItem
                    key='all'
                    className={cn(
                      'hover:cursor-pointer',
                      selectedCustomerName === null && 'bg-purple-700 text-white'
                    )}
                    onSelect={() => handleNameFilterChange(null)}>
                    All Customers
                  </CommandItem>
                  {customerNames?.map((name) => (
                    <CommandItem
                      key={name}
                      className={cn(
                        'hover:cursor-pointer',
                        selectedCustomerName === name && 'bg-purple-700 text-white'
                      )}
                      onSelect={() => handleNameFilterChange(name)}>
                      {name}
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
            <DropdownMenuSubContent>
              <Command className='w-[194px] text-sm font-medium text-secondary'>
                <CommandInput placeholder='Search customer ID' />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandItem
                    key='all'
                    className={cn(
                      'hover:cursor-pointer',
                      selectedCustomerId === null && 'bg-purple-700 text-white'
                    )}
                    onSelect={() => handleIdFilterChange(null)}>
                    All Customers
                  </CommandItem>
                  {customerIds?.map((id) => (
                    <CommandItem
                      key={id}
                      className={cn(
                        'hover:cursor-pointer',
                        selectedCustomerId === id && 'bg-purple-700 text-white'
                      )}
                      onSelect={() => handleIdFilterChange(id)}>
                      {id}
                    </CommandItem>
                  ))}
                  <CommandSeparator />
                </CommandList>
              </Command>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Filter;

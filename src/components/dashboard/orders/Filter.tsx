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
import { cn } from '@/utils/utils';
import { LuListFilter } from 'react-icons/lu';

interface FilterProps {
  customerNames?: string[];
  onFilterChange: (customerName: string | null) => void;
}

const Filter: React.FC<FilterProps> = ({ customerNames, onFilterChange }) => {
  const [selectedCustomerName, setSelectedCustomerName] = useState<string | null>(null);

  const handleNameFilterChange = (name: string | null) => {
    setSelectedCustomerName(name);
    onFilterChange(name);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='border h-10 px-2.5 text-slate-500 bg-white text-sm font-medium border-slate-400/20 flex rounded-md items-center gap-2'>
        <LuListFilter size={16} /> Filter By
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
                    className='hover:cursor-pointer'
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Filter;

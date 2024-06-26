import React from 'react';
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

interface FilterProps {
  customerNames: string[];
  onFilterChange: (customerName: string | null) => void;
}

const Filter: React.FC<FilterProps> = ({ customerNames, onFilterChange }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='border h-10 px-2.5 text-slate-500 bg-white text-sm font-medium border-slate-400/20 flex rounded-md items-center gap-2'>
        <FilterIcon /> Filter By
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-[194px] text-sm font-medium text-[#363A4E]'>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Customer Name</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <Command className='w-[194px] text-sm font-medium text-[#363A4E]'>
                <CommandInput placeholder='Search customer' />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandItem
                    key='all'
                    className='hover:cursor-pointer'
                    onSelect={() => onFilterChange(null)}>
                    All Customers
                  </CommandItem>
                  {customerNames.map((name) => (
                    <CommandItem
                      key={name}
                      className='hover:cursor-pointer'
                      onSelect={() => onFilterChange(name)}>
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

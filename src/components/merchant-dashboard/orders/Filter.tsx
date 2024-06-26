import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

interface FilterProps {}

const customerNames = [
  { value: 'john doe', label: 'John Doe' },
  { value: 'jane smith', label: 'Jane Smith' },
  { value: 'Michael Johnson', label: 'Michael Johnson' },
];

const Filter: React.FC<FilterProps> = () => {
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
                  {customerNames.map(({ value, label }) => (
                    <CommandItem key={value} className='hover:cursor-pointer'>
                      {label}
                    </CommandItem>
                  ))}
                  <CommandSeparator />
                </CommandList>
              </Command>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuItem className='gap-2'>
          <span>Quantity</span>
        </DropdownMenuItem>
        <DropdownMenuItem className='gap-2'>
          <span>Instalments</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Filter;

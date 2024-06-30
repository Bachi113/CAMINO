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
import { categoryOptions } from '../ModalAddNewProduct';
import { cn } from '@/utils/utils';
import { LuListFilter } from 'react-icons/lu';

interface FilterProps {
  onFilterChange: (ProductName: string | null) => void;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [selectedProductCategory, setSelectedProductCategory] = useState<string | null>(null);

  const handleFilterChange = (name: string | null) => {
    setSelectedProductCategory(name);
    onFilterChange(name);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='border h-10 px-2.5 text-slate-500 bg-white text-sm font-medium border-slate-400/20 flex rounded-md items-center gap-2'>
        <LuListFilter size={16} /> Filter By
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-[194px] text-sm font-medium text-secondary'>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Category</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <Command className='w-[194px] text-sm font-medium text-secondary'>
                <CommandInput placeholder='Search Product' />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandItem
                    key='all'
                    className='hover:cursor-pointer'
                    onSelect={() => handleFilterChange(null)}>
                    All Categories
                  </CommandItem>
                  {categoryOptions?.map((category) => (
                    <CommandItem
                      key={category.value}
                      className={cn(
                        'hover:cursor-pointer',
                        selectedProductCategory === category.value && 'bg-purple-700 text-white'
                      )}
                      onSelect={() => handleFilterChange(category.value)}>
                      {category.label}
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

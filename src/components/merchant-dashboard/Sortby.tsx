import React, { useState } from 'react';
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
import { PiCaretUpDownFill } from 'react-icons/pi';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { categoryOptions } from './ModalAddNewProduct';
import { cn } from '@/utils/utils';

interface SortByProps {
  setCategoryFilter: (category: string) => void;
  setSorting: (sorting: { id: string; desc: boolean }[]) => void;
}

const SortBy: React.FC<SortByProps> = ({ setCategoryFilter, setSorting }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState<{ column: string; direction: 'asc' | 'desc' } | null>(
    null
  );

  const handleCategorySelect = (category: string) => {
    const newCategory = selectedCategory === category ? null : category;
    setSelectedCategory(newCategory);
    setCategoryFilter(newCategory || '');
  };

  const handleSort = (column: string, direction: 'asc' | 'desc') => {
    const newSort =
      selectedSort?.column === column && selectedSort.direction === direction ? null : { column, direction };
    setSelectedSort(newSort);
    setSorting(newSort ? [{ id: column, desc: direction === 'desc' }] : []);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='border h-10 px-2.5 text-slate-500 text-sm font-medium border-slate-400/50 flex rounded-md items-center gap-2'>
        <PiCaretUpDownFill /> Sort By
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-[194px] text-sm font-medium text-slate-700'>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Category</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <Command className='w-[194px] text-sm font-medium text-slate-700'>
                <CommandInput placeholder='Category' />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  {categoryOptions.map(({ value, label }) => (
                    <CommandItem
                      key={value}
                      onSelect={() => handleCategorySelect(value)}
                      className={cn(
                        'hover:cursor-pointer',
                        selectedCategory === value &&
                          'data-[selected]:bg-purple-700 data-[selected]:text-white'
                      )}>
                      {label}
                    </CommandItem>
                  ))}
                  <CommandSeparator />
                </CommandList>
              </Command>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Product ID</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className='w-[194px] text-sm font-medium text-slate-700'>
              {[
                { label: 'Newest First', column: 'id', direction: 'asc' as const },
                { label: 'Oldest First', column: 'id', direction: 'desc' as const },
              ].map(({ label, column, direction }) => (
                <DropdownMenuItem
                  key={direction}
                  onSelect={() => handleSort(column, direction)}
                  className={cn(
                    'hover:cursor-pointer',
                    selectedSort?.column === column &&
                      selectedSort.direction === direction &&
                      'bg-purple-700 focus:bg-purple-700 text-white focus:text-white'
                  )}>
                  {label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortBy;

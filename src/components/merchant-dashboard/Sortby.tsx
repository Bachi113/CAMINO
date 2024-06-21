import React, { FC, useState } from 'react';
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

const SortBy: FC<SortByProps> = ({ setCategoryFilter, setSorting }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState<{ column: string; direction: 'asc' | 'desc' } | null>(
    null
  );

  const handleCategorySelect = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null); // Deselect if already selected
      setCategoryFilter('');
    } else {
      setSelectedCategory(category);
      setCategoryFilter(category);
    }
  };

  const handleSort = (column: string, direction: 'asc' | 'desc') => {
    if (selectedSort?.column === column && selectedSort.direction === direction) {
      setSelectedSort(null);
      setSorting([]);
    } else {
      setSelectedSort({ column, direction });
      setSorting([{ id: column, desc: direction === 'desc' }]);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='border p-2 text-slate-500 text-sm font-medium border-slate-400/50 flex rounded-md items-center gap-1'>
        <PiCaretUpDownFill /> Sort By
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Category</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <Command>
                <CommandInput placeholder='Category' />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  {categoryOptions.map((category) => (
                    <CommandItem
                      key={category.value}
                      onSelect={() => handleCategorySelect(category.value)}
                      className={cn(
                        selectedCategory === category.value &&
                          'data-[selected]:bg-purple-700 data-[selected]:text-white'
                      )}>
                      {category.label}
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
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onSelect={() => handleSort('id', 'asc')}
                className={
                  selectedSort?.column === 'id' && selectedSort.direction === 'asc'
                    ? 'bg-purple-700 focus:bg-purple-700 text-white focus:text-white'
                    : ''
                }>
                Ascending
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => handleSort('id', 'desc')}
                className={
                  selectedSort?.column === 'id' && selectedSort.direction === 'desc'
                    ? 'bg-purple-700 focus:bg-purple-700 text-white focus:text-white'
                    : ''
                }>
                Descending
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortBy;

import React, { useState } from 'react';
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
import { cn } from '@/utils/utils';
import SortIcon from '@/assets/icons/SortIcon';

interface SortByProps {
  setSorting: (sorting: { id: string; desc: boolean }[]) => void;
}

const customerNames = [
  { value: 'john doe', label: 'John Doe' },
  { value: 'jane smith', label: 'Jane Smith' },
  { value: 'Michael Johnson', label: 'Michael Johnson' },
];

const SortBy: React.FC<SortByProps> = ({ setSorting }) => {
  const [selectedSort, setSelectedSort] = useState<{ column: string; direction: 'asc' | 'desc' } | null>(
    null
  );

  const handleSort = (column: string) => {
    let newSort;
    if (selectedSort?.column === column) {
      if (selectedSort.direction === 'asc') {
        newSort = { column, direction: 'desc' as const };
      } else {
        newSort = null;
      }
    } else {
      newSort = { column, direction: 'asc' as const };
    }
    setSelectedSort(newSort);
    setSorting(newSort ? [{ id: column, desc: newSort.direction === 'desc' }] : []);
  };

  const getSortIcon = (column: string) => {
    if (selectedSort?.column === column) {
      return selectedSort.direction === 'asc' ? '↑' : '↓';
    }
    return null;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='border h-10 px-2.5 text-slate-500 bg-white text-sm font-medium border-slate-400/20 flex rounded-md items-center gap-2'>
        <SortIcon /> Sort By
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-[194px] text-sm font-medium text-slate-700'>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Customer Name</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <Command className='w-[194px] text-sm font-medium text-slate-700'>
                <CommandInput placeholder='Search customer' />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  {customerNames.map(({ value, label }) => (
                    <CommandItem
                      key={value}
                      onSelect={() => handleSort('customer_name')}
                      className={cn(
                        'hover:cursor-pointer',
                        selectedSort?.column === 'customer_name' &&
                          'data-[selected]:bg-purple-700 data-[selected]:text-white'
                      )}>
                      {label} {getSortIcon('customer_name')}
                    </CommandItem>
                  ))}
                  <CommandSeparator />
                </CommandList>
              </Command>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuItem onSelect={() => handleSort('quantity')} className='gap-2'>
          <span>Quantity</span> {getSortIcon('quantity')}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleSort('instalments')} className='gap-2'>
          <span>Instalments</span> {getSortIcon('instalments')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortBy;

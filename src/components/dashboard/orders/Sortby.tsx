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
import { cn } from '@/utils/utils';
import { FaSort } from 'react-icons/fa';

interface SortByProps {
  setSorting: (sorting: { id: string; desc: boolean }[]) => void;
}

const SortBy: React.FC<SortByProps> = ({ setSorting }) => {
  const [selectedSort, setSelectedSort] = useState<{ column: string; direction: 'asc' | 'desc' } | null>(
    null
  );

  const handleSort = (column: string, direction: 'asc' | 'desc') => {
    const newSort = { column, direction };
    setSelectedSort(newSort);
    setSorting([{ id: column, desc: direction === 'desc' }]);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='border h-10 px-2.5 text-slate-500 bg-white text-sm font-medium border-slate-400/20 flex rounded-md items-center gap-2'>
        <FaSort /> Sort By
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-[194px] text-sm font-medium text-secondary'>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className='cursor-pointer'>Customer Name</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onSelect={() => handleSort('customer_name', 'asc')}
                className={cn(
                  'gap-2 cursor-pointer',
                  selectedSort?.column === 'customer_name' &&
                    selectedSort.direction === 'asc' &&
                    'bg-purple-700 text-white'
                )}>
                <span>Ascending</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => handleSort('customer_name', 'desc')}
                className={cn(
                  'gap-2 cursor-pointer',
                  selectedSort?.column === 'customer_name' &&
                    selectedSort.direction === 'desc' &&
                    'bg-purple-700 text-white'
                )}>
                <span>Descending</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className='cursor-pointer'>Quantity</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onSelect={() => handleSort('quantity', 'asc')}
                className={cn(
                  'gap-2 cursor-pointer',
                  selectedSort?.column === 'quantity' &&
                    selectedSort.direction === 'asc' &&
                    'bg-purple-700 text-white'
                )}>
                <span>Ascending</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => handleSort('quantity', 'desc')}
                className={cn(
                  'gap-2',
                  selectedSort?.column === 'quantity' &&
                    selectedSort.direction === 'desc' &&
                    'bg-purple-700 text-white'
                )}>
                <span>Descending</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortBy;

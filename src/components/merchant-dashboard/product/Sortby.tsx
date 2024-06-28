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
import SortIcon from '@/assets/icons/SortIcon';

interface SortByProps {
  setSorting: (sorting: { id: string; desc: boolean }[]) => void;
}

const SortBy: React.FC<SortByProps> = ({ setSorting }) => {
  const [selectedSort, setSelectedSort] = useState<{ column: string; direction: 'asc' | 'desc' } | null>(
    null
  );

  const handleSort = (column: string, direction: 'asc' | 'desc') => {
    const newSort =
      selectedSort?.column === column && selectedSort.direction === direction ? null : { column, direction };
    setSelectedSort(newSort);
    setSorting(newSort ? [{ id: column, desc: direction === 'desc' }] : []);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='border h-10 px-2.5 bg-white text-slate-500 text-sm font-medium border-slate-400/20 flex rounded-md items-center gap-2'>
        <SortIcon /> Sort By
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-[194px] text-sm font-medium text-secondary'>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Category</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onSelect={() => handleSort('category', 'asc')}
                className={cn(
                  'gap-2 cursor-pointer',
                  selectedSort?.column === 'category' &&
                    selectedSort.direction === 'asc' &&
                    'bg-purple-700 text-white'
                )}>
                <span>Ascending</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => handleSort('category', 'desc')}
                className={cn(
                  'gap-2 cursor-pointer',
                  selectedSort?.column === 'category' &&
                    selectedSort.direction === 'desc' &&
                    'bg-purple-700 text-white'
                )}>
                <span>Descending</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Product ID</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onSelect={() => handleSort('id', 'asc')}
                className={cn(
                  'gap-2 cursor-pointer',
                  selectedSort?.column === 'id' &&
                    selectedSort.direction === 'asc' &&
                    'bg-purple-700 text-white'
                )}>
                <span>Ascending</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => handleSort('id', 'desc')}
                className={cn(
                  'gap-2 cursor-pointer',
                  selectedSort?.column === 'id' &&
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

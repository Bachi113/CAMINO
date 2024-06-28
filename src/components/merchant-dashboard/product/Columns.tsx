import SortIcon from '@/assets/icons/SortIcon';
import { Button } from '@/components/ui/button';
import { TypeProduct } from '@/types/types';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

export const columns: ColumnDef<TypeProduct>[] = [
  {
    accessorFn: (row, index) => index + 1,
    id: 'sr_no',
    header: 'Sr No.',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'id',
    header: 'Product ID',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='gap-2 p-0'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Date Added
          <SortIcon />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>{format(new Date(row.original?.created_at), 'MMM dd, yyyy')}</div>;
    },
    sortDescFirst: true,
    sortingFn: 'datetime',
  },

  {
    accessorKey: 'product_name',
    header: 'Product Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'remarks',
    header: 'Description',
    cell: ({ row }) => {
      return <div className='text-neutral-400 font-medium'>{row.original.remarks}</div>;
    },
  },
];

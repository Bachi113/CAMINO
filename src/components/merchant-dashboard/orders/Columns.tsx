import SortIcon from '@/assets/icons/SortIcon';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

// TODO: Add proper types
export const columns: ColumnDef<any>[] = [
  {
    accessorFn: (row, index) => index + 1,
    id: 'sr_no',
    header: 'Sr No.',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'order_id',
    header: 'Order ID',
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
          Order Date
          <SortIcon />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>{format(new Date(row.original?.created_at), 'MMM dd, yyyy')}</div>;
    },
  },
  {
    accessorKey: 'product_name',
    header: 'Product',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'customer_name',
    header: 'Customer Name',
    cell: (info) => info.getValue(),
  },

  {
    accessorKey: 'total_amount',
    header: 'Total Amount',
    cell: (info) => info.getValue(),
  },

  {
    accessorKey: 'instalments',
    header: 'Installments',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='gap-2 p-0'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Status
          <SortIcon />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <p className='text-sm text-orange-700 bg-orange-100 px-2 py-[2px] w-fit rounded-md'>
          {row.original.status}
        </p>
      );
    },
  },
];

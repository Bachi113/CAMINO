import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { TypeTransaction } from '@/types/types';
import { FaSort } from 'react-icons/fa';

export const columns: ColumnDef<TypeTransaction>[] = [
  {
    accessorFn: (row, index) => index + 1,
    id: 'sr_no',
    header: 'Sr No.',
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
          Txn date
          <FaSort />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>{format(new Date(row.original?.created_at), 'Pp')}</div>;
    },
  },
  {
    accessorKey: 'stripe_id',
    header: 'Txn ID',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'order_id',
    header: 'Order ID',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'customer_id',
    header: 'Customer ID',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'customer_name',
    header: 'Customer Name',
    cell: (info) => info.getValue(),
  },

  {
    accessorKey: 'product_id',
    header: 'Product ID',
    cell: (info) => info.getValue(),
  },

  {
    accessorKey: 'product_name',
    header: 'Product Name',
    cell: (info) => info.getValue(),
  },
];

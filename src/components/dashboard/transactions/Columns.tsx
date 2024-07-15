import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { TypeTransaction } from '@/types/types';
import { FaSort } from 'react-icons/fa';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<TypeTransaction>[] = [
  {
    accessorFn: (row, index) => index + 1,
    id: 'sr_no',
    header: 'Sr No.',
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
  },
  {
    accessorKey: 'order_id',
    header: 'Order ID',
  },
  {
    accessorKey: 'customer_id',
    header: 'Customer ID',
  },
  {
    accessorKey: 'customer_name',
    header: 'Customer Name',
  },
  {
    accessorKey: 'product_id',
    header: 'Product ID',
  },
  {
    accessorKey: 'product_name',
    header: 'Product Name',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({
      row: {
        original: { status },
      },
    }) => {
      const buttonVariant =
        status === 'completed' ? 'default' : status === 'initiated' ? 'warning' : 'destructive';

      return (
        <Badge variant={buttonVariant} className='capitalize'>
          {status}
        </Badge>
      );
    },
  },
];

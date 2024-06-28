import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import getSymbolFromCurrency from 'currency-symbol-map';
import { TypeOrder } from '@/types/types';
import { FaSort } from 'react-icons/fa';

export const columns: ColumnDef<TypeOrder>[] = [
  {
    accessorFn: (row, index) => index + 1,
    id: 'sr_no',
    header: 'Sr No.',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'id',
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
          <FaSort />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>{format(new Date(row.original?.created_at), 'Pp')}</div>;
    },
  },
  {
    accessorKey: 'product_name',
    header: 'Product',
    cell: ({ row: { original } }) => <div className='w-24'>{(original as any).products.product_name}</div>,
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'customer_name',
    header: 'Customer Name',
    cell: ({ row: { original } }) => (original as any).customers.customer_name,
  },

  {
    accessorKey: 'price',
    header: 'Total Amount',
    cell: ({ row: { original } }) => (
      <div>
        {getSymbolFromCurrency(original.currency)} {Number(original.price) * original.quantity}
      </div>
    ),
  },

  {
    accessorKey: 'period',
    header: 'Installments',
    cell: (info) => info.getValue() ?? '-',
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
          <FaSort />
        </Button>
      );
    },
    cell: ({
      row: {
        original: { status },
      },
    }) => {
      const buttonVariant =
        status === 'active'
          ? 'default'
          : status === 'not_started'
            ? 'outline'
            : status === 'pending'
              ? 'warning'
              : 'destructive';

      return (
        <Badge variant={buttonVariant} className='capitalize'>
          {status}
        </Badge>
      );
    },
  },
];

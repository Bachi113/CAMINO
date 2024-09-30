import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import getSymbolFromCurrency from 'currency-symbol-map';
import { TypeOrder } from '@/types/types';
import { FaSort } from 'react-icons/fa';
import { IoCopyOutline } from 'react-icons/io5';
import { handleCopyPaymentLink } from '@/utils/utils';

export const columns: ColumnDef<TypeOrder>[] = [
  {
    accessorFn: (_, index) => index + 1,
    id: 'sr_no',
    header: 'Sr No.',
  },
  {
    accessorKey: 'id',
    header: 'Order ID',
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
    accessorKey: 'products.product_name',
    header: 'Product',
    cell: ({ row: { original } }) => <div className='w-24'>{(original as any).products?.product_name}</div>,
  },
  {
    accessorKey: 'quantity',
    header: 'Qty',
  },
  {
    accessorKey: 'customers.customer_name',
    header: 'Customer Name',
    cell: ({ row: { original } }) => (original as any).customers?.customer_name,
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
    accessorKey: 'interval',
    header: 'Interval',
    cell: (info) => info.getValue() ?? '-',
  },
  {
    accessorKey: 'id',
    header: 'Payment Link',
    cell: (info) => {
      const linkId = info.getValue() as string;
      const paymentLink = `${process.env.NEXT_PUBLIC_APP_URL}/payment/${linkId}`;
      return (
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={(e) => {
            e.stopPropagation();
            handleCopyPaymentLink(paymentLink);
          }}
          className='w-full h-7 justify-center gap-1 opacity-80 px-2'>
          <span>...{linkId}</span>
          <IoCopyOutline />
        </Button>
      );
    },
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
          : status === 'processing'
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

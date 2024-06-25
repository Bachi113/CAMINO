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
    accessorKey: 'customer_id',
    header: 'Customer ID',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'created_at',
    header: 'Date Added',
    cell: ({ row }) => {
      return <div>{format(new Date(row.original?.created_at), 'MMM dd, yyyy')}</div>;
    },
  },
  {
    accessorFn: (row) => row.customer?.name,
    id: 'customer_name',
    header: 'Customer Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorFn: (row) => row.customer?.email,
    id: 'customer_email',
    header: 'Email',
    cell: (info) => info.getValue(),
  },
  {
    accessorFn: (row) => row.customers?.number,
    accessorKey: 'number',
    header: 'Number',
    cell: (info) => info.getValue(),
  },
  {
    accessorFn: (row) => row.customers?.address,
    accessorKey: 'address',
    header: 'Address',
    cell: (info) => info.getValue(),
  },
];

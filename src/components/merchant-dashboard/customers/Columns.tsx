import SortIcon from '@/assets/icons/SortIcon';
import { Button } from '@/components/ui/button';
import { TypeCustomerDetails } from '@/types/types';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

export const columns: ColumnDef<TypeCustomerDetails>[] = [
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
  },
  {
    accessorFn: (row) => row.customers?.customer_name,
    id: 'customer_name',
    header: 'Customer Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorFn: (row) => row.customers?.email,
    id: 'email',
    header: 'Email',
    cell: (info) => info.getValue(),
  },
  {
    accessorFn: (row) => row.customers?.phone,
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

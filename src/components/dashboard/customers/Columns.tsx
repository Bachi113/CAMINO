import { Button } from '@/components/ui/button';
import { TypeCustomerDetails } from '@/types/types';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { FaSort } from 'react-icons/fa';

// Define columns array with the correct type
export const columns: ColumnDef<TypeCustomerDetails>[] = [
  {
    accessorFn: (row, index) => index + 1,
    id: 'sr_no',
    header: 'Sr No.',
  },
  {
    accessorKey: 'customer_id',
    header: 'Customer ID',
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
          <FaSort />
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
  },
  {
    accessorFn: (row) => row.customers?.email,
    id: 'email',
    header: 'Email',
    cell: (info) => info.getValue() || '-',
  },
  {
    accessorFn: (row) => row.customers?.phone,
    id: 'phone',
    header: 'Phone',
    cell: (info) => info.getValue() || '-',
  },
  {
    accessorFn: (row) => row.customers?.address,
    id: 'address',
    header: 'Address',
  },
];

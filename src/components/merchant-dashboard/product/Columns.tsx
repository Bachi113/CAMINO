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
    accessorKey: 'id',
    header: 'Product ID',
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
      return <div className='text-gray-400'>{row.original.remarks}</div>;
    },
  },
];

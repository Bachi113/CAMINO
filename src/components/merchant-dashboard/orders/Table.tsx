'use client';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import {
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { columns } from './Columns';
import SortBy from '@/components/merchant-dashboard/orders/Sortby';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { debounce } from '@/utils/utils';
import TransactionSummary from './OrderSummary';
import DownloadButton from '../DowloadCsvButton';
import Filter from './Filter';
import SearchIcon from '@/assets/icons/SearchIcon';

const data = [
  {
    order_id: 'ORD001',
    created_at: '2024-06-25T10:30:00Z',
    product_name: 'Product A',
    quantity: 2,
    customer_name: 'John Doe',
    total_amount: '$200.00',
    instalments: 3,
    status: 'Due',
    next_instalment_date: '2024-07-25T00:00:00Z',
    end_instalment_date: '2024-09-25T00:00:00Z',
    paid_amount: '$150.00',
    product_id: 'PROD001',
    product_date: '2024-06-20T00:00:00Z',
  },
  {
    order_id: 'ORD002',
    created_at: '2024-06-24T09:15:00Z',
    product_name: 'Product B',
    quantity: 1,
    customer_name: 'Jane Smith',
    total_amount: '$150.00',
    instalments: 2,
    status: 'Completed',
    next_instalment_date: '2024-07-24T00:00:00Z',
    end_instalment_date: '2024-08-24T00:00:00Z',
    paid_amount: '$120.00',
    product_id: 'PROD002',
    product_date: '2024-06-19T00:00:00Z',
  },
  {
    order_id: 'ORD003',
    created_at: '2024-06-23T14:00:00Z',
    product_name: 'Product C',
    quantity: 3,
    customer_name: 'Michael Johnson',
    total_amount: '$300.00',
    instalments: 4,
    status: 'On Course',
    next_instalment_date: '2024-07-23T00:00:00Z',
    end_instalment_date: '2024-10-23T00:00:00Z',
    paid_amount: '$250.00',
    product_id: 'PROD003',
    product_date: '2024-06-18T00:00:00Z',
  },
];

const ProductsTable: React.FC = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isLoading = false;

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
  });

  useEffect(() => {
    if (searchInputRef.current && document.activeElement !== searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [data]);

  const handleGlobalFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debounce(() => setSearchQuery(value), 300)();
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    if (data?.length === pageSize) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <>
      <div className='mt-10 flex justify-between items-center w-full'>
        <div className='relative'>
          <span className='absolute left-2 top-2.5'>
            <SearchIcon />
          </span>
          <Input
            ref={searchInputRef}
            placeholder='Search order details'
            defaultValue={searchQuery}
            disabled={isLoading}
            onChange={handleGlobalFilterChange}
            className='w-[350px] h-10 pl-8'
          />
        </div>
        <div className='flex gap-2'>
          <SortBy setSorting={setSorting} />
          <Filter />
          <DownloadButton fileName='orders' data={data} />
        </div>
      </div>

      <div className='mt-10'>
        {isLoading ? (
          <div className='flex gap-3 justify-center items-center h-full'>
            <div className='spinner-border animate-spin inline-block size-8 border-4 rounded-full' />
            <span className='text-slate-500 font-medium'>Loading...</span>
          </div>
        ) : (
          <Table className='bg-white border rounded-md w-full'>
            <TableHeader className='h-[54px]'>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className='pl-6'>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    onClick={() => setSelectedProduct(row.original)}
                    className='cursor-pointer text-[#363A4E] font-medium h-16 '>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className='pl-6'>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className='h-24 text-center'>
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
      <div className='flex justify-end gap-2 mt-4'>
        <Button variant='outline' size='sm' onClick={handlePreviousPage} disabled={page === 1}>
          Previous
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={handleNextPage}
          disabled={!data || data.length < pageSize}>
          Next
        </Button>
      </div>
      {selectedProduct && <TransactionSummary setIsOpen={setSelectedProduct} data={selectedProduct} />}
    </>
  );
};

export default ProductsTable;

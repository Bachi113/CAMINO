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
import OrderSummary from './OrderSummary';
import DownloadButton from '../DowloadCsvButton';
import SearchIcon from '@/assets/icons/SearchIcon';
import { useGetOrders } from '@/app/query-hooks';
import { TypeOrder } from '@/types/types';
import { queryClient } from '@/app/providers';
import { supabaseBrowserClient } from '@/utils/supabase/client';

const OrdersTable: React.FC = () => {
  const supabase = supabaseBrowserClient();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedProduct, setSelectedProduct] = useState<TypeOrder>();
  // const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(7);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isLoading = false;

  const { data } = useGetOrders(page, pageSize);

  // const filteredData = useMemo(() => {
  //   return data.filter((order) => (selectedCustomer ? order.customer_name === selectedCustomer : true));
  // }, [data, selectedCustomer]);

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
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('value-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
        },
        () => queryClient.invalidateQueries({ queryKey: ['getOrders'] })
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleGlobalFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debounce(() => setSearchQuery(value), 300)();
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (data?.length === pageSize) {
      setPage(page + 1);
    }
  };

  // const handleFilterChange = (customerName: string | null) => {
  //   setSelectedCustomer(customerName);
  // };

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
          {/* <Filter customerNames={customerNames} onFilterChange={handleFilterChange} /> */}
          <DownloadButton fileName='orders' data={data!} />
        </div>
      </div>

      <div className='mt-10'>
        {isLoading ? (
          <div className='flex gap-3 justify-center items-center h-full'>
            <div className='spinner-border animate-spin inline-block size-8 border-4 rounded-full' />
            <span className='text-slate-500 font-medium'>Loading...</span>
          </div>
        ) : (
          <Table className='bg-white overflow-auto rounded-md w-full'>
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

      {selectedProduct && (
        <OrderSummary data={selectedProduct} handleSheetOpen={() => setSelectedProduct(undefined)} />
      )}
    </>
  );
};

export default OrdersTable;

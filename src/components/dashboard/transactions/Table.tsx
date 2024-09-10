'use client';

import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import {
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { columns } from './Columns';
import SortBy from './Sortby';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/utils';
import DownloadButton from '../DowloadCsvButton';
import { TypeTransaction } from '@/types/types';
import { queryClient } from '@/app/providers';
import { supabaseBrowserClient } from '@/utils/supabase/client';
import Filter from './Filter';
import { HiOutlineSearch } from 'react-icons/hi';
import { LuLoader } from 'react-icons/lu';
import { TbReload } from 'react-icons/tb';
import TransactionDetails from './TransactionDetails';
import { useGetTransactions } from '@/hooks/query';

const TransactionsTable: React.FC = () => {
  const supabase = supabaseBrowserClient();
  const [customerNames, setCustomerNames] = useState<string[]>();
  const [isRotating, setIsRotating] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedProduct, setSelectedProduct] = useState<TypeTransaction>();
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  const { data, isLoading, isError } = useGetTransactions();

  const filteredData = useMemo(() => {
    return data && data.filter((tx) => (selectedCustomer ? tx.customer_name === selectedCustomer : true));
  }, [data, selectedCustomer]);

  const table = useReactTable({
    data: filteredData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting },
  });

  useEffect(() => {
    if (data) {
      const customerNames: string[] = Array.from(
        new Set(data.map((tx) => tx.customer_name).filter((name): name is string => !!name))
      );

      setCustomerNames(customerNames);
    }
  }, [data]);

  useEffect(() => {
    const channel = supabase
      .channel('value-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
        },
        () => queryClient.invalidateQueries({ queryKey: ['getTransactions'] })
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleGlobalFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    table.setGlobalFilter(value);
  };

  const handleFilterChange = (customerName: string | null) => {
    setSelectedCustomer(customerName);
  };

  const handleRefreshFn = () => {
    setIsRotating(true);
    queryClient.invalidateQueries({ queryKey: ['getTransactions'] });
    setTimeout(() => setIsRotating(false), 1000);
  };

  return (
    <>
      <div className='mt-5 flex justify-between items-center w-full'>
        <div className='relative'>
          <span className='absolute left-2 top-3'>
            <HiOutlineSearch className='text-gray-500' />
          </span>
          <Input
            placeholder='Type here to search transaction'
            onChange={handleGlobalFilterChange}
            className='w-[350px] h-10 pl-8'
          />
        </div>

        <div className='flex items-center gap-2'>
          <Button size='icon' variant='outline' onClick={handleRefreshFn} className='size-10 shadow-none'>
            <TbReload size={20} className={cn(isRotating && 'animate-[spin_1s_linear]')} />
          </Button>
          <SortBy setSorting={setSorting} />
          <Filter customerNames={customerNames} onFilterChange={handleFilterChange} />
          <DownloadButton fileName='transacrions' data={data!} />
        </div>
      </div>

      <div className='mt-6'>
        {isLoading || isError ? (
          <div className='flex gap-3 justify-center items-center h-full'>
            {!isError ? (
              <LuLoader className='animate-[spin_2s_linear_infinite]' size={16} />
            ) : (
              <span className='text-sm opacity-60'>Error fetching transactions.</span>
            )}
          </div>
        ) : (
          <Table className='max-h-[calc(100vh-180px)] bg-white overflow-auto rounded-md w-full'>
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
                    className='cursor-pointer text-secondary font-medium h-16 '>
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

      {selectedProduct && (
        <TransactionDetails data={selectedProduct} handleSheetOpen={() => setSelectedProduct(undefined)} />
      )}
    </>
  );
};

export default TransactionsTable;

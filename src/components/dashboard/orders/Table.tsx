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
import OrderDetails from './OrderDetails';
import DownloadButton from '../DowloadCsvButton';
import { useGetOrders } from '@/hooks/query';
import { TypeOrder } from '@/types/types';
import { queryClient } from '@/app/providers';
import { supabaseBrowserClient } from '@/utils/supabase/client';
import Filter from './Filter';
import { HiOutlineSearch } from 'react-icons/hi';
import { LuLoader } from 'react-icons/lu';
import { TbReload } from 'react-icons/tb';
import ModalCreatePaymentLink from '../ModalCreatePaymentLink';

interface OrdersTableProps {
  isMerchant: boolean;
}

// const data = [
//   {
//     id: '6c31189d27b',
//     created_at: '2024-09-11T14:40:35.165044+00:00',
//     user_id: 'a8514366-0847-4d4c-89ec-3a76afcfca59',
//     stripe_id: null,
//     stripe_cus_id: 'cus_QpWjoP1MVe7uVL',
//     product_id: '98a69baf8e8',
//     currency: 'USD',
//     price: '20',
//     quantity: 1,
//     installments_options: [
//       {
//         id: 1,
//         count: 3,
//         interval: 'day',
//       },
//       {
//         id: 2,
//         count: 2,
//         interval: 'week',
//       },
//       {
//         id: 3,
//         count: 3,
//         interval: 'month',
//       },
//       {
//         id: 4,
//         count: 6,
//         interval: 'month',
//       },
//       {
//         id: 5,
//         count: 12,
//         interval: 'month',
//       },
//       {
//         id: 7,
//         count: 3,
//         interval: 'year',
//       },
//     ],
//     interval: null,
//     period: null,
//     status: 'pending',
//     products: { product_name: 'Glory C3 Smartphone' },
//     customers: {
//       email: 'nadaaofficial19@gmail.com',
//       phone: '+91 9152018835',
//       customer_name: 'Nada Farook',
//     },
//   },
//   {
//     id: 'a8b903262d8',
//     created_at: '2024-09-11T14:38:29.821959+00:00',
//     user_id: 'a8514366-0847-4d4c-89ec-3a76afcfca59',
//     stripe_id: 'sub_1Pxrk3SJAHz9RUEILnMmybrd',
//     stripe_cus_id: 'cus_QpWjoP1MVe7uVL',
//     product_id: '98a69baf8e8',
//     currency: 'USD',
//     price: '20',
//     quantity: 1,
//     installments_options: [
//       {
//         id: 1,
//         count: 3,
//         interval: 'day',
//       },
//       {
//         id: 2,
//         count: 2,
//         interval: 'week',
//       },
//       {
//         id: 3,
//         count: 3,
//         interval: 'month',
//       },
//       {
//         id: 4,
//         count: 6,
//         interval: 'month',
//       },
//       {
//         id: 5,
//         count: 12,
//         interval: 'month',
//       },
//       {
//         id: 7,
//         count: 3,
//         interval: 'year',
//       },
//     ],
//     interval: 'month',
//     period: 3,
//     status: 'processing',
//     products: { product_name: 'Glory C3 Smartphone' },
//     customers: {
//       email: 'nadaaofficial19@gmail.com',
//       phone: '+91 9152018835',
//       customer_name: 'Nada Farook',
//     },
//   },
// ];
// const isLoading = false;
// const isError = null;

const OrdersTable: React.FC<OrdersTableProps> = ({ isMerchant }) => {
  const supabase = supabaseBrowserClient();
  const [customerNames, setCustomerNames] = useState<string[]>();
  const [isRotating, setIsRotating] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedProduct, setSelectedProduct] = useState<TypeOrder>();
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  const { data, isLoading, isError } = useGetOrders();

  const filteredData = useMemo(() => {
    return (
      data &&
      data.filter((order) => (selectedCustomer ? order.customers?.customer_name === selectedCustomer : true))
    );
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
        new Set(data.map((order) => order.customers?.customer_name).filter((name): name is string => !!name))
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
    table.setGlobalFilter(value);
  };

  const handleFilterChange = (customerName: string | null) => {
    setSelectedCustomer(customerName);
  };

  const handleRefreshFn = () => {
    setIsRotating(true);
    queryClient.invalidateQueries({ queryKey: ['getOrders'] });
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
            placeholder='Type here to search order'
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
          <DownloadButton fileName='orders' data={data!} />
          {isMerchant && <ModalCreatePaymentLink />}
        </div>
      </div>

      <div className='mt-6'>
        {isLoading || isError ? (
          <div className='flex gap-3 justify-center items-center h-full'>
            {!isError ? (
              <LuLoader className='animate-[spin_2s_linear_infinite]' size={16} />
            ) : (
              <span className='text-sm opacity-60'>Error fetching orders.</span>
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
        <OrderDetails data={selectedProduct} handleSheetOpen={() => setSelectedProduct(undefined)} />
      )}
    </>
  );
};

export default OrdersTable;

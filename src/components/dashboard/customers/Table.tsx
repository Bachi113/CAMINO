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
import ModalAddNewCustomer from '../ModalAddNewCustomer';
import { useGetMerchantCustomers } from '@/hooks/query';
import CustomerDetails from './CustomerDetails';
import DownloadButton from '../DowloadCsvButton';
import Filter from './Filter';
import { HiOutlineSearch } from 'react-icons/hi';
import { LuLoader } from 'react-icons/lu';
import { TbReload } from 'react-icons/tb';
import { queryClient } from '@/app/providers';

interface CustomersTableProps {
  isMerchant: boolean;
}

const CustomersTable: React.FC<CustomersTableProps> = ({ isMerchant }) => {
  const [isRotating, setIsRotating] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedCustomerName, setSelectedCustomerName] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [customerNames, setCustomerNames] = useState<string[]>();
  const [customerIds, setCustomerIds] = useState<string[]>();

  const { data, isLoading } = useGetMerchantCustomers(isMerchant);

  const filteredData = useMemo(() => {
    return (
      data &&
      data.filter((order) => {
        const matchesCustomerName = selectedCustomerName
          ? order.customers?.customer_name === selectedCustomerName
          : true;

        const matchesCustomerId = selectedCustomerId ? order.customer_id === selectedCustomerId : true;
        return matchesCustomerName && matchesCustomerId;
      })
    );
  }, [data, selectedCustomerName, selectedCustomerId]);

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
      const customerNames: string[] = data.map((customer) => customer.customers?.customer_name ?? '');
      const customerIds: string[] = data.map((customer) => customer.customer_id);
      setCustomerNames(customerNames);
      setCustomerIds(customerIds);
    }
  }, [data]);

  const handleGlobalFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    table.setGlobalFilter(value);
  };

  const handleNameFilterChange = (customerName: string | null) => {
    setSelectedCustomerName(customerName);
  };

  const handleIdFilterChange = (customerId: string | null) => {
    setSelectedCustomerId(customerId);
  };

  const handleRefreshFn = () => {
    setIsRotating(true);
    queryClient.invalidateQueries({ queryKey: ['getMerchantCustomers'] });
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
            placeholder='Type here to search customer'
            onChange={handleGlobalFilterChange}
            className='w-[350px] h-10 pl-8'
          />
        </div>

        <div className='flex items-center gap-2'>
          <Button size='icon' variant='outline' onClick={handleRefreshFn} className='size-10 shadow-none'>
            <TbReload size={20} className={cn(isRotating && 'animate-[spin_1s_linear]')} />
          </Button>
          <SortBy setSorting={setSorting} />
          <Filter
            customerNames={customerNames}
            customerIds={customerIds}
            onNameFilterChange={handleNameFilterChange}
            onIdFilterChange={handleIdFilterChange}
          />
          <DownloadButton data={data} fileName='customers' />
          {isMerchant && <ModalAddNewCustomer triggerButton={true} />}
        </div>
      </div>

      <div className='mt-6'>
        {isLoading ? (
          <div className='flex gap-3 justify-center items-center h-full text-slate-500'>
            <LuLoader className='animate-[spin_2s_linear_infinite]' size={16} />
            <span className='font-medium'>Loading...</span>
          </div>
        ) : (
          <Table className='max-h-[calc(100vh-180px)] bg-white overflow-auto rounded-md'>
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
                    onClick={() => setSelectedCustomer(row.original)}
                    className='cursor-pointer text-secondary font-medium h-16'>
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

      {selectedCustomer && (
        <CustomerDetails handleSheetOpen={() => setSelectedCustomer(undefined)} data={selectedCustomer} />
      )}
    </>
  );
};

export default CustomersTable;

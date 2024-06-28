'use client';
import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { columns } from '@/components/merchant-dashboard/customers/Columns';
import SortBy from '@/components/merchant-dashboard/customers/Sortby';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { debounce } from '@/utils/utils';
import ModalAddNewCustomer from '@/components/merchant-dashboard/ModalAddNewCustomer';
import { useGetMerchantCustomers } from '@/app/query-hooks';
import CustomerDetails from '@/components/merchant-dashboard/customers/CustomerDetails';
import DownloadButton from '@/components/merchant-dashboard/DowloadCsvButton';
import SearchIcon from '@/assets/icons/SearchIcon';
import Filter from '@/components/merchant-dashboard/customers/Filter';

const CustomersTable: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedCustomerName, setSelectedCustomerName] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [customerNames, setCustomerNames] = useState<string[]>();
  const [customerIds, setCustomerIds] = useState<string[]>();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useGetMerchantCustomers({
    page,
    pageSize,
    searchQuery,
  });

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
    state: { sorting },
  });

  useEffect(() => {
    if (searchInputRef.current && document.activeElement !== searchInputRef.current) {
      searchInputRef.current.focus();
    }
    if (data) {
      const customerNames: string[] = data.map((customer) => customer.customers?.customer_name ?? '');
      const customerIds: string[] = data.map((customer) => customer.customer_id);
      setCustomerNames(customerNames);
      setCustomerIds(customerIds);
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

  const handleNameFilterChange = (customerName: string | null) => {
    setSelectedCustomerName(customerName);
  };

  const handleIdFilterChange = (customerId: string | null) => {
    setSelectedCustomerId(customerId);
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
          <Filter
            customerNames={customerNames}
            customerIds={customerIds}
            onNameFilterChange={handleNameFilterChange}
            onIdFilterChange={handleIdFilterChange}
          />
          <DownloadButton data={data} fileName='customers' />
          <ModalAddNewCustomer isOpen={isModalOpen} handleModalOpen={setIsModalOpen} triggerButton={true} />
        </div>
      </div>

      <div className='mt-10'>
        {isLoading ? (
          <div className='flex gap-3 justify-center items-center h-full'>
            <div className='spinner-border animate-spin inline-block size-8 border-4 rounded-full' />
            <span className='text-slate-500 font-medium'>Loading...</span>
          </div>
        ) : (
          <Table className='bg-white overflow-auto rounded-md'>
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
      {selectedCustomer && <CustomerDetails setIsOpen={setSelectedCustomer} data={selectedCustomer} />}
    </>
  );
};

export default CustomersTable;

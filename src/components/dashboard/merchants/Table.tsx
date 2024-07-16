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
import { columns } from './Columns';
import SortBy from './Sortby';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn, debounce } from '@/utils/utils';
import DownloadButton from '../DowloadCsvButton';
import { TypeMerchantDetails } from '@/types/types';
import { queryClient } from '@/app/providers';
import Filter from './Filter';
import { HiOutlineSearch } from 'react-icons/hi';
import { LuLoader } from 'react-icons/lu';
import { TbReload } from 'react-icons/tb';
import { useGetMerchnats } from '@/hooks/query';
import MerchantDetails from './MerchantDetails';

const MerchantsTable: React.FC = () => {
  const [merchantNames, setMerchantNames] = useState<string[]>();
  const [isRotating, setIsRotating] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedProduct, setSelectedProduct] = useState<TypeMerchantDetails>();
  const [selectedMerchant, setSelectedMerchant] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(7);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, isError } = useGetMerchnats(page, pageSize, searchQuery);

  const filteredData = useMemo(() => {
    return (
      data &&
      data.filter((m) => (selectedMerchant ? m.personal_informations?.first_name === selectedMerchant : true))
    );
  }, [data, selectedMerchant]);

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
      const merchantNames: string[] = Array.from(
        new Set(data.map((m) => m.personal_informations?.first_name).filter((name): name is string => !!name))
      );

      setMerchantNames(merchantNames);
    }
  }, [data]);

  const handleGlobalFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debounce(() => setSearchQuery(value), 500)();
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

  const handleFilterChange = (merchantName: string | null) => {
    setSelectedMerchant(merchantName);
  };

  const handleRefreshFn = () => {
    setIsRotating(true);
    queryClient.invalidateQueries({ queryKey: ['getAllMerchants'] });
    setTimeout(() => setIsRotating(false), 1000);
  };

  return (
    <>
      <div className='mt-10 flex justify-between items-center w-full'>
        <div className='relative'>
          <span className='absolute left-2 top-3'>
            <HiOutlineSearch className='text-gray-500' />
          </span>
          <Input
            ref={searchInputRef}
            placeholder='Search merchant details'
            defaultValue={searchQuery}
            disabled={isLoading}
            onChange={handleGlobalFilterChange}
            className='w-[350px] h-10 pl-8'
          />
        </div>
        <div className='flex items-center gap-2'>
          <Button size='icon' variant='outline' onClick={handleRefreshFn}>
            <TbReload size={20} className={cn(isRotating && 'animate-[spin_1s_linear]')} />
          </Button>
          <SortBy setSorting={setSorting} />
          <Filter merchantNames={merchantNames} onFilterChange={handleFilterChange} />
          <DownloadButton fileName='merchants' data={data!} />
        </div>
      </div>

      <div className='mt-8'>
        {isLoading || isError ? (
          <div className='flex gap-3 justify-center items-center h-full'>
            {!isError ? (
              <LuLoader className='animate-[spin_2s_linear_infinite]' size={16} />
            ) : (
              <span className='text-sm opacity-60'>Error fetching merchants.</span>
            )}
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

      <div className='flex justify-end gap-2 mt-4'>
        <Button variant='outline' size='sm' onClick={handlePreviousPage} disabled={page === 1}>
          Previous
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={handleNextPage}
          disabled={!data || data.length <= pageSize}>
          Next
        </Button>
      </div>

      {selectedProduct && (
        <MerchantDetails data={selectedProduct} handleSheetOpen={() => setSelectedProduct(undefined)} />
      )}
    </>
  );
};

export default MerchantsTable;

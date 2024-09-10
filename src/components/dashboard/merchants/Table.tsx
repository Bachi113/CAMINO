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

  const { data, isLoading, isError } = useGetMerchnats();

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
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting },
  });

  useEffect(() => {
    if (data) {
      const merchantNames: string[] = Array.from(
        new Set(data.map((m) => m.personal_informations?.first_name).filter((name): name is string => !!name))
      );

      setMerchantNames(merchantNames);
    }
  }, [data]);

  const handleGlobalFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    table.setGlobalFilter(value);
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
      <div className='mt-5 flex justify-between items-center w-full'>
        <div className='relative'>
          <span className='absolute left-2 top-3'>
            <HiOutlineSearch className='text-gray-500' />
          </span>
          <Input
            placeholder='Type here to search merchant'
            onChange={handleGlobalFilterChange}
            className='w-[350px] h-10 pl-8'
          />
        </div>

        <div className='flex items-center gap-2'>
          <Button size='icon' variant='outline' onClick={handleRefreshFn} className='size-10 shadow-none'>
            <TbReload size={20} className={cn(isRotating && 'animate-[spin_1s_linear]')} />
          </Button>
          <SortBy setSorting={setSorting} />
          <Filter merchantNames={merchantNames} onFilterChange={handleFilterChange} />
          <DownloadButton fileName='merchants' data={data!} />
        </div>
      </div>

      <div className='mt-6'>
        {isLoading || isError ? (
          <div className='flex gap-3 justify-center items-center h-full'>
            {!isError ? (
              <LuLoader className='animate-[spin_2s_linear_infinite]' size={16} />
            ) : (
              <span className='text-sm opacity-60'>Error fetching merchants.</span>
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
        <MerchantDetails data={selectedProduct} handleSheetOpen={() => setSelectedProduct(undefined)} />
      )}
    </>
  );
};

export default MerchantsTable;

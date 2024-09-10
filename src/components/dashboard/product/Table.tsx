'use client';

import React, { ChangeEvent, useMemo, useState } from 'react';
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
import ModalAddNewProduct from '../ModalAddNewProduct';
import SortBy from './Sortby';
import { useGetMerchantProducts } from '@/hooks/query';
import ProductDetails from './ProductDetails';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/utils';
import Filter from './Filter';
import DownloadButton from '../DowloadCsvButton';
import { HiOutlineSearch } from 'react-icons/hi';
import { LuLoader } from 'react-icons/lu';
import { TbReload } from 'react-icons/tb';
import { queryClient } from '@/app/providers';

const ProductsTable: React.FC = () => {
  const [isRotating, setIsRotating] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const { data, isLoading } = useGetMerchantProducts();

  const filteredData = useMemo(() => {
    return data?.filter((product) => (selectedFilter ? product.category === selectedFilter : true));
  }, [data, selectedFilter]);

  const table = useReactTable({
    data: filteredData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting },
  });

  const handleGlobalFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    table.setGlobalFilter(value);
  };

  const handleFilterChange = (customerName: string | null) => {
    setSelectedFilter(customerName);
  };

  const handleRefreshFn = () => {
    setIsRotating(true);
    queryClient.invalidateQueries({ queryKey: ['getMerchantProducts'] });
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
            placeholder='Type here to search product'
            onChange={handleGlobalFilterChange}
            className='w-[350px] h-10 pl-8'
          />
        </div>

        <div className='flex items-center gap-2'>
          <Button size='icon' variant='outline' onClick={handleRefreshFn} className='size-10 shadow-none'>
            <TbReload size={20} className={cn(isRotating && 'animate-[spin_1s_linear]')} />
          </Button>
          <SortBy setSorting={setSorting} />
          <Filter onFilterChange={handleFilterChange} />
          <DownloadButton fileName='products' data={data!} />
          <ModalAddNewProduct triggerButton={true} />
        </div>
      </div>

      <div className='mt-6'>
        {isLoading ? (
          <div className='flex gap-3 justify-center items-center h-full'>
            <LuLoader className='animate-[spin_2s_linear_infinite]' size={16} />
            <span className='text-slate-500 font-medium'>Loading...</span>
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

      {selectedProduct && (
        <ProductDetails handleSheetOpen={() => setSelectedProduct(undefined)} data={selectedProduct} />
      )}
    </>
  );
};

export default ProductsTable;

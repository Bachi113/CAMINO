'use client';
import React, { FC, useMemo, useState } from 'react';
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
import ModalAddNewProduct from '@/components/merchant-dashboard/ModalAddNewProduct';
import SortBy from '@/components/merchant-dashboard/Sortby';
import { useGetMerchantProducts } from '@/app/query-hooks';
import ProductDescription from './ProductDescription';
import { Button } from '@/components/ui/button';

interface TableProps {}

const OrderTable: FC<TableProps> = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const { data, isLoading } = useGetMerchantProducts({ page, pageSize, categoryFilter });

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting },
  });

  const handleRowClick = (data: any) => {
    setSelectedProduct(data);
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

  return (
    <>
      <div className='mt-5 flex justify-between w-full'>
        <div>search</div>
        <div className='flex gap-5'>
          <SortBy setCategoryFilter={setCategoryFilter} setSorting={setSorting} />
          <ModalAddNewProduct />
        </div>
      </div>

      <div className='h-[calc(100vh-270px)] rounded-md border overflow-auto mt-10'>
        {isLoading ? (
          <div className='flex gap-3 justify-center items-center h-full'>
            <div className='spinner-border animate-spin inline-block size-8 border-4 rounded-full' />
            <span className='text-slate-500 font-medium'>Loading...</span>
          </div>
        ) : (
          data && (
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      onClick={() => handleRowClick(row.original)}
                      className='cursor-pointer text-slate-700 font-medium h-12'>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
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
          )
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
          disabled={data && data.length < pageSize}>
          Next
        </Button>
      </div>
      {selectedProduct && <ProductDescription setIsOpen={setSelectedProduct} data={selectedProduct} />}
    </>
  );
};

export default OrderTable;

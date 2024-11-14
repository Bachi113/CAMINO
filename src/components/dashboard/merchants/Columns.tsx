import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { TypeMerchantDetails } from '@/types/types';

export const formatDate = (date: string | null | undefined) => (date ? format(new Date(date), 'Pp') : '-');

export const formatAddress = (address: TypeMerchantDetails['business_addresses']) =>
  address ? `${address.street_address}, ${address.postal_code}, ${address.country}` : '-';

export const formatName = (info: TypeMerchantDetails['personal_informations']) =>
  info ? `${info.first_name} ${info.last_name}` : '-';

export const columns: ColumnDef<TypeMerchantDetails>[] = [
  {
    accessorFn: (_, index) => index + 1,
    id: 'sr_no',
    header: 'Sr No.',
  },
  {
    accessorKey: 'onboarded_at',
    header: 'Dated At',
    cell: ({ row }) => formatDate(row.original.onboarded_at),
  },
  {
    accessorKey: 'personal_informations.id',
    header: 'Merchant ID',
  },
  {
    id: 'merchant_name',
    header: 'Merchant Name',
    accessorFn: (row) =>
      `${row.personal_informations?.first_name || ''} ${row.personal_informations?.last_name || ''}`.trim(),
    cell: ({ row }) => formatName(row.original.personal_informations),
  },
  {
    accessorKey: 'business_addresses.city',
    header: 'Location',
  },
  {
    id: 'address',
    header: 'Address',
    accessorFn: (row) =>
      `${row.business_addresses?.street_address || ''} ${row.business_addresses?.postal_code || ''} ${row.business_addresses?.country || ''}`.trim(),
    cell: ({ row }) => formatAddress(row.original.business_addresses),
  },
  {
    accessorKey: 'bank_details.account_number',
    header: 'Bank Acc. No',
  },
  {
    accessorKey: 'bank_details.swift_code',
    header: 'Swift Code',
  },
  {
    accessorKey: 'bank_details.iban_code',
    header: 'IBAN',
  },
];

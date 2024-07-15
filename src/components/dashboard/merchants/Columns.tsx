import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { TypeMerchantDetails } from '@/types/types';

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
    cell: ({ row }) => format(new Date(row.original.onboarded_at!), 'Pp'),
  },
  {
    accessorKey: 'personal_informations.id',
    header: 'Merchant ID',
  },
  {
    accessorKey: 'merchant_name',
    header: 'Merchant Name',
    cell: ({ row }) => formatName(row.original.personal_informations),
  },
  {
    accessorKey: 'business_addresses.city',
    header: 'Location',
  },
  {
    accessorKey: 'address',
    header: 'Address',
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

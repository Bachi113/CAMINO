import { TypeInterval } from '@/types/types';

export type TypeInstallmentOption = {
  id: number;
  count: number;
  interval: TypeInterval;
};

export const installmentOptions: TypeInstallmentOption[] = [
  {
    id: 1,
    count: 3,
    interval: 'day',
  },
  {
    id: 2,
    count: 2,
    interval: 'week',
  },
  {
    id: 3,
    count: 3,
    interval: 'month',
  },
  {
    id: 4,
    count: 6,
    interval: 'month',
  },
  {
    id: 5,
    count: 12,
    interval: 'month',
  },
  {
    id: 6,
    count: 24,
    interval: 'month',
  },
  {
    id: 7,
    count: 3,
    interval: 'year',
  },
];

export const intervalOptions = {
  day: 'daily',
  week: 'weekly',
  month: 'monthly',
  year: 'yearly',
};

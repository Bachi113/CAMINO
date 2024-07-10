import { HiOutlineArchiveBox } from 'react-icons/hi2';
import { BsBox } from 'react-icons/bs';
import { PiUsers } from 'react-icons/pi';
import { RxDashboard } from 'react-icons/rx';

// const sidebarLinks = [
//   { label: 'Dashboard', path: '/dashboard', logo: <RxDashboard size={18} strokeWidth={0.1} /> },
//   { label: 'Orders', path: '/orders', logo: <HiOutlineArchiveBox size={20} /> },
//   { label: 'Products', path: '/products', logo: <BsBox size={15} strokeWidth={0.4} /> },
//   { label: 'Customers', path: '/customers', logo: <PiUsers size={20} /> },
//   // { label: 'Transactions', path: '/transactions', logo: TransactionsIcon },
//   { label: 'Account Settings', path: '/account-settings', logo: <IoSettingsOutline size={20} /> },
// ];

export const commonLinks = [
  { label: 'Dashboard', path: '/dashboard', logo: <RxDashboard size={18} strokeWidth={0.1} /> },
  { label: 'Orders', path: '/orders', logo: <HiOutlineArchiveBox size={20} /> },
  // { label: 'Transactions', path: '/transactions', logo: TransactionsIcon },
];

export const merchantLinks = [
  { label: 'Products', path: '/products', logo: <BsBox size={15} strokeWidth={0.4} /> },
  { label: 'Customers', path: '/customers', logo: <PiUsers size={20} /> },
];

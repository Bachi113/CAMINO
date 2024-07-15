import { HiOutlineArchiveBox } from 'react-icons/hi2';
import { BsBox } from 'react-icons/bs';
import { PiUsers } from 'react-icons/pi';
import { RxDashboard } from 'react-icons/rx';
import { TbCreditCard } from 'react-icons/tb';
import { FaShop } from 'react-icons/fa6';

// const sidebarLinks = [
//   { label: 'Dashboard', path: '/dashboard', logo: <RxDashboard size={18} strokeWidth={0.1} /> },
//   { label: 'Orders', path: '/orders', logo: <HiOutlineArchiveBox size={20} /> },
//   { label: 'Products', path: '/products', logo: <BsBox size={15} strokeWidth={0.4} /> },
//   { label: 'Customers', path: '/customers', logo: <PiUsers size={20} /> },
//   // { label: 'Transactions', path: '/transactions', logo: TransactionsIcon },
//   { label: 'Account Settings', path: '/account-settings', logo: <IoSettingsOutline size={20} /> },
// ];

export const commonLinks = [
  { label: 'Dashboard', path: '/dashboard', logo: <RxDashboard size={17} strokeWidth={0.1} /> },
  { label: 'Orders', path: '/orders', logo: <HiOutlineArchiveBox size={18} /> },
  { label: 'Transactions', path: '/transactions', logo: <TbCreditCard size={24} strokeWidth={1.4} /> },
];

export const merchantLinks = [
  { label: 'Products', path: '/products', logo: <BsBox size={15} strokeWidth={0.4} /> },
  { label: 'Customers', path: '/customers', logo: <PiUsers size={20} /> },
];

export const adminLinks = [
  { label: 'Merchants', path: '/merchants', logo: <FaShop size={15} /> },
  { label: 'Customers', path: '/customers', logo: <PiUsers size={20} /> },
];

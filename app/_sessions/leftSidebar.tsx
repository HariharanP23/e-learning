'use client';

import Link from 'next/link';
import { Home, Users, ShoppingBag, BarChart2, Settings, HelpCircle, Menu, X } from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function LeftSidebar({ sidebarOpen, toggleSidebar }: SidebarProps) {
  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-indigo-700 text-white transition-all duration-300 ease-in-out overflow-hidden fixed h-full z-10`}>
      <div className="flex items-center justify-between p-4 border-b border-indigo-800">
        {sidebarOpen && <h1 className="text-xl font-bold">Dashboard</h1>}
        <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-indigo-600">
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <nav className="mt-5">
        <Link href="/" className="flex items-center px-4 py-3 text-white hover:bg-indigo-600">
          <Home size={20} />
          {sidebarOpen && <span className="ml-3">Dashboard</span>}
        </Link>
        <Link href="/users" className="flex items-center px-4 py-3 text-white hover:bg-indigo-600">
          <Users size={20} />
          {sidebarOpen && <span className="ml-3">Users</span>}
        </Link>
        <Link href="/products" className="flex items-center px-4 py-3 text-white hover:bg-indigo-600">
          <ShoppingBag size={20} />
          {sidebarOpen && <span className="ml-3">Products</span>}
        </Link>
        <Link href="/analytics" className="flex items-center px-4 py-3 text-white hover:bg-indigo-600">
          <BarChart2 size={20} />
          {sidebarOpen && <span className="ml-3">Analytics</span>}
        </Link>
        <Link href="/settings" className="flex items-center px-4 py-3 text-white hover:bg-indigo-600">
          <Settings size={20} />
          {sidebarOpen && <span className="ml-3">Settings</span>}
        </Link>
        <Link href="/help" className="flex items-center px-4 py-3 text-white hover:bg-indigo-600">
          <HelpCircle size={20} />
          {sidebarOpen && <span className="ml-3">Help & Support</span>}
        </Link>
      </nav>
    </div>
  );
}

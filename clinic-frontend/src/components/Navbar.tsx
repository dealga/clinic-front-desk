// src/components/Navbar.tsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { authService } from '../services/api';

const Navbar: React.FC = () => {
  const router = useRouter();
  const user = authService.getUser();

  const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };

  const isActive = (path: string) => router.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-primary-600">
            Clinic Front Desk
          </Link>
          
          <div className="flex space-x-6">
            <Link 
              href="/" 
              className={`hover:text-primary-600 ${isActive('/') ? 'text-primary-600 font-medium' : 'text-gray-600'}`}
            >
              Dashboard
            </Link>
            <Link 
              href="/queue" 
              className={`hover:text-primary-600 ${isActive('/queue') ? 'text-primary-600 font-medium' : 'text-gray-600'}`}
            >
              Queue
            </Link>
            <Link 
              href="/appointments" 
              className={`hover:text-primary-600 ${isActive('/appointments') ? 'text-primary-600 font-medium' : 'text-gray-600'}`}
            >
              Appointments
            </Link>
            <Link 
              href="/doctors" 
              className={`hover:text-primary-600 ${isActive('/doctors') ? 'text-primary-600 font-medium' : 'text-gray-600'}`}
            >
              Doctors
            </Link>
            <Link 
              href="/patients" 
              className={`hover:text-primary-600 ${isActive('/patients') ? 'text-primary-600 font-medium' : 'text-gray-600'}`}
            >
              Patients
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, {user?.username}</span>
            <button 
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


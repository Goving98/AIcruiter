'use client';

import LogoutButton from '@/app/components/LogoutButton';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import toast from 'react-hot-toast';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userType = localStorage.getItem('userType');
    if (!isLoggedIn) {
        toast.error('Please login to access this page');
        router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-300">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-40 bg-gradient-to-br from-gray-200 to-indigo-200  border-b rounded-bl-2xl rounded-br-2xl border-indigo-500">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          {/* Left side: Back + Logo */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
              AI-cruiter
            </h1>
          </div>

          {/* Center Nav Links */}
          <div className="hidden md:flex space-x-8">
            <button className="font-medium text-gray-600 hover:text-indigo-600">Schedule</button>
            <button className="font-medium text-gray-600 hover:text-indigo-600">Applications</button>
            <button className="font-medium text-gray-600 hover:text-indigo-600">Results</button>
          </div>

          {/* Right side: Logout */}
          <div>
            <LogoutButton />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pt-24 pb-8">
        {children}
      </main>
    </div>
  );
}

'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import LogoutButton from '@/app/components/LogoutButton';
import toast from 'react-hot-toast';

interface InterviewCard {
  date: string;
  company: string;
  role: string;
  timeSlot: string;
  status: 'ACTIVE' | 'UPCOMING';
}

const mockInterviews: InterviewCard[] = [
  {
    date: 'Sep 6',
    company: 'Some Name 1',
    role: 'Software Developer',
    timeSlot: '12pm till 8pm',
    status: 'ACTIVE',
  },
  {
    date: 'Sep 18',
    company: 'Some Name 1',
    role: 'Software Developer',
    timeSlot: '12pm till 8pm',
    status: 'UPCOMING',
  },
  {
    date: 'Sep 20',
    company: 'Some Name 1',
    role: 'Software Developer',
    timeSlot: '12pm till 8pm',
    status: 'UPCOMING',
  },
];

export default function StudentDashboard() {
    const router = useRouter();
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    useEffect(() => {
        // Check if user is logged in and is a company
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const userType = localStorage.getItem('userType');
        
        if (!isLoggedIn || userType !== 'recruiter') {
          toast.error('Please login to access this page');
          router.push('/login');
        }
      }, [router]);


    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
        <LogoutButton /> {/* Logout Button */}
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="fixed top-4 left-4 p-2 flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back
        </button>
  
        {/* Navigation */}
        <nav className="bg-white shadow-lg border-b border-indigo-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                AI-cruiter
              </h1>
              <div className="flex space-x-8">
                <button className="font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                  SCHEDULE
                </button>
                <button className="font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                  APPLICATIONS
                </button>
                <button className="font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                  RESULTS
                </button>
              </div>
            </div>
          </div>
        </nav>
  
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockInterviews.map((interview, index) => (
              <button
                key={index}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => console.log(`Clicked interview on ${interview.date}`)}
                className={`relative overflow-hidden rounded-xl p-6 transition-all duration-300 transform 
                  ${hoveredCard === index ? 'scale-105' : 'scale-100'}
                  ${interview.status === 'ACTIVE' 
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl' 
                    : 'bg-white text-gray-800 shadow-md hover:shadow-xl'
                  }`}
              >
                <div className="absolute top-0 right-0 p-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium
                    ${interview.status === 'ACTIVE' 
                      ? 'bg-white text-indigo-600' 
                      : 'bg-gray-100 text-gray-600'
                    }`}>
                    {interview.status}
                  </span>
                </div>
  
                <div className="text-center space-y-4">
                  <p className="text-lg font-medium">MONDAY</p>
                  <h2 className="text-3xl font-bold">{interview.date}</h2>
                  
                  <div className="space-y-3 mt-4">
                    <div>
                      <p className={`text-sm ${interview.status === 'ACTIVE' ? 'text-indigo-100' : 'text-gray-500'}`}>
                        Time slot
                      </p>
                      <p className="font-medium">{interview.timeSlot}</p>
                    </div>
                    
                    <div>
                      <p className={`text-sm ${interview.status === 'ACTIVE' ? 'text-indigo-100' : 'text-gray-500'}`}>
                        Company
                      </p>
                      <p className="font-medium">{interview.company}</p>
                    </div>
                    
                    <div>
                      <p className={`text-sm ${interview.status === 'ACTIVE' ? 'text-indigo-100' : 'text-gray-500'}`}>
                        Role
                      </p>
                      <p className="font-medium">{interview.role}</p>
                    </div>
                  </div>
                </div>
                
                <div className={`absolute inset-0 bg-white opacity-0 transition-opacity duration-300
                  ${hoveredCard === index ? 'opacity-5' : ''}`} 
                />
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }
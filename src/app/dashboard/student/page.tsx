'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface InterviewCard {
  id: number;
  date: string;
  company: string;
  role: string;
  timeSlot: string;
  status: 'ACTIVE' | 'UPCOMING';
}

const mockInterviews: InterviewCard[] = [
  {
    id: 1,
    date: 'Sep 6',
    company: 'Some Name 1',
    role: 'Software Developer',
    timeSlot: '12pm till 8pm',
    status: 'ACTIVE',
  },
  {
    id: 2,
    date: 'Sep 18',
    company: 'Some Name 1',
    role: 'Software Developer',
    timeSlot: '12pm till 8pm',
    status: 'UPCOMING',
  },
  {
    id: 3,
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
        // Check if user is logged in and is a student
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const userType = localStorage.getItem('userType');
        console.log('isLoggedIn:', isLoggedIn, 'userType:', userType);
        console.log(!isLoggedIn || userType !== 'recruitee');
        console.log(!isLoggedIn );
        console.log(userType !== 'recruitee');
        if (!isLoggedIn || userType !== 'recruitee') {
          toast.error('Please login to access this page');
          router.push('/login');
        }
      }, [router]);

    const handleCardClick = (interview: InterviewCard) => {
        router.push(`/interview/${interview.date.replace(/\s/g, '-')}/upload`);
    };

    return (
      <div className="min-h-screen bg-center">
        
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockInterviews.map((interview, index) => (
              <button
                key={index}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => {
                  if (interview.status !== 'UPCOMING') {
                    handleCardClick(interview);
                  }
                }}
                disabled={interview.status === 'UPCOMING'}
                className={`relative overflow-hidden rounded-xl p-6 transition-all duration-300 transform 
                  ${hoveredCard === index ? 'scale-105' : 'scale-100'}
                  ${interview.status === 'ACTIVE' 
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl' 
                    : 'bg-red-50 text-gray-800 shadow-md hover:shadow-xl'
                  }`}
              >
                <div className="absolute top-0 right-0 p-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium
                    ${interview.status === 'ACTIVE' 
                      ? 'bg-white text-indigo-600' 
                      : 'bg-sky-200 text-gray-600'
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

  
'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface InterviewCard {
  id: string;
  date: string;
  company: string;
  role: string;
  timeSlot: string;
  status: 'ACTIVE' | 'UPCOMING';
  createdAt?: string;
  title: string;
}

export default function StudentDashboard() {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [interviews, setInterviews] = useState<InterviewCard[]>([]);

  useEffect(() => {
    // Check if user is logged in and is a student
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userType = localStorage.getItem('userType');
    if (!isLoggedIn || userType !== 'recruitee') {
      toast.error('Please login to access this page');
      router.push('/login');
      return;
    }

    const token = localStorage.getItem('token');
    const fetchInterviews = async () => {
      try {
        const res = await fetch('/api/dashboard/student/display', {
          method: 'GET',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error('Failed to fetch interviews');
        const data = await res.json();

        const now = new Date();
        const mapped = data.map((interview: any) => {
          // Ensure timeStart and timeEnd are present
          const { timeStart, timeEnd } = interview;
          let status: 'ACTIVE' | 'UPCOMING' = 'UPCOMING';

          if (timeStart && timeEnd) {
            const start = new Date(`${interview.date}T${timeStart}`);
            const end = new Date(`${interview.date}T${timeEnd}`);
            if (now >= start && now <= end) {
              status = 'ACTIVE';
            }
          }

          return {
            ...interview,
            timeSlot: timeStart && timeEnd ? `${timeStart} - ${timeEnd}` : '',
            status,
          };
        });

        setInterviews(mapped);
      } catch (err) {
        toast.error('Failed to fetch interviews');
      }
    };

    fetchInterviews();
  }, [router]);

  const handleCardClick = (interview: InterviewCard) => {
    if (interview.status !== 'ACTIVE') {
      toast.error('This interview is not active');
      return;
    }
    router.push(`/interview/${interview.date.replace(/\s/g, '-')}/upload`);
  };

  return (
    <div className="min-h-screen bg-center">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.map((interview, index) => (
            <button
              key={interview.id}
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
                <h2 className="text-3xl font-bold">{interview.title}</h2>
                
                <div className="space-y-3 mt-4">
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
                  <div>
                    <p className={`text-sm ${interview.status === 'ACTIVE' ? 'text-indigo-100' : 'text-gray-500'}`}>
                      Date
                    </p>
                    <p className="font-medium">{interview.date}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${interview.status === 'ACTIVE' ? 'text-indigo-100' : 'text-gray-500'}`}>
                      Time slot
                    </p>
                    <p className="font-medium">{interview.timeSlot}</p>
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
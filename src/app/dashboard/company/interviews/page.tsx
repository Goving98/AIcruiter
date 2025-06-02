'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// Define interface for interview data from MongoDB
interface Interview {
  _id: string;
  title: string;
  role: string;
  technologies: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  description: string;
  companyEmail: string;
  companyId: string;
  company: string;
  candidateEmails: string[];
  createdAt: string;
}

const bgColors = [
  'bg-blue-100',
  'bg-green-100',
  'bg-purple-100',
  'bg-yellow-100',
  'bg-pink-100',
];

export default function InterviewDetailPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please login to continue');
          router.push('/login');
          return;
        }

        const response = await fetch('/api/dashboard/company/results', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch interviews');
        }

        const data = await response.json();
        setInterviews(data);
      } catch (error) {
        console.error('Error fetching interviews:', error);
        toast.error('Failed to load interviews');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterviews();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {interviews.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>No interviews found</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          {interviews.map((interview, idx) => {
            const isExpanded = expandedId === interview._id;
            const bgColor = bgColors[idx % bgColors.length];

            return (
              <motion.div
                layout
                key={interview._id}
                className={cn(
                  'transition-all duration-300',
                  isExpanded ? 'col-span-full' : '',
                  bgColor,
                  'rounded-xl shadow-md p-4 cursor-pointer'
                )}
                onClick={() => setExpandedId(isExpanded ? null : interview._id)}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-indigo-700">{interview.title}</h2>
                  <span className="text-sm text-gray-600">
                    {new Date(interview.date).toLocaleDateString()} | {interview.timeStart} - {interview.timeEnd}
                  </span>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                      className="overflow-hidden mt-4"
                    >
                      <p className="mb-2 text-gray-700">
                        <strong>Role:</strong> {interview.role}
                      </p>
                      <p className="mb-2 text-gray-700">
                        <strong>Technologies:</strong> {interview.technologies}
                      </p>
                      <p className="mb-4 text-gray-700">
                        <strong>Description:</strong> {interview.description}
                      </p>

                      <div className="mb-4">
                        <h3 className="text-lg font-medium text-indigo-600">Candidates</h3>
                        {interview.candidateEmails.map((email, i) => (
                          <p key={i} className="text-sm text-gray-600">
                            {email}
                          </p>
                        ))}
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">
                          Created: {new Date(interview.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
'use client';

import { cn } from '@/lib/utils'; // Assuming you have a utility function for classnames
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const interviews = [
  {
    id: 1,
    title: 'Frontend Dev Interview',
    date: 'May 20',
    time: '10am - 12pm',
    description: 'Frontend interview for React and Tailwind expertise.',
    role: 'Frontend Developer',
    results: [
      { name: 'Rick Astley', score: 85, result: 'Passed' },
      { name: 'Ranvijay Singh', score: 60, result: 'Pending' },
    ],
    applications: [
      { applicant: 'Bhabhi-2', status: 'Reviewed' },
      { applicant: 'Baburao', status: 'Pending' },
    ],
  },
  {
    id: 2,
    title: 'ITUS - Iski Topi Uske Sar Interview',
    date: 'May 22',
    time: '2pm - 4pm',
    description: 'Backend interview focused on Node.js and database knowledge.',
    role: 'Backend Developer',
    results: [
      { name: 'Raju', score: 90, result: 'Passed' },
      { name: 'Baburao Ganpatrao', score: 70, result: 'Pending' },
    ],
    applications: [
      { applicant: 'Neil Gogte', status: 'Reviewed' },
      { applicant: 'Iyer Idli', status: 'Pending' },
    ],
  },
];

const bgColors = [
  'bg-blue-100',
  'bg-green-100',
  'bg-purple-100',
  'bg-yellow-100',
  'bg-pink-100',
];

export default function InterviewDetailPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {interviews.map((interview, idx) => {
          const isExpanded = expandedId === interview.id;
          const bgColor = bgColors[idx % bgColors.length];

          return (
            <motion.div
              layout
              key={interview.id}
              className={cn(
                'transition-all duration-300',
                isExpanded ? 'col-span-full' : '',
                bgColor,
                'rounded-xl shadow-md p-4 cursor-pointer'
              )}
              onClick={() => setExpandedId(isExpanded ? null : interview.id)}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-indigo-700">{interview.title}</h2>
                <span className="text-sm text-gray-600">{interview.date} | {interview.time}</span>
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
                    <p className="mb-4 text-gray-700">
                      <strong>Description:</strong> {interview.description}
                    </p>

                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-indigo-600">Applications</h3>
                      {interview.applications.map((app, i) => (
                        <p key={i} className="text-sm text-gray-600">
                          {app.applicant} - {app.status}
                        </p>
                      ))}
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-indigo-600">Results</h3>
                      {interview.results.map((res, i) => (
                        <p key={i} className="text-sm text-gray-600">
                          {res.name}: {res.score} - {res.result}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

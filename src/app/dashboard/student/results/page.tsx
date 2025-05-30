'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface ResultCard {
  date: string;
  company: string;
  role: string;
  score: number;
}

const mockResults: ResultCard[] = [
  { date: 'Sep 6', company: 'Some Name 1', role: 'Software Developer', score: 85 },
  { date: 'Sep 18', company: 'Some Name 1', role: 'Software Developer', score: 90 },
  { date: 'Sep 20', company: 'Some Name 1', role: 'Software Developer', score: 75 },]

export default function StudentResults() {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    // Check if user is logged in and is a student
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userType = localStorage.getItem('userType');
    if (!isLoggedIn || userType !== 'recruitee') {
      toast.error('Please login to access this page');
      router.push('/login');
    }
  }, [router]);

  const handleRowClick = (result: ResultCard) => {
    router.push(`/dashboard/student/results/${result.date.replace(/\s/g, '-')}`);
  };

  return (
    <div className="p-4 min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-200">
        <h1 className="text-2xl font-bold mb-6 text-black">Your Results</h1>
        <div className="max-w-2xl mx-auto space-y-4">
        {mockResults.map((result, index) => (
            <div
            key={index}
            className="group bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row md:items-center md:justify-between border border-indigo-100 transition cursor-pointer text-black
                hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:text-white hover:shadow-xl"
            onClick={() => handleRowClick(result)}
            >
            <div>
                <div className="text-lg font-semibold group-hover:text-white">{result.company}</div>
                <div className="text-sm text-gray-600 group-hover:text-white">{result.role}</div>
                <div className="text-xs text-gray-400 mt-1 group-hover:text-white">Date: {result.date}</div>
            </div>
            <div className="mt-4 md:mt-0">
                <span className="text-xl font-bold text-green-600 group-hover:text-white">{result.score}</span>
                <span className="ml-2 text-gray-700 font-medium group-hover:text-white">Score</span>
            </div>
            </div>
        ))}
        </div>
        <div className="flex justify-center gap-4 pt-2">
                    <button
                        onClick={() =>
                            router.push('/dashboard/student')
                        }
                        className="px-5 py-2 rounded bg-accent-500 hover:bg-accent-400 transition-all text-black"
                    >
                        Back to Dashboard
                    </button>
                </div>
    </div>
    );
}


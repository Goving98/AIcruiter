'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface ResultCard {
  id: string;
  title: string;
  date: string;
  company: string;
  role: string;
  createdAt?: string;
}

export default function StudentResults() {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [results, setResults] = useState<ResultCard[]>([]);

  useEffect(() => {
    // Check if user is logged in and is a recruiter
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userType = localStorage.getItem('userType');
    if (!isLoggedIn || userType !== 'recruiter') {
      toast.error('Please login to access this page');
      router.push('/login');
      return;
    }

    const token = localStorage.getItem('token');

    // Fetch results from API (GET)
    const fetchResults = async () => {
    try {
      const res = await fetch('/api/dashboard/company/results', {
        method: 'GET',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error('Failed to fetch results');
      const data = await res.json();
      setResults(data.map((item: any) => ({
        ...item,
        id: item.id || item._id?.toString() || '', // ensure id is present and string
      })));
      console.log('Fetched results:', data);
    } catch (err) {
      toast.error('Failed to fetch results');
    }
  };
  fetchResults();
}, [router]);

  const handleRowClick = (result: ResultCard) => {
    localStorage.setItem('selectedInterviewId', result.id);
    router.push(`/dashboard/company/results/${result.id}`);
  };

  // Sort results by createdAt descending (most recent first)
  const sortedResults = [...results].sort((a, b) => {
    if (!a.createdAt || !b.createdAt) return 0;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="p-4 min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-200">
      <h1 className="text-2xl font-bold mb-6 text-black">Your Results</h1>
      <div className="max-w-2xl mx-auto space-y-4">
        {sortedResults.map((result, index) => (
          <div
            key={index}
            className="group bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row md:items-center md:justify-between border border-indigo-100 transition cursor-pointer text-black
                hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:text-white hover:shadow-xl"
            onClick={() => handleRowClick(result)}
          >
            <div>
              <div className="text-lg font-semibold group-hover:text-white">{result.title}</div>
              <div className="text-sm text-gray-600 group-hover:text-white">{result.role}</div>
              <div className="text-xs text-gray-400 mt-1 group-hover:text-white">Date: {result.date}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4 pt-2">
        <button
          onClick={() => router.push('/dashboard/company')}
          className="px-5 py-2 rounded bg-accent-500 hover:bg-accent-400 transition-all text-black"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}